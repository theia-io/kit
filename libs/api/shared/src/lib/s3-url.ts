export const getFullS3Url = (s3Url: string, key: string) => `${s3Url}/${key}`;
export const getImageKeyFromS3Url = (url: string, s3Url: string) =>
  url.replace(`${s3Url}/`, '');
