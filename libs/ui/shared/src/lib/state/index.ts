/** @todo @FIXME implement in the future */
export const FeatureTweetKey = 'feature.tweet';

export const PageHomeKey = 'page.home';

/** @TODO @FIXME move App state to highest level of deps */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppState {}

// 2*N(0)
export const mergeArr = <T>(
  ...arrOfArr: Array<Array<T & { id: string }>>
): Array<T> => {
  const combined = new Map<string, T>();

  // actually it is 2*N complexity
  arrOfArr.forEach((arr) => {
    arr.forEach((item) => {
      combined.set(item.id, item);
    });
  });

  return [...combined.values()];
};

export const mergeArrV2 = <T>(
  ...arrOfArr: Array<Array<T & Realm.Services.MongoDB.Document>>
): Array<T> => {
  const combined = new Map<string, T>();

  // actually it is 2*N complexity
  arrOfArr.forEach((arr) => {
    arr.forEach((item) => {
      combined.set(item._id, item);
    });
  });

  return [...combined.values()];
};
