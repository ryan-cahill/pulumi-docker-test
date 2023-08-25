// package: 
// file: protos/arcctlpulumi.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class BuildRequest extends jspb.Message { 
    getSerializeddocuments(): string;
    setSerializeddocuments(value: string): BuildRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BuildRequest.AsObject;
    static toObject(includeInstance: boolean, msg: BuildRequest): BuildRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BuildRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BuildRequest;
    static deserializeBinaryFromReader(message: BuildRequest, reader: jspb.BinaryReader): BuildRequest;
}

export namespace BuildRequest {
    export type AsObject = {
        serializeddocuments: string,
    }
}

export class BuildResponse extends jspb.Message { 
    getBuildsha(): string;
    setBuildsha(value: string): BuildResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BuildResponse.AsObject;
    static toObject(includeInstance: boolean, msg: BuildResponse): BuildResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BuildResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BuildResponse;
    static deserializeBinaryFromReader(message: BuildResponse, reader: jspb.BinaryReader): BuildResponse;
}

export namespace BuildResponse {
    export type AsObject = {
        buildsha: string,
    }
}

export class ApplyRequest extends jspb.Message { 
    getSerializedpulumistate(): string;
    setSerializedpulumistate(value: string): ApplyRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ApplyRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ApplyRequest): ApplyRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ApplyRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ApplyRequest;
    static deserializeBinaryFromReader(message: ApplyRequest, reader: jspb.BinaryReader): ApplyRequest;
}

export namespace ApplyRequest {
    export type AsObject = {
        serializedpulumistate: string,
    }
}

export class ApplyResponse extends jspb.Message { 
    getSerializedpulumistate(): string;
    setSerializedpulumistate(value: string): ApplyResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ApplyResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ApplyResponse): ApplyResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ApplyResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ApplyResponse;
    static deserializeBinaryFromReader(message: ApplyResponse, reader: jspb.BinaryReader): ApplyResponse;
}

export namespace ApplyResponse {
    export type AsObject = {
        serializedpulumistate: string,
    }
}
