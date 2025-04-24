import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';
import { Farewell, FarewellReaction } from '@kitouch/shared-models';
import { ClientDataType } from '@kitouch/utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FarewellReactionsService {
  #env = inject(ENVIRONMENT);
  #http = inject(HttpClient);

  getFarewellReactions(
    farewellId: Farewell['id']
  ): Observable<Array<FarewellReaction>> {
    return this.#http.get<Array<FarewellReaction>>(
      `${this.#env.api.farewellReactions}/${farewellId}`
    );
  }

  postFarewellReaction(
    reactionData: ClientDataType<FarewellReaction>
  ): Observable<FarewellReaction> {
    return this.#http.post<FarewellReaction>(
      `${this.#env.api.farewellReactions}`,
      reactionData
    );
  }

  deleteFarewellReaction(id: FarewellReaction['id']) {
    return this.#http.delete<FarewellReaction>(
      `${this.#env.api.farewellReactions}/${id}`
    );
  }
}
