export interface AugmentedFile extends File {
  readonly id: string;
  readonly preview: InstanceType<typeof Image>;
}

export const uploadLambda =
  "https://jwco5zmrfi.execute-api.ap-southeast-2.amazonaws.com/prod/?";
export const resizeLambda =
  "https://nwcsvw7hh0.execute-api.ap-southeast-2.amazonaws.com/prod/?";
