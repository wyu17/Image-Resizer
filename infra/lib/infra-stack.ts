import * as cdk from "aws-cdk-lib";

import { Upload } from "./upload";

export class InfraStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new Upload(this, "upload");
  }
}
