import { Component } from '@angular/core';
import { ExchangeRate } from './components/services/ExchangeRate';
import { CurrencyService } from './components/services/currency.service';


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
  constructor(private currencyService: CurrencyService) {
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
    var result = this.currenciesValues[this.currencies.indexOf(symbol_1)] /
      this.currenciesValues[this.currencies.indexOf(symbol_2)];
    return result;
  }
  async fetchData(): Promise<void> {
    try {
      const exchangeRates = await this.currencyService.getExchangeRates().toPromise();

      if (exchangeRates && exchangeRates.length >= 2) {
        this.currenciesValues[1] = exchangeRates[0].buy;
        this.currenciesValues[2] = exchangeRates[1].buy;
      } else {
        console.error('Invalid exchange rates data:', exchangeRates);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}
