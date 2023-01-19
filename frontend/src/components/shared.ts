export interface AugmentedFile extends File {
  readonly id: string;
  readonly preview: InstanceType<typeof Image>;
}

export const uploadLambda = process.env.REACT_APP_UPLOAD_LAMBDA ?? "";
export const resizeLambda = process.env.REACT_APP_RESIZE_LAMBDA ?? "";
