export interface Id {
  id: string;
}

export const mongooseEqual = <T, K>(document1: T, document2: K): boolean =>
  (document1 as T & Id).id === (document2 as K & Id).id;
