import { ApplyInputs, BaseModule, BuildInputs, ImageDigest, PulumiStateString } from "./base.module";
import { spawnSync } from 'child_process';

export class PulumiModule extends BaseModule {
  // build an image that pulumi code can be run on
  build(inputs: BuildInputs): { digest?: ImageDigest, error?: string } { 
    const args = ['build', inputs.directory, '--quiet'];
    const docker_result = spawnSync('docker', args, { cwd: inputs.directory });

    let error;
    if (docker_result.error) {
      error = docker_result.error.message;
    }

    return { digest: docker_result.stdout?.toString().replace('sha256:', '').trim(), error };
  }

  // run pulumi image and apply provided pulumi
  apply(inputs: ApplyInputs): { state?: PulumiStateString, error?: string } {
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
      `
    ];
    const docker_result = spawnSync('docker', args);

    let error;
    if (docker_result.error) {
      error = docker_result.error.message;
    } else if (docker_result.stdout && !docker_result.stdout.includes(state_delimiter)) {
      error = docker_result.stdout.toString();
    }

    return { state: docker_result.stdout.toString().split(state_delimiter)[1], error };
  }
}
