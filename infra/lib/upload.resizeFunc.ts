import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { S3 } from "aws-sdk";
import { read } from "jimp";
import { generateKey } from "./utils";

const s3 = new S3();

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const imgToResize = event.queryStringParameters?.["url"];
  const height = parseInt(event.queryStringParameters?.["height"] ?? "");
  const width = parseInt(event.queryStringParameters?.["width"] ?? "");

  if (!imgToResize || !height || !width) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: "Image to resize, height and width must be provided.",
    };
  }

  const readImage = await read(imgToResize);
  const resizedImage = readImage.resize(width, height);

  const bucket = process.env.RESIZEBUCKET;
  const key = generateKey(readImage.getMIME());

  const resizeFailed = {
    statusCode: 500,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: "Resizing image failed",
  };

  if (!bucket) {
    return resizeFailed;
  };

  const buffer = await readImage.getBufferAsync(readImage.getMIME());

  const uploadData = await s3
    .upload({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: resizedImage.getMIME(),
    })
    .promise();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: JSON.stringify({
      resizedUrl: uploadData.Location,
    }),
  };
};
