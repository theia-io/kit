exports = async function (account) {
  const { _id, userId, settingsId, ...rest } = account;
  return {
    ...rest,
    id: _id.toString(),
    userId: userId?.toString(),
    settingsId: settingsId?.toString(),
  };
};
