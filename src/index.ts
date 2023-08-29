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
  const build_result = await pulumi_module.build({ 
    directory: call.request.toObject().directory
  });
  
  if (build_result.digest) {
    const build_response = new BuildResponse();
    build_response.setImage(build_result.digest);
    callback(null, build_response); 
  } else if (build_result.error) {
    callback({ details: build_result.error, code: 2 });
  }
}

const applyPulumi = async (
  call: ServerUnaryCall<ApplyRequest, ApplyResponse>,
  callback: sendUnaryData<ApplyResponse>) => 
{
  const apply_request = call.request.toObject();
  const pulumi_module = new PulumiModule();

  const apply_result = await pulumi_module.apply({ 
    datacenter_id: apply_request.datacenterId,
    image: apply_request.image,
    inputs: apply_request.inputsMap,
    state: apply_request.pulumiState ? JSON.parse(apply_request.pulumiState) : undefined,
    destroy: apply_request.destroy,
  });

  if (apply_result.state) {
    const apply_response = new ApplyResponse();
    apply_response.setPulumiState(apply_result.state);
    callback(null, apply_response); 
  } else if (apply_result.error) {
    callback({ details: apply_result.error, code: 2 });
  }
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
