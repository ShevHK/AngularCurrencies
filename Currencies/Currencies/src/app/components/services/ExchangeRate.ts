export class ExchangeRate {
  ccy: string;
  baseCcy: string;
  buy: number;
  sale: number;

  constructor(ccy: string, baseCcy: string, buy: number, sale: number) {
    this.ccy = ccy;
    this.baseCcy = baseCcy;
    this.buy = buy;
    this.sale = sale;
  }
}
