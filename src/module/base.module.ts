export interface BuildInputs {
  directory?: string;
}

export interface ApplyInputs {
  datacenter_id: string;
  state?: object;
  inputs: object; 
  image: string; // digest
  destroy?: boolean;
  account_credentials: object; // TODO: pass these in as secrets, since accounts are gone
}

export abstract class BaseModule {
  abstract build(inputs: BuildInputs): Promise<string>;

  abstract apply(inputs: ApplyInputs): Promise<string>; // return type is a string of pulumi state
}
