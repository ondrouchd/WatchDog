export class Deal {
    apiID: string;
    balance: number;
    currencyPair: string;
    side: string;
    lot: number;
    timestamp: string;

    constructor(apiID: string, balance: number, currencyPair: string, side: string, lot:number, timestamp: string) {
        this.apiID = apiID;
        this.balance = balance;
        this.currencyPair = currencyPair;
        this.side = side;
        this.lot = lot;
        this.timestamp = timestamp;
    }

    toString(): string {
        return `{ "Deal": { "API": "${this.apiID}", "Balance": ${this.balance}, "CurrencyPair": "${this.currencyPair}", "Side": "${this.side}", "Lot": ${this.lot}, "Timestamp": "${this.timestamp}" } }`;
    }
}