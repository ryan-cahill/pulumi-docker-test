export interface BuildInputs {
  image?: string; // digest
  directory?: string;
  filename?: string;
}

export interface ApplyInputs {
  datacenter_id: string;
  directory: string; // pulumi directory folder to mount as volume (for now)
  config: object;
  image: string; // digest
  destroy?: boolean;
  account_credentials: object;
  debug: boolean;
}

export abstract class BaseModule {
  abstract build(inputs: BuildInputs): Promise<string>;

  abstract apply(inputs: ApplyInputs): Promise<void>;
}
