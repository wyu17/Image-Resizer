import { Construct } from "constructs";
import { Duration } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Cors, LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import {
  AnyPrincipal,
  Effect,
  Policy,
  PolicyStatement,
} from "aws-cdk-lib/aws-iam";

import * as s3 from "aws-cdk-lib/aws-s3";
import * as dotenv from "dotenv";

const corsRule: s3.CorsRule = {
  allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.HEAD],
  allowedOrigins: ["*"],
  allowedHeaders: ["*"],
};

export class Upload extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    dotenv.config();

    const uploadFn = new NodejsFunction(this, "uploadFunc");
    uploadFn.addEnvironment("UPLOADBUCKET", process.env.UPLOADBUCKET ?? "");

    new LambdaRestApi(this, "uploadAPIgw", {
      handler: uploadFn,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
      },
    });

    const resizeFn = new NodejsFunction(this, "resizeFunc", {
      memorySize: 1024,
      timeout: Duration.seconds(10),
    });
    resizeFn.addEnvironment("RESIZEBUCKET", process.env.RESIZEBUCKET ?? "");

    new LambdaRestApi(this, "resizeAPIgw", {
      handler: resizeFn,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
      },
    });

    // Bucket for uploading images
    const uploadBucket = new s3.Bucket(this, "UploadBucket", {
      bucketName: process.env.UPLOADBUCKET,
      versioned: true,
      cors: [corsRule],
    });


    // Allow the upsize lambda to GET and PUT the s3 bucket
    uploadBucket.addToResourcePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["s3:GetObject"],
        resources: [uploadBucket.arnForObjects("*")],
        principals: [new AnyPrincipal()],
      })
    );

    // Need to put from the upload lambda and read from the resize lambda
    uploadBucket.grantPut(uploadFn);
    uploadBucket.grantPutAcl(uploadFn);
    uploadBucket.grantRead(resizeFn);

    // Bucket for storing resized images
    const resizeBucket = new s3.Bucket(this, "ResizedBucket", {
      bucketName: process.env.RESIZEBUCKET,
      versioned: true,
      cors: [corsRule],
    });

    // Resource policies for public read and PUT by the resize lambda
    resizeBucket.addToResourcePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["s3:GetObject"],
        resources: [resizeBucket.arnForObjects("*")],
        principals: [new AnyPrincipal()],
      })
    );

    resizeBucket.grantRead(resizeFn);
    resizeBucket.grantPut(resizeFn);
    resizeBucket.grantPutAcl(resizeFn);
  }
}
