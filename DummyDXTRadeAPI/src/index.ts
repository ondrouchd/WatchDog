import express, { Request, Response } from 'express';
import moment from 'moment';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swagger';

const app = express();
const port = 3000;

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
    balance: number;
    currencyPair: string;
    side: string;
    lot: number;
    timestamp: string;

    constructor(balance: number, currencyPair: string, side: string, lot:number, timestamp: string) {
        this.balance = balance;
        this.currencyPair = currencyPair;
        this.side = side;
        this.lot = lot;
        this.timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    }
}


/*
Simulate a DXTrade Push API
*/
const generateDummyDXTradeDeal = (): Deal => {
    const balances = [100, 200, 300, 400, 500];
    const currencyPairs = ['EURUSD', 'USDJPY', 'GBPUSD', 'USDCHF', 'EURGBP', 'AUDUSD', 'USDCAD', 'NZDUSD', 'EURJPY', 'GBPJPY'];
    const side = ['BUY', 'SELL', 'LONG', 'SHORT', 'SL', 'TP', 'OCO', 'SLIPPAGE', 'MARGIN', 'PIP', 'LOT'];
    const randomBalance = balances[Math.floor(Math.random() * balances.length)];
    const randomCurrencyPair = currencyPairs[Math.floor(Math.random() * currencyPairs.length)];
    const randomSide = side[Math.floor(Math.random() * side.length)];
    const randomLot = generateRandomLot(0, 1, 2);  // I don't know the problematic deeply but I think for our purpose we will use minilot and microlot. 1 lot will be maximum value.
    const randomTimestamp = moment().format('YYYY-MM-DD HH:mm:ss');

    return new Deal(randomBalance, randomCurrencyPair, randomSide, randomLot, randomTimestamp);
}

/*
function for generating a random lot
1 lot = 100 000 euros
*/
const generateRandomLot = (min: number, max: number, precision: number): number => {
    const factor = Math.pow(10, precision);
    return Math.round((Math.random() * (max - min) + min) * factor) / factor;
}

app.get('/api/messages', (req: Request, res: Response) => {
    // consume data from (fake) DXTrade Push API, here you can consume data from a real API or from another APIs you want
    const deTradeDeal = generateDummyDXTradeDeal();
    res.json(deTradeDeal);
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
