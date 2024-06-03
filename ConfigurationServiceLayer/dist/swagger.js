"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const path_1 = __importDefault(require("path"));
const isProduction = process.env.NODE_ENV === 'production';
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Configuration Service Layer API',
            version: '1.0.0',
            description: 'Configuration Service Layer API.',
            contact: {
                name: 'David Ondrouch',
                email: 'david.ondrouch@gmail.com'
            },
            servers: [
                {
                    url: 'http://localhost:3001',
                    description: 'Development server'
                }
            ]
        }
    },
    apis: [path_1.default.join(__dirname, './**/*.ts')]
    //apis: [process.env.NODE_ENV === 'production' ? 'dist/index.js' : 'src/index.ts'], // Adjust path based on environment
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
exports.default = swaggerDocs;
