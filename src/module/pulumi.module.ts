import { ApplyInputs, BaseModule, BuildInputs } from "./base.module.js";
import { SpawnSyncReturns, spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

export class PulumiModule extends BaseModule {
  // build an image that pulumi code can be run on
  async build(inputs: BuildInputs): Promise<string> {
    const args = ['build', '--file', 'Dockerfile', '.'];
    const output = spawnSync('docker', args, { cwd: inputs.directory }); 
    this.checkCommandOutput(output);
    return output.stdout.toString().replace('sha256:', '').trim();
  }

  // run pulumi image and apply provided pulumi
  async apply(inputs: ApplyInputs): Promise<void> {
    const stdio = inputs.debug ? 'inherit' : 'pipe';

    // ~/.pulumi/credentials.json must exist
    const pulumi_config_dir = path.join(os.homedir(), '.pulumi');
    if (!fs.existsSync(pulumi_config_dir)) {
      fs.mkdirSync(pulumi_config_dir);
    }
    const credentials_file = path.join(pulumi_config_dir, 'credentials.json');
    if (!fs.existsSync(credentials_file)) {
      fs.writeFileSync(credentials_file, '{}');
    }

    // set variables as secrets for the pulumi stack
    let pulumi_config = '';
    if (Object.keys(inputs.config || {}).length) {
      const config_pairs = Object.entries(inputs.config).map(([key, value]) => `--secret ${key}=${value}`); 
      pulumi_config = `pulumi config --stack ${inputs.datacenter_id} set-all ${config_pairs} &&`;
    }

    // set host and container volumes
    const container_state_directory = '/app/pulumi-state';
    const host_state_directory = path.join(os.homedir(), '.config', 'arcctl', 'pulumi-state', inputs.datacenter_id);
    if (!fs.existsSync(host_state_directory)) {
      fs.mkdirSync(host_state_directory);
    }

    // log in and initialize pulumi stack on the local machine
    const login_result = spawnSync('pulumi', ['login', `file://${host_state_directory}`], { stdio, env: { PATH: process.env.PATH } });
    this.checkCommandOutput(login_result);
    const init_result = spawnSync('pulumi', ['stack', 'init', '--stack', inputs.datacenter_id], { stdio, cwd: inputs.directory, env: { PULUMI_CONFIG_PASSPHRASE: '', PATH: process.env.PATH } });
    this.checkCommandOutput(init_result);

    const pulumi_login = `pulumi login file://${container_state_directory} &&`;
    const apply_or_destroy = inputs.destroy ? 'destroy' : 'up';
    const environment = ['-e', 'PULUMI_CONFIG_PASSPHRASE='];
    for (const [key, value] of Object.entries(inputs.account_credentials)) {
      environment.push('-e');
      environment.push(`${key}=${value}`);
    }
    const args = [
      'run', 
      '--entrypoint', 
      'bash', 
      ...environment, 
      '-v',
      `${host_state_directory}:${container_state_directory}`, // mount pulumi stack state to container
      inputs.image, 
      '-c', 
      `${pulumi_login} ${pulumi_config} pulumi ${apply_or_destroy} --stack ${inputs.datacenter_id} --non-interactive --yes`
    ];
    const docker_result = spawnSync('docker', args, { stdio, cwd: inputs.directory }); 
    this.checkCommandOutput(docker_result);
  }

  checkCommandOutput(output: SpawnSyncReturns<Buffer>) {
    if (output.stderr?.length) {
      throw new Error(output.stderr.toString());
    } else if (output.stdout) {
      console.log(output.stdout.toString());
    }
  }
}
