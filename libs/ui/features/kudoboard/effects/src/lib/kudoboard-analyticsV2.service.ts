import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';

import { KudoBoard, KudoBoardAnalytics } from '@kitouch/shared-models';
import { ClientDataType } from '@kitouch/utils';

@Injectable({ providedIn: 'root' })
export class KudoBoardAnalyticsV2Service {
  #http = inject(HttpClient);
  #environment = inject(ENVIRONMENT);

  getAnalyticsKudoBoards(kudoBoardIds: Array<string>) {
    return this.#http.get<Array<KudoBoardAnalytics>>(
      `${this.#environment.api.kudoboardAnalytics}`,
      {
        params: {
          kudoBoardIds: kudoBoardIds.join(','),
        },
      }
    );
  }

  getAnalyticsKudoBoard(kudoBoardId: string) {
    return this.#http.get<Array<KudoBoardAnalytics>>(
      `${this.#environment.api.kudoboardAnalytics}/${kudoBoardId}`
    );
  }

  createAnalyticsKudoBoard(analytics: ClientDataType<KudoBoardAnalytics>) {
    return this.#http.post<KudoBoardAnalytics>(
      `${this.#environment.api.kudoboardAnalytics}`,
      analytics
    );
  }

  deleteAnalyticsKudoBoard(kudoBoardId: KudoBoard['id']) {
    return this.#http.delete<KudoBoard>(
      `${this.#environment.api.kudoboardAnalytics}/${kudoBoardId}`
    );
  }
}
