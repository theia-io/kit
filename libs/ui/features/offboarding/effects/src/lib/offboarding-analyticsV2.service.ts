import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT } from '@kitouch/shared-infra';
import {
  ExpOffboardingAnalytics,
  ExpOffboarding,
} from '@kitouch/shared-models';

import { ClientDataType } from '@kitouch/utils';

@Injectable({ providedIn: 'root' })
export class ExpOffboardingAnalyticsV2Service {
  #http = inject(HttpClient);
  #environment = inject(ENVIRONMENT);

  getAnalyticsOffboardings(offboardingIds: Array<string>) {
    return this.#http.get<Array<ExpOffboardingAnalytics>>(
      `${this.#environment.api.offboardingsAnalytics}`,
      {
        params: {
          offboardingIds: offboardingIds.join(','),
        },
      }
    );
  }

  getAnalyticsOffboarding(offboardingId: string) {
    return this.#http.get<Array<ExpOffboardingAnalytics>>(
      `${this.#environment.api.offboardingsAnalytics}/${offboardingId}`
    );
  }

  createAnalyticsOffboarding(
    analytics: ClientDataType<ExpOffboardingAnalytics>
  ) {
    return this.#http.post<ExpOffboardingAnalytics>(
      `${this.#environment.api.offboardingsAnalytics}`,
      analytics
    );
  }

  deleteAnalyticsOffboarding(offboardingId: ExpOffboarding['id']) {
    return this.#http.delete<ExpOffboarding>(
      `${this.#environment.api.offboardingsAnalytics}/${offboardingId}`
    );
  }
}
