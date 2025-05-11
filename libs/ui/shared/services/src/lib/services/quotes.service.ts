import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

export interface Quote {
  text: string;
  from: string;
}

@Injectable({ providedIn: 'root' })
export class QuotesService {
  #http = inject(HttpClient);

  #quotes$ = this.#getQuotes().pipe(shareReplay(1));

  getRandomQuote(): Observable<Quote> {
    return this.#quotes$.pipe(
      map((quotes) => quotes?.[Math.floor(Math.random() * quotes.length)]),
    );
  }

  #getQuotes() {
    return this.#http.get<Array<Quote>>('./data.json');
  }
}
