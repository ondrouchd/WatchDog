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
const redis = require('redis');
let client = null;
function startRedisConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        client = redis.createClient(6379, '127.0.0.1');
        yield client.connect();
    });
}
startRedisConnection();
const interval = 10000; // 1 second
/*
async function fuzzyMatching(objects, query) {
    const result = [];
    for (const key in objects) {
        const distance = natural.LevenshteinDistance(query, objects[key]);
        if (distance <= 2) { // Nastavte vhodnou mez pro podobnost
            result.push({ id: key, value: objects[key], distance });
        }
    }
    return result;
}
*/
/*
async function processToxicData() {
    try {
        // get all values from redis by query
        const toxicDataKeys = await client.keys('*DXTradeAPI*');
        console.log('Toxic data keys number:', toxicDataKeys.length);
        for (const key of toxicDataKeys) {
            const toxicData = await client.get(key);
            console.log(`{ 'deal': ${toxicData} }`);
            if (toxicData) {
                //console.log('Toxic data:', toxicData);
                // do something with toxic data
            }
        }
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function analysis() {
    await processToxicData();
    setInterval(async () => {
        await processToxicData();
    }, interval);
}

analysis();
*/
function subscribeToStream(stream) {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            const messages = yield redis.xread('BLOCK', 0, 'STREAMS', stream, '$');
            messages[0][1].forEach((message) => {
                console.log(`New record detected in stream: ${stream} with data:`, JSON.parse(message[1][1]));
            });
        }
    });
}
// Example usage
subscribeToStream('mystream');
