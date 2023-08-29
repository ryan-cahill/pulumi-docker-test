// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var arcctlpulumi_pb = require('./arcctlpulumi_pb.js');

function serialize_ApplyRequest(arg) {
  if (!(arg instanceof arcctlpulumi_pb.ApplyRequest)) {
    throw new Error('Expected argument of type ApplyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ApplyRequest(buffer_arg) {
  return arcctlpulumi_pb.ApplyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ApplyResponse(arg) {
  if (!(arg instanceof arcctlpulumi_pb.ApplyResponse)) {
    throw new Error('Expected argument of type ApplyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ApplyResponse(buffer_arg) {
  return arcctlpulumi_pb.ApplyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_BuildRequest(arg) {
  if (!(arg instanceof arcctlpulumi_pb.BuildRequest)) {
    throw new Error('Expected argument of type BuildRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_BuildRequest(buffer_arg) {
  return arcctlpulumi_pb.BuildRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_BuildResponse(arg) {
  if (!(arg instanceof arcctlpulumi_pb.BuildResponse)) {
    throw new Error('Expected argument of type BuildResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_BuildResponse(buffer_arg) {
  return arcctlpulumi_pb.BuildResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var ArcctlPulumiService = exports.ArcctlPulumiService = {
  build: {
    path: '/ArcctlPulumi/Build',
    requestStream: false,
    responseStream: false,
    requestType: arcctlpulumi_pb.BuildRequest,
    responseType: arcctlpulumi_pb.BuildResponse,
    requestSerialize: serialize_BuildRequest,
    requestDeserialize: deserialize_BuildRequest,
    responseSerialize: serialize_BuildResponse,
    responseDeserialize: deserialize_BuildResponse,
  },
  apply: {
    path: '/ArcctlPulumi/Apply',
    requestStream: false,
    responseStream: false,
    requestType: arcctlpulumi_pb.ApplyRequest,
    responseType: arcctlpulumi_pb.ApplyResponse,
    requestSerialize: serialize_ApplyRequest,
    requestDeserialize: deserialize_ApplyRequest,
    responseSerialize: serialize_ApplyResponse,
    responseDeserialize: deserialize_ApplyResponse,
  },
};

exports.ArcctlPulumiClient = grpc.makeGenericClientConstructor(ArcctlPulumiService);
