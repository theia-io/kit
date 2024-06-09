export interface Id {
  _id: {
    $oid: string;
  };
}

export const mongooseEqual = <T, K>(document1: T, document2: K): boolean =>
  (document1 as T & Id)._id.$oid === (document2 as K & Id)._id.$oid;
