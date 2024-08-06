export const addOrUpdate = <T extends { id: string }>(
  item: T,
  arrItems: Array<T>
) => {
  let updated = false;

  const newArrItems = arrItems.map((arrItem) => {
    if (arrItem.id === item.id) {
      updated = true;
      return item;
    }

    return arrItem;
  });

  return updated ? newArrItems : [item, ...arrItems];
};

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
