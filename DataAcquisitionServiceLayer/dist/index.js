"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const deal_1 = require("./deal");
const redis = require('redis');
let client = null;
function startRedisConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        client = redis.createClient(6379, '127.0.0.1');
        yield client.connect();
    });
}
startRedisConnection();
const axios = require('axios');
const interval = 1000; // 1 second
function fetchDXTradeData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const apiName = 'DXTradeAPI';
            const response = yield axios.get('http://localhost:3000/api/messages');
            //console.log('Received data:', response.data);
            axios.get('http://localhost:3000/api/messages')
                .then((response) => __awaiter(this, void 0, void 0, function* () {
                //console.log('Response data:', response.data); 
                // Get JSON data
                const obj = response.data;
                // Parse JSON data
                const dealJSON = (obj);
                const deal = new deal_1.Deal(apiName, dealJSON.balance, dealJSON.currencyPair, dealJSON.side, dealJSON.lot, dealJSON.timestamp);
                console.log('Response data:', deal.toString());
                // Store data in Redis
                if (deal.side === 'BUY' || deal.side === 'SELL') {
                    // create unique identifier for the deal
                    const dealID = deal.apiID + deal.timestamp + deal.currencyPair + deal.side + deal.lot.toString();
                    yield client.set(dealID, deal.toString());
                    yield redis.xadd('mystream', '*', 'value', JSON.stringify(deal));
                    console.log(`Added new record to stream: ${JSON.stringify(deal.toString())}`);
                }
            }))
                .catch((error) => {
                console.error('Error:', error);
            });
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    });
}
function fetchDXTradeDataPeriodically() {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetchDXTradeData();
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            yield fetchDXTradeData();
        }), interval);
    });
}
fetchDXTradeDataPeriodically();
