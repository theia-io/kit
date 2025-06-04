export const getFullS3Url = (region: string, s3Url: string, key: string) =>
  `https://${s3Url}.s3.${region}.amazonaws.com/${key}`;
export const getImageKeyFromS3Url = (url: string, awsS3BaseUrl: string) =>
  url.replace(`${awsS3BaseUrl}`, '');
