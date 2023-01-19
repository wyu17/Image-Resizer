# Image Resizer
Deployed statically at https://wyu17.github.io/image_resizer/.

A utility website for resizing JPEG and PNG images. 

Built on a stack of Typescript + React on the front-end, and AWS Lambdas for uploading images to S3 and resizing images. 

Uses the AWS CDK to provision the Lambdas, S3 buckets and IAM roles used. 

## Example
![image](https://user-images.githubusercontent.com/62117275/213451718-76bc1f17-f9dc-4246-a8aa-9f07c80a6b0e.png)

can be resized to

![image](https://user-images.githubusercontent.com/62117275/213451656-76dcc4a9-b20a-4b5a-9852-1917df7178bd.png)


## Running Locally

### Cdk

#### Requirements
A .env file in the containing names for the upload and resize buckets. See the `env.example` file in the `infra` directory.

#### Commands

See https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk/README.md for the full AWS CDK command line interface. 

To initiate a fresh deploy in the infra folder:

Configure AWS credentials ([for example, through the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)). 

`cdk bootstrap` to bootstrap required resources for CDK.

`cdk synth` to synthesise the CDK app to CloudFormation.

`cdk deploy` to deploy the stack into the linked AWS account.

### Frontend

#### Requirements
A .env file in the `frontend` directory containing addresses for the upload and resize lambdas. See the `env.example` file in the `frontend` directory.

#### Commands

`npm install` to install the dependencies used in the front-end. 

`npm start` to run the app in the development mode: view in the browser on http://localhost:3000.

`npm run build` to build the app into the build directory.

Optional: `npm run deploy` to deploy to Github Pages.
This requires a remote Github repository configured, see [README.md](https://github.com/gitname/react-gh-pages/blob/master/README.md)


### 
