import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  #http = inject(HttpClient);

  // @TODO test once activated this paid service & add feature flag
  readonly geolocationAvailable = false && 'geolocation' in navigator;

  getCurrentUserLocationCity$() {
    return from(
      new Promise((res: (value: string) => void, rej) => {
        const options = {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0,
        };

        const success = (pos: any) => {
          const crd = pos.coords;

          console.info('[UI GeolocationService] Your current position is:');
          console.info(`[UI GeolocationService] Latitude : ${crd.latitude}`);
          console.info(`[UI GeolocationService] Longitude: ${crd.longitude}`);
          console.info(
            `[UI GeolocationService] More or less ${crd.accuracy} meters.`
          );

          this.#http
            .get<string>(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${crd.latitude},${crd.longitude}&key=AIzaSyCz6vnqrBfRRV1VgmhlKhcHdPGiQszD2FE`
            )
            .subscribe((result) => res(result));
        };

        navigator.geolocation.getCurrentPosition(
          success,
          (err) => console.info('error', err),
          options
        );
      })
    );
  }
}
