import { Injectable } from '@angular/core';
import {
  dbClientAccountAdapter,
  dbClientProfileAdapter,
  dbClientUserAdapter,
} from '@kitouch/kit-data';
import { DataSourceService } from '@kitouch/shared-infra';
import { Account, Profile, User } from '@kitouch/shared-models';

@Injectable({
  providedIn: 'root',
})
export class AuthDataService extends DataSourceService {
  async getAccountUserProfiles(
    realmUser: Realm.User
  ): Promise<{ account: Account; user: User; profiles: Array<Profile> }> {
    return await realmUser.functions['getAccountUserProfiles'](
      realmUser.id
    ).then(({ account, user, profiles }) => ({
      account: dbClientAccountAdapter(account),
      user: dbClientUserAdapter(user),
      profiles: profiles.map(dbClientProfileAdapter),
    }));
  }
}
