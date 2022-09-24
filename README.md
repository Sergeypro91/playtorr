<p align="center">
  <img src="frontend/src/assets/images/svg/pt.svg" width="200" alt="PlayTorr Logo" />
</p>

[circleci-image]: frontend/src/assets/images/svg/pt.svg

<h1 align="center">PlayTorr</h1>
<h3 align="center">App for watcing torrent movies by MPEG-DASH stream.</h3>
<p align="center">Build on top of <br /><a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="16" alt="Nest Logo" /> Nest.js</a></p>

## Description
The backend part consists of 3 microservices:
* <span style="color: #de3f3f">communication-api</span> - entry point and communication layer for all microservices;
* <span style="color: #de3f3f">main-api</span> - contains the main modules of registration, authorization, telegram bot implementation, connection of S3 compatible MinIO storage;
* <span style="color: #de3f3f">movie-processioning-api</span> - contains all logic of video loading and processing
<hr />

## App installation & running
### Step 1
To run the application, you need to create an .env file in the project directory with the following variables:
<table>
    <tr>
        <td>MAIN_API_PORT</td>
        <td>MOVIE_PROCESSING_PORT</td>
    </tr>
    <tr>
        <td>MONGO_LOGIN</td>
        <td>MONGO_PASSWORD</td>
    </tr>
    <tr>
        <td>MONGO_HOST</td>
        <td>MONGO_PORT</td>
    </tr>
    <tr>        
        <td>MONGO_DATABASE</td>
        <td>MONGO_AUTH_DATABASE</td>
    </tr>
    <tr>
        <td>REDIS_KEY</td>
        <td>REDIS_HOST</td>
    </tr>
    <tr>
        <td>REDIS_PORT</td>
        <td>REDIS_TTL</td>
    </tr>
    <tr>
        <td>TELEGRAM_BOT_TOKEN</td>
        <td>TELEGRAM_CHAT_ID</td>
    </tr>
    <tr>
        <td>MINIO_ENDPOINT</td>
        <td>MINIO_PORT</td>
    </tr>
    <tr>
        <td>MINIO_ACCESS_KEY</td>
        <td>MINIO_SECRET_KEY</td>
    </tr>
    <tr>
        <td>MINIO_BUCKET_NAME</td>
        <td>JWT_SECRET</td>
    </tr>
    <tr>
        <td>JWT_TTL</td>
    </tr>
</table>

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
