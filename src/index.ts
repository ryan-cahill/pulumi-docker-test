import path from "path";
import { PulumiModule } from "./module/pulumi.module.js"

const language = 'typescript';
// const language = 'yaml';

const directory = path.join(import.meta.url.replace('file:', ''), '..', '..', 'test', language );
const account_credentials = {
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION
};
const datacenter_id = 'test-datacenter-id';

const pulumi_module = new PulumiModule();
const build_sha = await pulumi_module.build({ filename: 'Dockerfile', directory });

await pulumi_module.apply({ 
  datacenter_id,
  directory, 
  image: build_sha, 
  config: { 'world_text': 'Architect' }, 
  account_credentials,
  debug: true
});

await pulumi_module.apply({ 
  datacenter_id,
  destroy: true, 
  directory, 
  image: build_sha, 
  config: { 'world_text': 'Architect' }, 
  account_credentials,
  debug: true
});
