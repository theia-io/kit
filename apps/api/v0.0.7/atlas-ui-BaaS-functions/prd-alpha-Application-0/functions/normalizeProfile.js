exports = function (profileRes) {
  let { _id, userId, following, followers, ...rest } = profileRes;

  return {
    ...rest,
    id: _id.toString(),
    following: following, //?.map(({id}) => {id: id?.toString()}) ?? [],
    followers: followers, //?.map(({id}) => {id: id?.toString()}) ?? []
  };
};
