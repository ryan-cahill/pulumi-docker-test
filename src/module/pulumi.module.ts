import { ApplyInputs, BaseModule, BuildInputs, ImageDigest, PulumiStateString } from "./base.module";
import { spawnSync } from 'child_process';

export class PulumiModule extends BaseModule {
  // build an image that pulumi code can be run on
  async build(inputs: BuildInputs): Promise<ImageDigest> {
    const args = ['build', '--file', 'Dockerfile', inputs.directory, '--quiet'];
    const docker_result = spawnSync('docker', args, { cwd: inputs.directory });
    if (docker_result.error) {
      throw docker_result.error;
    }
    return docker_result.stdout.toString().replace('sha256:', '').trim();
  }

  // run pulumi image and apply provided pulumi
  async apply(inputs: ApplyInputs): Promise<PulumiStateString> {
    // set variables as secrets for the pulumi stack
    let pulumi_config = '';
    if ((inputs.inputs || []).length) {
      const config_pairs = inputs.inputs.map(([key, value]) => `--secret ${key}=${value}`).join(' '); 
      pulumi_config = `pulumi config --stack ${inputs.datacenter_id} set-all ${config_pairs} &&`;
    }
    const apply_or_destroy = inputs.destroy ? 'destroy' : 'up';
    const environment = ['-e', 'PULUMI_CONFIG_PASSPHRASE=']; // ignore this pulumi requirement

    // set pulumi state to the state passed in, if it was supplied
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
    if (docker_result.error) {
      throw docker_result.error;
    }

    return docker_result.stdout.toString().split(state_delimiter)[1];
  }
}
