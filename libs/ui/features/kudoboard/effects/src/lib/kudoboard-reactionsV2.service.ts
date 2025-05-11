import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';

import { KudoBoard, KudoBoardReaction } from '@kitouch/shared-models';
import { ClientDataType } from '@kitouch/utils';

@Injectable({ providedIn: 'root' })
export class KudoBoardReactionsV2Service {
  #http = inject(HttpClient);
  #environment = inject(ENVIRONMENT);

  getKudoBoardReactions(kudoBoardId: KudoBoard['id']) {
    return this.#http.get<Array<KudoBoardReaction>>(
      `${this.#environment.api.kudoboardReactions}/${kudoBoardId}`,
    );
  }

  createKudoBoardReaction(
    kudoBoardReaction: ClientDataType<KudoBoardReaction>,
  ) {
    return this.#http.post<KudoBoardReaction>(
      `${this.#environment.api.kudoboardReactions}`,
      kudoBoardReaction,
    );
  }

  deleteKudoBoardReaction(kudoBoardReactionId: KudoBoardReaction['id']) {
    return this.#http.delete<KudoBoardReaction>(
      `${this.#environment.api.kudoboardReactions}/${kudoBoardReactionId}`,
    );
  }
}
