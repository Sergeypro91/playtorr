<p align="center">
  <img src="frontend/src/assets/images/svg/pt.svg" width="200" alt="PlayTorr Logo" />
</p>

[circleci-image]: frontend/src/assets/images/svg/pt.svg

<h1 align="center">PlayTorr</h1>
<h3 align="center">App for watcing torrent movies by MPEG-DASH stream.</h3>
<p align="center">Build on top of <br /><a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="16" alt="Nest Logo" /> Nest.js</a></p>

## Description
The backend part consists of 4 microservices:
* <b style="color: #de3f3f; font-size: 1.2rem">api</b> - responsible for proxying requests to other microservices;
* <b style="color: #de3f3f; font-size: 1.2rem">auth</b> - responsible for working with users and authorization methods;
* <b style="color: #de3f3f; font-size: 1.2rem">minio</b> - responsible for connection of S3 compatible MinIO storage;
* <b style="color: #de3f3f; font-size: 1.2rem">telegram</b> - responsible for telegram bot functional;
<hr />

## App installation & running
### Step 1
To run the application, you need to create an `.env` file in the `./envs` directory with the following variables (note that some values need to be personalized):
```
MAIN_API_PORT=3000

MONGO_LOGIN=mongoLogin
MONGO_PASSWORD=mongoPassword
MONGO_HOST=127.0.0.1
MONGO_PORT=27017
MONGO_DATABASE=mongoDatabase
MONGO_AUTH_DATABASE=admin

REDIS_KEY=redisKey
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_TTL=3600000

RMQ_USER=rmqUser
RMQ_PASS=rmqPass
RMQ_EXCHANGE=rmqExchange
RMQ_HOST=localhost

TELEGRAM_BOT_TOKEN=telegramBotToken
TELEGRAM_CHAT_ID=telegramChatId

MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioAccessKey
MINIO_SECRET_KEY=minioSecretKey
MINIO_BUCKET_NAME=minioBucketName

JWT_SECRET=jwtSecret
JWT_TTL=3600000
```

Don't worry, the environment variable file will be copied to the correct directories when the application starts.
<hr />

### Step 2
Install <b>Backend</b> services:

```
# install packages
npm run install:backend

# clear instalation / reinstall packages
npm run reinstall:backend
```

<hr />

### Step 3
Running <b>Docker</b> services:

```
npm run start-docker-services
```

<hr />

### Step 4
Running <b>Backend</b> services:

```
# development mode
npm run start:backend

# watch mode
npm run start:dev:backend

# debug mode
npm run start:debug:backend

# production mode
npm run start:prod:backend
```

<hr />

### Step 5
Install <b>Frontend</b>:

```
# install packages
npm run install:frontend

# clear instalation / reinstall packages
npm run reinstall:frontend
```

<hr />

### Step 6
Run <b>Frontend</b>:
```
# development mode
npm run start:frontend

# watch mode
npm run start:dev:frontend
```

<hr />

## App build

<hr />

### License

PlayTorr is [MIT licensed](LICENSE).
