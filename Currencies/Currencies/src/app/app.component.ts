import { Component } from '@angular/core';
import { CurrencyService } from './components/services/currency.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Project';
  currencies: string[] = ['UAH', 'EUR', 'USD'];
  currenciesValues: number[] = [1, 0, 0];
  selectedFrom = 'UAH';
  selectedTo = 'EUR';
  valueFrom = 0;
  valueTo = 0;

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
    [this.selectedFrom, this.selectedTo] = [this.selectedTo, this.selectedFrom];
    [this.valueFrom, this.valueTo] = [this.valueTo, this.valueFrom];
  }

  onChangeFrom(valueFrom: number): void {
    this.valueTo = valueFrom * this.checkCurrency(this.selectedFrom, this.selectedTo);
    this.valueTo = parseFloat(this.valueTo.toFixed(2));
  }

  onChangeTo(valueTo: number): void {
    this.valueFrom = valueTo * this.checkCurrency(this.selectedTo, this.selectedFrom);
    this.valueFrom = parseFloat(this.valueFrom.toFixed(2));
  }

  private checkCurrency(symbol_1: string, symbol_2: string): number {
    const index1 = this.currencies.indexOf(symbol_1);
    const index2 = this.currencies.indexOf(symbol_2);
    return this.currenciesValues[index1] / this.currenciesValues[index2];
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
