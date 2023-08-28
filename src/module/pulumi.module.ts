import { ApplyInputs, BaseModule, BuildInputs } from "./base.module";
import { SpawnSyncReturns, spawnSync } from 'child_process';
// import { State } from '@pulumi/pulumi' // TODO: import/use state interface for apply return type

export class PulumiModule extends BaseModule {
  // build an image that pulumi code can be run on
  async build(inputs: BuildInputs): Promise<string> {
    const args = ['build', '--file', 'Dockerfile', inputs.directory, '--quiet'];
    const output = spawnSync('docker', args, { cwd: inputs.directory }); 
    this.checkCommandOutput(output);
    return output.stdout.toString().replace('sha256:', '').trim();
  }

  // run pulumi image and apply provided pulumi
  async apply(inputs: ApplyInputs): Promise<string> {
    // set variables as secrets for the pulumi stack
    let pulumi_config = '';
    if (Object.keys(inputs.inputs || {}).length) { // TODO: this may or may not be flattened, flatten it here
      const config_pairs = Object.entries(inputs.inputs).map(([key, value]) => `--secret ${key}=${value}`); 
      pulumi_config = `pulumi config --stack ${inputs.datacenter_id} set-all ${config_pairs} &&`;
    }
    const apply_or_destroy = inputs.destroy ? 'destroy' : 'up';
    const environment = ['-e', 'PULUMI_CONFIG_PASSPHRASE='];
    for (const [key, value] of Object.entries(inputs.account_credentials)) {
      environment.push('-e');
      environment.push(`${key}=${value}`);
    }
    const state_file = 'pulumi-state.json';

    const state_write_cmd = inputs.state ? `echo '${JSON.stringify(inputs.state)}' > ${state_file}` : '';
    const state_import_cmd = inputs.state ? `pulumi stack import --stack ${inputs.datacenter_id} --file ${state_file} &&` : '';

    const state_delimiter = '****STATE_DELIMITER****';
    const args = [
      'run', 
      '--entrypoint', 
      'bash', 
      ...environment,
      inputs.image, 
      '-c', 
      `
        ${state_write_cmd}
        pulumi login --local &&
        pulumi stack init --stack ${inputs.datacenter_id} &&
        ${state_import_cmd}
        pulumi refresh --stack ${inputs.datacenter_id} --non-interactive --yes &&
        ${pulumi_config} 
        pulumi ${apply_or_destroy} --stack ${inputs.datacenter_id} --non-interactive --yes &&
        echo "${state_delimiter}" &&
        pulumi stack export --stack ${inputs.datacenter_id}
      ` // TODO: how does state get returned if the apply fails? can the failure be caught?
    ];
    const docker_result = spawnSync('docker', args, { stdio: 'pipe' });
    this.checkCommandOutput(docker_result); 

    return docker_result.stdout.toString().split(state_delimiter)[1];
  }

  checkCommandOutput(output: SpawnSyncReturns<Buffer>) {
    if (output.stderr?.length || output.error) {
      if (output.stderr) {
        throw new Error(output.stderr?.toString());
      } else {
        throw output.error;
      }
    } else if (output.stdout) {
      console.log(output.stdout.toString());
    }
  }
}
