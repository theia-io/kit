import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';
import { Farewell, FarewellAnalytics } from '@kitouch/shared-models';
import { ClientDataType } from '@kitouch/utils';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FarewellV2Service {
  #http = inject(HttpClient);
  #environment = inject(ENVIRONMENT);

  getFarewells(profileId: string): Observable<Array<Farewell>> {
    return this.#http.get<Array<Farewell>>(
      `${this.#environment.api.farewells}`,
      {
        params: {
          profileId,
        },
      }
    );
  }

  getFarewell(farewellId: string): Observable<Farewell | null> {
    return this.#http.get<Farewell>(
      `${this.#environment.api.farewells}/${farewellId}`
    );
  }
  createFarewell(farewell: ClientDataType<Farewell>): Observable<Farewell> {
    return this.#http.post<Farewell>(
      `${this.#environment.api.farewells}`,
      farewell
    );
  }

  putFarewell({ id, ...rest }: Farewell) {
    return this.#http.put<Farewell>(
      `${this.#environment.api.farewells}/${id}`,
      rest
    );
  }

  deleteFarewell(id: Farewell['id']) {
    return this.#http.delete<Farewell>(
      `${this.#environment.api.farewells}/${id}`
    );
  }

  getAnalyticsFarewells(farewellIds: Array<string>) {
    if (farewellIds.length > 0) {
      return this.#http.get<Array<FarewellAnalytics>>(
        `${this.#environment.api.farewellAnalytics}`,
        {
          params: {
            farewellIds: farewellIds.join(','),
          },
        }
      );
    }
    return of([] as Array<FarewellAnalytics>);
  }

  getAnalyticsFarewell(farewellId: string) {
    return this.#http.get<FarewellAnalytics>(
      `${this.#environment.api.farewellAnalytics}/${farewellId}`
    );
  }

  postAnalyticsFarewell(farewellId: string) {
    return this.#http.post<FarewellAnalytics>(
      `${this.#environment.api.farewellAnalytics}/${farewellId}`,
      {}
    );
  }

  deleteAnalyticsFarewell(farewellId: string) {
    return this.#http.delete<FarewellAnalytics>(
      `${this.#environment.api.farewellAnalytics}/${farewellId}`
    );
  }

  putAnalytics(analytics: FarewellAnalytics) {
    return this.#http.put<FarewellAnalytics>(
      `${this.#environment.api.farewellAnalytics}/${analytics.farewellId}`,
      analytics
    );
  }
}
