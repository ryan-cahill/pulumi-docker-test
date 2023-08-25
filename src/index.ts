import path from "path";
import { PulumiModule } from "./module/pulumi.module.js"
import { configDotenv } from 'dotenv';
import grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import { BuildRequest, BuildResponse, ApplyRequest, ApplyResponse } from './protos/arcctlpulumi_pb.js';
import { ArcctlPulumiService } from './protos/arcctlpulumi_grpc_pb.js';

configDotenv();

// const directory = path.join(import.meta.url.replace('file:', ''), '..', '..', 'test', language );
// const account_credentials = {
//   AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
//   AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
//   AWS_REGION: process.env.AWS_REGION
// };
// const datacenter_id = 'test-datacenter-id';

// const pulumi_module = new PulumiModule();
// const build_sha = await pulumi_module.build({ directory }); // TODO: pass serialized files (from grpc) to this function to be written, then to write and bundle them

// const apply_state = await pulumi_module.apply({ 
//   datacenter_id,
//   image: build_sha, 
//   inputs: { 'world_text': 'Architect' }, 
//   account_credentials,
// });

// console.log(apply_state)

// const destroy_state = await pulumi_module.apply({
//   datacenter_id,
//   destroy: true, 
//   image: build_sha, 
//   state: JSON.parse(apply_state),
//   inputs: { 'world_text': 'Architect' }, 
//   account_credentials,
// });

// console.log(destroy_state)

// make this a standalone application that opens a grpc socket for communication
// use stdin/stdout to trigger commands?
// use grpc and generate a proto contract for generic modules
// add code to dind image, code runs a grpc server, run pulumi docker things in this code's container 

// double directory mounting should be fine
//

const buildImage = async (
  call: ServerUnaryCall<BuildRequest, BuildResponse>,
  callback: sendUnaryData<BuildResponse>) => 
{
  // callback(null, {message: 'Hello ' + call.request.name});
  // const language = 'typescript';
  const language = 'yaml'; // TODO: remove
  const directory = path.join(import.meta.url.replace('file:', ''), '..', '..', 'test', language ); // TODO: remove

  const pulumi_module = new PulumiModule();
   // TODO: add serialized file content (string(s)?) to proto along with all other args to build
  const build_sha = await pulumi_module.build({ directory }); // TODO: pass serialized files (from grpc) to this function to be written, then to write and bundle them
}

const applyPulumi = async (
  call: ServerUnaryCall<ApplyRequest, ApplyResponse>,
  callback: sendUnaryData<ApplyResponse>) => 
{
  // callback(null, {message: 'Hello ' + call.request.name});
  const datacenter_id = 'test-datacenter-id'; // TODO: remove
  const account_credentials = {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION
  }; // TODO: remove

  const pulumi_module = new PulumiModule();
  const apply_state = await pulumi_module.apply({ 
    datacenter_id, // TODO: pass in
    image: call.request.build_sha, // TODO: add to proto along with all other args to apply
    inputs: { 'world_text': 'Architect' }, 
    account_credentials,
  });
}

function main() {
  const server = new grpc.Server();
  server.addService(arcctlpulumi_proto.ArcctlPulumi.service, { buildImage, applyPulumi });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

main();
