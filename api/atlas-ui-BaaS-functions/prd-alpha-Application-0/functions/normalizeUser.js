exports = async function (user) {
  const { _id, accountId, ...rest } = user;
  return {
    ...rest,
    id: _id.toString(),
    accountId: accountId?.toString(),
  };
};
