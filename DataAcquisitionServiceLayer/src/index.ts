import { Deal } from "./deal";
import Redis from 'ioredis';

//const redis = require('redis');

let client: any = new Redis();
/*
async function startRedisConnection() {
    client = Redis.createClient(); // (6379, '127.0.0.1');
    client.on('error', (err: any) => {
        console.log('Error:', err);
    });
    
    await client.connect();   
}

startRedisConnection();
*/

const axios = require('axios');

const interval = 1000; // 1 second

async function fetchDXTradeData() {
    try {
        const apiName = 'DXTradeAPI'; 
        const response = await axios.get('http://localhost:3000/api/messages');
        //console.log('Received data:', response.data);

        axios.get('http://localhost:3000/api/messages')
        .then(async (response: { data: any; }) => {
            //console.log('Response data:', response.data); 
            
            // Get JSON data
            const obj = response.data;
            
            // Parse JSON data
            const dealJSON = (obj);
            
            const deal = new Deal(apiName, dealJSON.balance, dealJSON.currencyPair, dealJSON.side, dealJSON.lot, dealJSON.timestamp);
            console.log('Response data:', deal.toString()); 

            // Store data in Redis
            if (deal.side === 'BUY' || deal.side === 'SELL') {
                // create unique identifier for the deal
                const dealID = deal.apiID + deal.timestamp + deal.currencyPair + deal.side + deal.lot.toString();
                await client.set(dealID, deal.toString());
                await client.publish('newRecordChannel', dealID);
                
            }
            
        })
        .catch((error: any) => {
            console.error('Error:', error);
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchDXTradeDataPeriodically() {
    await fetchDXTradeData();
    setInterval(async () => {
        await fetchDXTradeData();
    }, interval);
}

fetchDXTradeDataPeriodically();


