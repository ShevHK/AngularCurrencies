import { Component } from '@angular/core';
import { ExchangeRate } from './ExchangeRate ';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Project';
  currencies: string[] = ['UAH', 'EUR', 'USD'];
  currenciesValues: GLfloat[] = [1, 0, 0];
  selectedFrom: string = 'UAH';
  selectedTo: string = 'EUR';
  valueFrom: GLfloat = 0;
  valueTo: GLfloat = 0;
  constructor() {
    this.fetchData();
  }
  onSelectFrom(option: string): void {
    this.selectedFrom = option;
    this.onChangeTo(this.valueTo);
  }
  onSelectTo(option: string): void {
    this.selectedTo = option;
    this.onChangeFrom(this.valueFrom);
  }
  onArrowClick(): void {
    var temp = this.selectedFrom;
    this.selectedFrom = this.selectedTo;
    this.selectedTo = temp;

    var help = this.valueFrom;
    this.valueFrom = this.valueTo;
    this.valueTo = help;
  }
  onChangeFrom(valueFrom: GLfloat): void {
    this.valueTo = valueFrom * this.CheckCurrency(this.selectedFrom, this.selectedTo);
    this.valueTo.toFixed(2);
  }
  onChangeTo(valueTo: GLfloat): void {
    this.valueFrom = valueTo * this.CheckCurrency(this.selectedTo, this.selectedFrom);
    this.valueFrom.toFixed(2);
  }

  CheckCurrency(symbol_1: string, symbol_2: string): GLfloat {
    var result = this.currenciesValues[this.currencies.indexOf(symbol_2)] /
      this.currenciesValues[this.currencies.indexOf(symbol_1)];
    return result;
  }
  async fetchData(): Promise<void> {
    try {
      const proxyUrl = 'http://localhost:8080/';
      const apiUrl = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5';

      const response = await fetch(proxyUrl + apiUrl, {
        method: 'GET',
        headers: {
          'Origin': 'http://localhost:4200',
        },
      });

      const data = await response.json();

      console.log(data);

      const exchangeRates = this.parseExchangeRates(data);
      this.currenciesValues[1] = exchangeRates[0].buy;
      this.currenciesValues[2] = exchangeRates[1].buy;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  parseExchangeRates(data: any[]): ExchangeRate[] {
    return data.map(item => {
      return new ExchangeRate(
        item.ccy,
        item.base_ccy,
        parseFloat(item.buy),
        parseFloat(item.sale)
      );
    });
  }

}
