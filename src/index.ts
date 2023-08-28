import { PulumiModule } from "./module/pulumi.module"
import { configDotenv } from 'dotenv';
import { Server, ServerCredentials } from '@grpc/grpc-js';
import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { BuildRequest, BuildResponse, ApplyRequest, ApplyResponse } from './proto/arcctlpulumi_pb';
import { ArcctlPulumiService } from './proto/arcctlpulumi_grpc_pb';

configDotenv();

const buildImage = async (
  call: ServerUnaryCall<BuildRequest, BuildResponse>,
  callback: sendUnaryData<BuildResponse>) => 
{
  const pulumi_module = new PulumiModule();
  const image = await pulumi_module.build({ 
    directory: call.request.toObject().directory
  });
  
  const build_response = new BuildResponse();
  build_response.setImage(image);
  callback(null, build_response); // TODO: pass error?
}

const applyPulumi = async (
  call: ServerUnaryCall<ApplyRequest, ApplyResponse>,
  callback: sendUnaryData<ApplyResponse>) => 
{
  const datacenter_id = 'test-datacenter-id'; // TODO: remove
  const account_credentials = {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION
  }; // TODO: remove

  const apply_request = call.request.toObject();

  const pulumi_module = new PulumiModule();
  const apply_state = await pulumi_module.apply({ 
    datacenter_id: apply_request.datacenterId,
    image: apply_request.image,
    inputs: apply_request.inputsMap,
    account_credentials: apply_request.accountCredentialsMap,
    state: JSON.parse(apply_request.pulumiState),
  });

  const apply_response = new ApplyResponse();
  apply_response.setPulumiState(apply_state);
  callback(null, apply_response); // TODO: pass error?
}

function main() {
  const server_port = 50051;
  const server = new Server();
  server.addService(ArcctlPulumiService, { build: buildImage, apply: applyPulumi });
  server.bindAsync(`0.0.0.0:${server_port}`, ServerCredentials.createInsecure(), () => { // TODO: remove createInsecure?
    console.log(`Started server on port ${server_port}`);
    server.start();
  });
}

main();
