import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: { 
            title: 'Dummy DXTrade API',
            version: '1.0.0',
            description: 'Dummy DX Trade API.',
            contact: {
                name: 'David Ondrouch',
                email: 'david.ondrouch@gmail.com'
            },
            servers: [
                {
                    url: 'http://localhost:3000',
                    description: 'Development server'	
                }
            ]
        }
    },
    apis: [path.join(__dirname, './**/*.ts')]
    //apis: [process.env.NODE_ENV === 'production' ? 'dist/index.js' : 'src/index.ts'], // Adjust path based on environment
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;