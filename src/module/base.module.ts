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

export type ImageDigest = string;

export type PulumiStateString = string;

export abstract class BaseModule {
  abstract build(inputs: BuildInputs): { digest?: ImageDigest, error?: string };

  abstract apply(inputs: ApplyInputs): { state?: PulumiStateString, error?: string };
}
