// package: 
// file: protos/arcctlpulumi.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as protos_arcctlpulumi_pb from "../protos/arcctlpulumi_pb";

interface IArcctlPulumiService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    build: IArcctlPulumiService_IBuild;
    apply: IArcctlPulumiService_IApply;
}

interface IArcctlPulumiService_IBuild extends grpc.MethodDefinition<protos_arcctlpulumi_pb.BuildRequest, protos_arcctlpulumi_pb.BuildResponse> {
    path: "/ArcctlPulumi/Build";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<protos_arcctlpulumi_pb.BuildRequest>;
    requestDeserialize: grpc.deserialize<protos_arcctlpulumi_pb.BuildRequest>;
    responseSerialize: grpc.serialize<protos_arcctlpulumi_pb.BuildResponse>;
    responseDeserialize: grpc.deserialize<protos_arcctlpulumi_pb.BuildResponse>;
}
interface IArcctlPulumiService_IApply extends grpc.MethodDefinition<protos_arcctlpulumi_pb.ApplyRequest, protos_arcctlpulumi_pb.ApplyResponse> {
    path: "/ArcctlPulumi/Apply";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<protos_arcctlpulumi_pb.ApplyRequest>;
    requestDeserialize: grpc.deserialize<protos_arcctlpulumi_pb.ApplyRequest>;
    responseSerialize: grpc.serialize<protos_arcctlpulumi_pb.ApplyResponse>;
    responseDeserialize: grpc.deserialize<protos_arcctlpulumi_pb.ApplyResponse>;
}

export const ArcctlPulumiService: IArcctlPulumiService;

export interface IArcctlPulumiServer extends grpc.UntypedServiceImplementation {
    build: grpc.handleUnaryCall<protos_arcctlpulumi_pb.BuildRequest, protos_arcctlpulumi_pb.BuildResponse>;
    apply: grpc.handleUnaryCall<protos_arcctlpulumi_pb.ApplyRequest, protos_arcctlpulumi_pb.ApplyResponse>;
}

export interface IArcctlPulumiClient {
    build(request: protos_arcctlpulumi_pb.BuildRequest, callback: (error: grpc.ServiceError | null, response: protos_arcctlpulumi_pb.BuildResponse) => void): grpc.ClientUnaryCall;
    build(request: protos_arcctlpulumi_pb.BuildRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: protos_arcctlpulumi_pb.BuildResponse) => void): grpc.ClientUnaryCall;
    build(request: protos_arcctlpulumi_pb.BuildRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: protos_arcctlpulumi_pb.BuildResponse) => void): grpc.ClientUnaryCall;
    apply(request: protos_arcctlpulumi_pb.ApplyRequest, callback: (error: grpc.ServiceError | null, response: protos_arcctlpulumi_pb.ApplyResponse) => void): grpc.ClientUnaryCall;
    apply(request: protos_arcctlpulumi_pb.ApplyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: protos_arcctlpulumi_pb.ApplyResponse) => void): grpc.ClientUnaryCall;
    apply(request: protos_arcctlpulumi_pb.ApplyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: protos_arcctlpulumi_pb.ApplyResponse) => void): grpc.ClientUnaryCall;
}

export class ArcctlPulumiClient extends grpc.Client implements IArcctlPulumiClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public build(request: protos_arcctlpulumi_pb.BuildRequest, callback: (error: grpc.ServiceError | null, response: protos_arcctlpulumi_pb.BuildResponse) => void): grpc.ClientUnaryCall;
    public build(request: protos_arcctlpulumi_pb.BuildRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: protos_arcctlpulumi_pb.BuildResponse) => void): grpc.ClientUnaryCall;
    public build(request: protos_arcctlpulumi_pb.BuildRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: protos_arcctlpulumi_pb.BuildResponse) => void): grpc.ClientUnaryCall;
    public apply(request: protos_arcctlpulumi_pb.ApplyRequest, callback: (error: grpc.ServiceError | null, response: protos_arcctlpulumi_pb.ApplyResponse) => void): grpc.ClientUnaryCall;
    public apply(request: protos_arcctlpulumi_pb.ApplyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: protos_arcctlpulumi_pb.ApplyResponse) => void): grpc.ClientUnaryCall;
    public apply(request: protos_arcctlpulumi_pb.ApplyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: protos_arcctlpulumi_pb.ApplyResponse) => void): grpc.ClientUnaryCall;
}
