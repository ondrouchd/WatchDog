"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const moment_1 = __importDefault(require("moment"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./swagger"));
const app = (0, express_1.default)();
const port = 3000;
app.use('/swagger', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
/**
 * @swagger
 * components:
 *   schemas:
 *     Deal:
 *       type: object
 *       properties:
 *         balance:
 *           type: number
 *         currencyPair:
 *           type: string
 *         timestamp:
 *           type: string
 */
/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Returns a random deal
 *     responses:
 *       200:
 *         description: A random deal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Deal'
 */
class Deal {
    constructor(balance, currencyPair, side, lot, timestamp) {
        this.balance = balance;
        this.currencyPair = currencyPair;
        this.side = side;
        this.lot = lot;
        this.timestamp = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
    }
}
/*
Simulate a DXTrade Push API
*/
const generateDummyDXTradeDeal = () => {
    const balances = [100, 200, 300, 400, 500];
    const currencyPairs = ['EURUSD', 'USDJPY', 'GBPUSD', 'USDCHF', 'EURGBP', 'AUDUSD', 'USDCAD', 'NZDUSD', 'EURJPY', 'GBPJPY'];
    const side = ['BUY', 'SELL', 'LONG', 'SHORT', 'SL', 'TP', 'OCO', 'SLIPPAGE', 'MARGIN', 'PIP', 'LOT'];
    const randomBalance = balances[Math.floor(Math.random() * balances.length)];
    const randomCurrencyPair = currencyPairs[Math.floor(Math.random() * currencyPairs.length)];
    const randomSide = side[Math.floor(Math.random() * side.length)];
    const randomLot = generateRandomLot(0, 1, 2); // I don't know the problematic deeply but I think for our purpose we will use minilot and microlot. 1 lot will be maximum value.
    const randomTimestamp = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
    return new Deal(randomBalance, randomCurrencyPair, randomSide, randomLot, randomTimestamp);
};
/*
function for generating a random lot
1 lot = 100 000 euros
*/
const generateRandomLot = (min, max, precision) => {
    const factor = Math.pow(10, precision);
    return Math.round((Math.random() * (max - min) + min) * factor) / factor;
};
app.get('/api/messages', (req, res) => {
    // consume data from (fake) DXTrade Push API, here you can consume data from a real API or from another APIs you want
    const deTradeDeal = generateDummyDXTradeDeal();
    res.json(deTradeDeal);
});
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
