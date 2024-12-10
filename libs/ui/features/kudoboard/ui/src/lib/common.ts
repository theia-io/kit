import { inject } from '@angular/core';
import { S3_KUDOBOARD_BUCKET_BASE_URL } from '@kitouch/shared-infra';
import { KudoBoard, Profile } from '@kitouch/shared-models';

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

    return url.protocol === 'https:' && url.origin === bucketUrl;
  };
};

export const isHexColor = (hex?: string) => {
  if (!hex) {
    return false;
  }

  return /^#[0-9A-F]{6}$/i.test(hex);
};

export const kudoBoardOwner = ({
  kudoboard,
  currentProfile,
}: {
  kudoboard?: KudoBoard;
  currentProfile?: Profile;
}) => {
  if (
    !kudoboard ||
    !kudoboard.profileId ||
    !currentProfile ||
    kudoboard.profileId !== currentProfile.id
  ) {
    return false;
  }

  return true;
};
