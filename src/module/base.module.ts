export interface BuildInputs {
  directory: string;
}

export interface ApplyInputs {
  datacenter_id: string;
  state?: object;
  inputs: [string, string][]; 
  image: string; // digest
  destroy?: boolean;
}

export abstract class BaseModule {
  abstract build(inputs: BuildInputs): Promise<string>; // return type is the docker image hash

  abstract apply(inputs: ApplyInputs): Promise<string>; // return type is a string of pulumi state
}
