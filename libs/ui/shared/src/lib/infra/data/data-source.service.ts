import { inject } from '@angular/core';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { DBClientType } from '@kitouch/utils';
import { from, Observable, of, throwError } from 'rxjs';
import { filter, map, shareReplay, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { S3Service } from './s3.service';

export class DataSourceService {
  #s3Client = inject(S3Service).client;

  #anonymousdb$ = inject(AuthService).anonymousUser$.pipe(
    map((anonymousUser) =>
      anonymousUser?.mongoClient('mongodb-atlas').db('kitouch')
    ),
    shareReplay(1)
  );

  #realmUser$ = inject(AuthService).realmUser$;

  #db$ = this.#realmUser$.pipe(
    map((currentUser) =>
      currentUser?.mongoClient('mongodb-atlas').db('kitouch')
    ),
    shareReplay(1)
  );

  #genericRealmFunctions$ = this.#realmUser$.pipe(
    map((currentUser) => currentUser?.functions?.['genericRealmFunction']),
    filter(Boolean),
    shareReplay(1)
  );

  /** try to avoid using this functions as it might increase complexity of production releases */
  #limitedRealmFunctionsList$ = this.#realmUser$.pipe(
    map((currentUser) => ({
      getAccountUserProfiles:
        currentUser?.functions?.['getAccountUserProfiles'],
      getSuggestionColleaguesToFollow:
        currentUser?.functions?.['getSuggestionColleaguesToFollow'],
    }))
  );

  /** Returns only logged in user Realm SDK DB reference */
  protected db$() {
    return this.#db$.pipe(take(1), filter(Boolean));
  }

  /** Returns Logged in or fall back to anonymous user Realm SDK DB reference */
  protected allowAnonymousDb$() {
    return this.#db$.pipe(
      switchMap((db) => (db ? of(db) : this.#anonymousdb$)),
      take(1),
      filter(Boolean)
    );
  }

  protected genericRealmFunction$<T, K = DBClientType<T>>(genericRealmArg: {
    collection: string;
    executeFn: string;
    filterOrAggregate: any;
    query?: any;
  }): Observable<K> {
    return this.#genericRealmFunctions$.pipe(
      take(1),
      switchMap((genericRealmCb) => genericRealmCb(genericRealmArg))
    );
  }

  protected realmFunction$<T>(
    functionName: 'getAccountUserProfiles' | 'getSuggestionColleaguesToFollow',
    args: unknown
  ): Observable<T> {
    return this.#limitedRealmFunctionsList$.pipe(
      take(1),
      switchMap((realmFunctionsList) => {
        const realmFunction = realmFunctionsList[functionName];
        if (realmFunction) {
          return realmFunction(args);
        }

        return throwError(
          () => new Error('Such realm function is not supported.')
        );
      })
    );
  }

  protected getBucketItem(Bucket: string, Key: string) {
    return from(
      this.#s3Client.send(
        new GetObjectCommand({
          Bucket,
          Key,
        })
      )
    );
  }

  protected setBucketItem(Bucket: string, Key: string, Body: Blob) {
    return from(
      this.#s3Client.send(
        new PutObjectCommand({
          Bucket,
          Key,
          Body,
        })
      )
    );
  }
}
