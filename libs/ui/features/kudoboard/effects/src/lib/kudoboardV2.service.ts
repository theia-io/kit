import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';

import { KudoBoard } from '@kitouch/shared-models';
import { ClientDataType } from '@kitouch/utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KudoBoardV2Service {
  #http = inject(HttpClient);
  #environment = inject(ENVIRONMENT);

  getKudoBoards(profileId: string): Observable<Array<KudoBoard>> {
    return this.#http.get<Array<KudoBoard>>(
      `${this.#environment.api.kudoboards}`,
      {
        params: {
          profileId,
        },
      }
    );
  }

  getKudoBoard(kudoBoardId: string): Observable<KudoBoard | null> {
    return this.#http.get<KudoBoard>(
      `${this.#environment.api.kudoboards}/${kudoBoardId}`
    );
  }

  createKudoBoard(kudoBoard: ClientDataType<KudoBoard>): Observable<KudoBoard> {
    return this.#http.post<KudoBoard>(
      `${this.#environment.api.kudoboards}`,
      kudoBoard
    );
  }

  putKudoBoard(kudoBoard: KudoBoard) {
    return this.#http.put<KudoBoard>(
      `${this.#environment.api.kudoboards}/${kudoBoard.id}`,
      kudoBoard
    );
  }

  deleteKudoBoard(id: KudoBoard['id']) {
    return this.#http.delete<KudoBoard>(
      `${this.#environment.api.kudoboards}/${id}`
    );
  }
}
