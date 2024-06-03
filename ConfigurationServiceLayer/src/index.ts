import bodyParser from "body-parser";
import express from "express";
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swagger';

const redis = require('redis');

let client: any = null;

async function startRedisConnection() {
    client = redis.createClient(6379, '127.0.0.1');
    await client.connect();   
}

async function getConfig(key: string) {
    return new Promise<string>((resolve, reject) => {
        client.get(key, (err: any, value: string) => {
            if (err) {
                reject(err);
            } else {
                resolve(value);
            }
        });
    });
}

async function setConfig(key: string, value: string) {
    await client.set(key, value);
}

startRedisConnection();

const app = express();
const port = 3001;
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(bodyParser.json());

app.post('/config', async (req, res) => {
    const { key, value } = req.body;
    try {
        await setConfig(key, value);
        res.send(`Configuration set: ${key} = ${value}`);
    } catch (error) {
        res.status(500).send(`Failed to set configuration: ${error}`);
    }
});

app.get('/config/:key', async (req, res) => {
    const key = req.params.key;
    try {
        const value = await getConfig(key);
        if (value) {
            res.send(`Configuration: ${key} = ${value}`);
        } else {
            res.status(404).send(`Configuration for key "${key}" not found`);
        }
    } catch (error) {
        res.status(500).send(`Failed to get configuration: ${error}`);
    }
});

app.listen(port, () => {
    console.log(`Configuration service is running at http://localhost:${port}`);
});