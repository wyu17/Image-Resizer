import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { S3 } from "aws-sdk";
import { VALID_MIMETYPES, generateKey } from "./utils";

const s3 = new S3();

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const contentType = event.queryStringParameters?.["type"];
  if (!contentType || !VALID_MIMETYPES.includes(contentType)) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: "Invalid content type provided.",
    };
  }
  const key = generateKey(contentType);

  const s3Params = {
    Bucket: process.env.UPLOADBUCKET,
    Key: key,
    Expires: 300,
    ContentType: contentType,
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", s3Params);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: JSON.stringify({
      uploadURL: uploadURL,
    }),
  };
};
