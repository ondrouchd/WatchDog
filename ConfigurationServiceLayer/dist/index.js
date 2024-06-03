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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./swagger"));
const redis = require('redis');
let client = null;
function startRedisConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        client = redis.createClient(6379, '127.0.0.1');
        yield client.connect();
    });
}
function getConfig(key) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            client.get(key, (err, value) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(value);
                }
            });
        });
    });
}
function setConfig(key, value) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.set(key, value);
    });
}
startRedisConnection();
const app = (0, express_1.default)();
const port = 3001;
app.use('/swagger', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
app.use(body_parser_1.default.json());
app.post('/config', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { key, value } = req.body;
    try {
        yield setConfig(key, value);
        res.send(`Configuration set: ${key} = ${value}`);
    }
    catch (error) {
        res.status(500).send(`Failed to set configuration: ${error}`);
    }
}));
app.get('/config/:key', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const key = req.params.key;
    try {
        const value = yield getConfig(key);
        if (value) {
            res.send(`Configuration: ${key} = ${value}`);
        }
        else {
            res.status(404).send(`Configuration for key "${key}" not found`);
        }
    }
    catch (error) {
        res.status(500).send(`Failed to get configuration: ${error}`);
    }
}));
app.listen(port, () => {
    console.log(`Configuration service is running at http://localhost:${port}`);
});
