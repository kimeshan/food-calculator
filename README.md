<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Running the app
### Database
First, get the Postgres database up and running. We recommend using the `-d` docker compose flag to run the contain in detached mode (in the background).

```bash
# Start the database (in root directory of this repo)
docker compose up -d
```

If it successfully starts, you should see something like this in the terminal:
```
food-calculator-db-1  | 2023-01-24 10:48:59.057 UTC [1] LOG:  database system is ready to accept connections
```

Other useful docker commands:
```bash
# See what docker processes are running
docker ps

# See the latest logs
docker logs
```