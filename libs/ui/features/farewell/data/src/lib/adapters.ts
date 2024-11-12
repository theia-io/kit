import {
  Farewell,
  FarewellAnalytics,
  FarewellComment,
  FarewellReaction,
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

/** Farewell */
export type ClientDBFarewellRequest = ClientDBRequestType<
  Farewell,
  { kudoBoardId: BSON.ObjectId | null; profileId: BSON.ObjectId | null }
>;
export type ClientDBFarewellResponse = DBType<ClientDBFarewellRequest>;

export const clientDbFarewellAdapter = (
  dbObject: ClientDataType<Farewell>
): ClientDBFarewellRequest => ({
  ...dbObject,
  kudoBoardId: dbObject.kudoBoardId
    ? new BSON.ObjectId(dbObject.kudoBoardId)
    : null,
  profileId: dbObject.profileId ? new BSON.ObjectId(dbObject.profileId) : null,
  ...clientDBGenerateTimestamp(),
});

export const dbClientFarewellAdapter = (
  dbObject: ClientDBFarewellResponse
): Farewell => {
  const sysFarewell = dbClientAdapter<Farewell>(dbObject);
  return {
    ...sysFarewell,
    kudoBoardId: sysFarewell.kudoBoardId?.toString() ?? '',
    profileId: sysFarewell.profileId?.toString() ?? '',
  };
};

/** Reaction */
export type ClientDBFarewellReactionRequest = ClientDBRequestType<
  FarewellReaction,
  { farewellId: BSON.ObjectId; profileId: BSON.ObjectId | null }
>;
export type ClientDBFarewellReactionResponse =
  DbClientResponseType<ClientDBFarewellReactionRequest>;

export const clientDbFarewellReactionAdapter = (
  reaction: ClientDataType<FarewellReaction>
): ClientDBFarewellReactionRequest => ({
  ...reaction,
  farewellId: new BSON.ObjectId(reaction.farewellId),
  profileId: reaction.profileId ? new BSON.ObjectId(reaction.profileId) : null,
  ...clientDBGenerateTimestamp(),
});

export const dbClientFarewellReactionAdapter = (
  dbObject: ClientDBFarewellReactionResponse
): FarewellReaction => {
  const { farewellId, profileId, ...rest } =
    dbClientAdapter<FarewellReaction>(dbObject);

  return {
    ...rest,
    farewellId: farewellId.toString(),
    profileId: profileId?.toString() ?? null,
  };
};

/** Comments */
export type ClientDBFarewellCommentRequest = ClientDBRequestType<
  FarewellComment,
  { farewellId: BSON.ObjectId; profileId: BSON.ObjectId | null }
>;
export type ClientDBFarewellCommentResponse =
  DbClientResponseType<ClientDBFarewellCommentRequest>;

export const clientDbFarewellCommentAdapter = (
  reaction: ClientDataType<FarewellComment>
): ClientDBFarewellCommentRequest => ({
  ...reaction,
  farewellId: new BSON.ObjectId(reaction.farewellId),
  profileId: reaction.profileId ? new BSON.ObjectId(reaction.profileId) : null,
  ...clientDBGenerateTimestamp(),
});

export const dbClientFarewellCommentAdapter = (
  dbObject: ClientDBFarewellCommentResponse
): FarewellComment => {
  const { farewellId, profileId, ...rest } =
    dbClientAdapter<FarewellComment>(dbObject);

  return {
    ...rest,
    farewellId: farewellId.toString(),
    profileId: profileId?.toString() ?? null,
  };
};

/** Analytics */
export type ClientDBFarewellAnalyticsRequest = ClientDBRequestType<
  FarewellAnalytics,
  { farewellId: BSON.ObjectId }
>;
export type ClientDBFarewellAnalyticsResponse =
  DBType<ClientDBFarewellAnalyticsRequest>;

export const dbClientFarewellAnalyticsAdapter = (
  dbObject: ClientDBFarewellAnalyticsResponse
): FarewellAnalytics => {
  const { farewellId, ...rest } = dbClientAdapter<FarewellAnalytics>(dbObject);
  return {
    ...rest,
    farewellId: farewellId.toString(),
  };
};
