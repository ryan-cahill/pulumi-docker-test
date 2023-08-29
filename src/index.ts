import { PulumiModule } from "./module/pulumi.module"
import { Server, ServerCredentials } from '@grpc/grpc-js';
import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { BuildRequest, BuildResponse, ApplyRequest, ApplyResponse } from './proto/arcctlpulumi_pb';
import { ArcctlPulumiService } from './proto/arcctlpulumi_grpc_pb';

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
  const apply_request = call.request.toObject();
  const pulumi_module = new PulumiModule();

  const apply_state = await pulumi_module.apply({ 
    datacenter_id: apply_request.datacenterId,
    image: apply_request.image,
    inputs: apply_request.inputsMap,
    state: apply_request.pulumiState ? JSON.parse(apply_request.pulumiState) : undefined,
    destroy: apply_request.destroy,
  });

  const apply_response = new ApplyResponse();
  apply_response.setPulumiState(apply_state);
  callback(null, apply_response); // TODO: pass error?
}

function main() {
  const server_port = 50051;
  const server = new Server();
  server.addService(ArcctlPulumiService, { build: buildImage, apply: applyPulumi });
  server.bindAsync(`0.0.0.0:${server_port}`, ServerCredentials.createInsecure(), () => { 
    console.log(`Started server on port ${server_port}`);
    server.start();
  });
}

main();
