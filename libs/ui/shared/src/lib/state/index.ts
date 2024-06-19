/** @todo @FIXME implement in the future */
export const FeatureTweetKey = 'feature.tweet';

export const PageHomeKey = 'page.home';

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
