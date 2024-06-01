const AWS = require("aws-sdk");
const sharp = require("sharp");

const s3 = new AWS.S3();

exports.handler = async (event) => {
  const BUCKET = process.env.BUCKET_NAME;

  for (const record of event.Records) {
    const key = record.s3.object.key;
    const params = {
      Bucket: BUCKET,
      Key: key,
    };

    try {
      const s3Object = await s3.getObject(params).promise();

      const resizedImage = await sharp(s3Object.Body)
        .resize(200, 200)
        .toBuffer();

      const thumbnailKey = key.replace("uploads/", "thumbnails/");

      await s3
        .putObject({
          Bucket: BUCKET,
          Key: thumbnailKey,
          Body: resizedImage,
          ContentType: s3Object.ContentType,
        })
        .promise();

      console.log(`Thumbnail generated and uploaded to: ${thumbnailKey}`);
    } catch (error) {
      console.error(`Error processing file ${key}: ${error}`);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify("Thumbnail generation successful!"),
  };
};
