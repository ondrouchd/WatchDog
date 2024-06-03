import { cp } from "fs";
import Redis from 'ioredis';
import moment from "moment";


// redis require two instances of client. One for subscriber mode and second for getting data by key.
let client: any = new Redis();
let client2: any = new Redis();

async function searchKeys(pattern: string) {
    const keys = [];
    let cursor = '0';
    do {
      const result = await client2.scan(cursor, 'MATCH', pattern);
      cursor = result[0];
      keys.push(...result[1]);
    } while (cursor !== '0');
    return keys;
  }

  async function getValues(keys: any[]) {
    if (keys.length > 0) {
        const values = await client2.mget(...keys);
        return values;
    }
  }

  /*
  async function searchKeysAndValues(currencyPairCondition: string, timeDifferCondition: string, balanceCondition: number) {
    const keys = await searchKeys(`*${currencyPairCondition}*`)
    const matchedKeys = [];
  
    for (const key of keys) {
      if (key.includes(currencyPairCondition) && key.includes(timeDifferCondition)) {
        const value = await client2.get(key);
        const deal = JSON.parse(value).Deal;
        
        // Calculate balance +/- 5%
        const fivePercent = balanceCondition * 0.05;
        const upperLimit = balanceCondition + fivePercent;
        const lowerLimit = balanceCondition - fivePercent;
  
        // Check if balance condition is met
        if (deal.Volume >= lowerLimit && deal.Volume <= upperLimit) {
          matchedKeys.push(key);
        }
      }
    }

    let parsedValues = [];
    if (matchedKeys.length > 0){
        const matchedValues = await client2.mget(...matchedKeys);
        parsedValues = matchedValues.map((value: string) => JSON.parse(value));
    } 
  
    return parsedValues;
  }
  */

  async function searchKeysAndValues(currencyPairCondition: any, timeDifferCondition: any, balanceCondition: any) {
    const keys = await searchKeys(`*${currencyPairCondition}*`);
    
    // transform keys to object values
    const values = await getValues(keys);

    values.forEach((value: any) => {
        const parsedObject = JSON.parse(value);
        console.log('Value:', parsedObject.Deal.CurrencyPair, parsedObject.Deal.Side, parsedObject.Deal.Lot, parsedObject.Deal.Timestamp, parsedObject.Deal.Balance);
    });
    
    //const filteredKeys = keys.filter(key => key.includes(timeDifferCondition) || key.includes(setTimeDiffer(timeDifferCondition)) );
    
    // get value for filtered keys
    //const values = await getValues(filteredKeys);
    //const result = filteredKeys.map((key, index) => ({ [key]: values[index] }));
    //return result;
    
    return values;
  }

function setTimeDiffer(dateTimeString: string, offset: number = 1000) {
    const timestamp = moment(dateTimeString).valueOf();
    const newTimestamp = moment(timestamp - offset); 
    const formattedDateTime = newTimestamp.format('YYYY-MM-DD HH:mm:ss');
    console.log('New differ timestamp:', formattedDateTime);

    return formattedDateTime;
}

function subscribeToNewRecords(): void {
    client.subscribe('newRecordChannel', (err: { message: any; }, count: any) => {
        if (err) {
            console.error('Failed to subscribe: %s', err.message);
        } else {
            console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
        }
    });

    client.on('message', (channel: string, message: string) => {
        if (channel === 'newRecordChannel') {
            let parsedObject: any = {};
            //console.log(`New record detected: ${message}`);
            client2.get(message).then((result: any) => {
                //console.log(`${result}`);
                parsedObject = JSON.parse(result);
                console.log(parsedObject.Deal.CurrencyPair, parsedObject.Deal.Side, parsedObject.Deal.Lot, parsedObject.Deal.Timestamp, parsedObject.Deal.Balance);

                searchKeysAndValues(parsedObject.Deal.CurrencyPair, parsedObject.Deal.Timestamp, parsedObject.Deal.Balance).then((result: any) => {
                    result.forEach((element: any) => {
                        const parsedElement = JSON.parse(element);
                        console.log('Toxic data:', parsedElement.Deal.CurrencyPair, parsedElement.Deal.Side, parsedElement.Deal.Lot, parsedElement.Deal.Timestamp, parsedElement.Deal.Balance);
                        client2.set(`toxicData-${parsedElement.Deal.Timestamp}`, element);
                    });
                    
                }).catch(error => {
                    console.error('Chyba:', error);
                });
            });
        }
    });
}

subscribeToNewRecords();