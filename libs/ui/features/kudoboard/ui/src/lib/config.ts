import { inject } from '@angular/core';
import { S3_KUDOBOARD_BUCKET_BASE_URL } from '@kitouch/ui-shared';

export const isValidBucketUrl = () => {
  const bucketUrl = inject(S3_KUDOBOARD_BUCKET_BASE_URL);

  return (str?: string) => {
    if (!str) {
      return false;
    }

    let url;

    try {
      url = new URL(str);
    } catch (_) {
      return false;
    }

    console.log(str, url);

    return url.protocol === 'https:' && url.origin === bucketUrl;
  };
};

export const isHexColor = (hex?: string) => {
  if (!hex) {
    return false;
  }

  return /^#[0-9A-F]{6}$/i.test(hex);
};
