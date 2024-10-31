import {
  KudoBoard,
  KudoBoardAnalytics,
  KudoBoardComment,
  KudoBoardReaction,
} from '@kitouch/shared-models';
import {
  ClientDataType,
  clientDBGenerateTimestamp,
  ClientDBRequestType,
  dbClientAdapter,
  DbClientResponseType,
  DBType,
} from '@kitouch/utils';
import { BSON } from 'realm-web';

/** KudoBoard */
export type ClientDBKudoBoardRequest = ClientDBRequestType<
  KudoBoard,
  { profileId?: BSON.ObjectId | null }
>;
export type ClientDBKudoBoardResponse = DBType<ClientDBKudoBoardRequest>;

export const clientDbKudoBoardAdapter = (
  kudoboard: ClientDataType<KudoBoard>
): ClientDBKudoBoardRequest => ({
  ...kudoboard,
  profileId: kudoboard.profileId
    ? new BSON.ObjectId(kudoboard.profileId)
    : null,
  ...clientDBGenerateTimestamp(),
});
export const dbClientKudoBoardAdapter = (
  dbObject: ClientDBKudoBoardResponse
): KudoBoard => {
  const { profileId, ...rest } = dbClientAdapter<KudoBoard>(dbObject);

  return {
    ...rest,
    profileId: profileId?.toString() ?? null,
  };
};

/** Reaction */
export type ClientDBKudoBoardReactionRequest = ClientDBRequestType<
  KudoBoardReaction,
  { kudoBoardId: BSON.ObjectId; profileId: BSON.ObjectId | null }
>;
export type ClientDBKudoBoardReactionResponse =
  DbClientResponseType<ClientDBKudoBoardReactionRequest>;

export const clientDbKudoBoardReactionAdapter = (
  reaction: ClientDataType<KudoBoardReaction>
): ClientDBKudoBoardReactionRequest => ({
  ...reaction,
  kudoBoardId: new BSON.ObjectId(reaction.kudoBoardId),
  profileId: reaction.profileId ? new BSON.ObjectId(reaction.profileId) : null,
  ...clientDBGenerateTimestamp(),
});

export const dbClientKudoBoardReactionAdapter = (
  dbObject: ClientDBKudoBoardReactionResponse
): KudoBoardReaction => {
  const { kudoBoardId, profileId, ...rest } =
    dbClientAdapter<KudoBoardReaction>(dbObject);

  return {
    ...rest,
    kudoBoardId: kudoBoardId.toString(),
    profileId: profileId?.toString() ?? null,
  };
};

/** Comments */
export type ClientDBKudoBoardCommentRequest = ClientDBRequestType<
  KudoBoardComment,
  { kudoBoardId: BSON.ObjectId; profileId: BSON.ObjectId | null }
>;
export type ClientDBKudoBoardCommentResponse =
  DbClientResponseType<ClientDBKudoBoardCommentRequest>;

export const clientDbKudoBoardCommentAdapter = (
  reaction: ClientDataType<KudoBoardComment>
): ClientDBKudoBoardCommentRequest => ({
  ...reaction,
  kudoBoardId: new BSON.ObjectId(reaction.kudoBoardId),
  profileId: reaction.profileId ? new BSON.ObjectId(reaction.profileId) : null,
  ...clientDBGenerateTimestamp(),
});

export const dbClientKudoBoardCommentAdapter = (
  dbObject: ClientDBKudoBoardCommentResponse
): KudoBoardComment => {
  const { kudoBoardId, profileId, ...rest } =
    dbClientAdapter<KudoBoardComment>(dbObject);

  return {
    ...rest,
    kudoBoardId: kudoBoardId.toString(),
    profileId: profileId?.toString() ?? null,
  };
};

/** Analytics */
export type ClientDBKudoBoardAnalyticsRequest = ClientDBRequestType<
  KudoBoardAnalytics,
  { kudoBoardId: BSON.ObjectId }
>;
export type ClientDBKudoBoardAnalyticsResponse =
  DBType<ClientDBKudoBoardAnalyticsRequest>;

export const dbClientKudoBoardAnalyticsAdapter = (
  dbObject: ClientDBKudoBoardAnalyticsResponse
): KudoBoardAnalytics => {
  const { kudoBoardId, ...rest } =
    dbClientAdapter<KudoBoardAnalytics>(dbObject);
  return {
    ...rest,
    kudoBoardId: kudoBoardId.toString(),
  };
};
