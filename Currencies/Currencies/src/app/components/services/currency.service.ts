import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExchangeRate } from './ExchangeRate';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private readonly proxyUrl = 'http://localhost:8080/';
  private readonly apiUrl = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5';

  constructor(private http: HttpClient) { }

  getExchangeRates(): Observable<ExchangeRate[]> {
    return this.http.get<any[]>(this.proxyUrl + this.apiUrl, { headers: { 'Origin': 'http://localhost:4200' } })
      .pipe(
        map(data => this.parseExchangeRates(data))
      );
  }

  private parseExchangeRates(data: any[]): ExchangeRate[] {
    return data.map(item => new ExchangeRate(
      item.ccy,
      item.base_ccy,
      parseFloat(item.buy),
      parseFloat(item.sale)
    ));
  }
}
