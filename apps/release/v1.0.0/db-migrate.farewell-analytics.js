async function migrateAgg() {
  db.farewell.aggregate([
    {
      $project: {
        _id: 0, // Exclude the original _id
        farewellId: '$_id',
        viewed: 1,
      },
    },
    { $out: 'farewell-analytics' }, // Output to the new collection
  ]);
}

async function removeAnalytics() {
  db.farewell.updateMany({}, { $unset: { viewed: '' } });
}
