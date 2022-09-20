<p align="center">
  <img src="./pt.svg" width="200" alt="PlayTorr Logo" />
</p>

[circleci-image]: ./pt.svg

<h1 align="center">PlayTorr</h1>
<h3 align="center">App for watcing torrent movies by MPEG-DASH stream.</h3>
<p align="center">Build on top of <br /><a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="16" alt="Nest Logo" /> Nest.js</a></p>

## Description

The backend part consists of 3 microservices:
* <span style="color: #de3f3f">communication-api</span> - entry point and communication layer for all microservices;
* <span style="color: #de3f3f">main-api</span> - contains the main modules of registration, authorization, telegram bot implementation, connection of S3 compatible MinIO storage;
* <span style="color: #de3f3f">movie-processioning-api</span> - contains all logic of video loading and processing

### App installation

```
# for first installation
npm run first-install

# for clear reinstallation
npm run reinstall
```

### Running Docker services

```
npm run start-docker-services
```

### Running the app

```
# development
npm run start-all-apis

# watch mode
npm run start-all-apis:dev

# production mode
npm run start-all-apis:prod
```

### Test

```
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

### License

PlayTorr is [MIT licensed](LICENSE).
