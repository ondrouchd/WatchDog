"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deal = void 0;
class Deal {
    constructor(apiID, balance, currencyPair, side, lot, timestamp) {
        this.apiID = apiID;
        this.balance = balance;
        this.currencyPair = currencyPair;
        this.side = side;
        this.lot = lot;
        this.timestamp = timestamp;
    }
    toString() {
        return `Deal { 'API': '${this.apiID}', 'Balance': ${this.balance}, 'CurrencyPair': '${this.currencyPair}', 'Side': '${this.side}', 'Lot': ${this.lot}, 'Timestamp': '${this.timestamp}' }`;
    }
}
exports.Deal = Deal;
