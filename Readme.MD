## Create a new typescript Node.js application

### Create a new folder for your project
```
mkdir my-first-node-app-ts
cd my-first-node-app-ts
```

### Initialize a new Node.js project
```
npm init -y
```

### Install ts-node-dev
To be able to run in development mode.
```
npm install ts-node-dev --save-dev
```

### Install Typescript
```
npm install typescript @types/node --save-dev
```

### Install Express
Express is minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. https://expressjs.com/ <https://expressjs.com/>
```
npm install express
npm install @types/express --save-dev
```

### Install moment
```
npm install moment
```

### Initialize Typescript configuration
```
npx tsc --init
```

### Create src folder and index.ts 
You can use touch on linux otherwise create index.ts manually on windows operating system.
```
mkdir src
touch src/index.ts
```

### For API you can use swagger
```
npm install swagger-jsdoc
npm i --save-dev @types/swagger-jsdoc
npm install swagger-ui-express swagger-jsdoc
npm i --save-dev @types/swagger-ui-express

```

### For consuming API use Axios
```
npm install axios
```

## Start coding and enjoy :-) 

### Install dependencies
```
npm install
```

### Add scripts into package.json
```
"build": "tsc",
"start": "node dist/index.js",
"dev": "ts-node-dev --respawn src/index.ts"
```

## Install and run Redis for fast storing and reading
```
npm install redis
npm install @types/redis
```

### Download and run Redis from Docker hub.
```
docker run --name my-redis -d redis
```
