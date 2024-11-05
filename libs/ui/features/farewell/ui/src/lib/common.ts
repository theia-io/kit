import { Farewell, Profile } from '@kitouch/shared-models';

export const farewellOwner = ({
  farewell,
  currentProfile,
}: {
  farewell?: Farewell;
  currentProfile?: Profile;
}) => {
  if (
    !farewell ||
    !farewell.profile ||
    !currentProfile ||
    farewell.profile.id !== currentProfile.id
  ) {
    return false;
  }

  return true;
};
