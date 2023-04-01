<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Installation

```bash
$ yarn install
```

## Running the app

### Environment variables

Add a .env file to the root of the project with the variables in the .env.example file.

### Install dependencies and run the app

```bash
# install dependencies
$ yarn install

# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Husky Pre-commit Hook

This repo uses Husky to ensure code that is not passing our linting requirement is not committed. The pre-commit hook will essentially run `yarn run lint` on your staged files. It will not allow you to commit if there are linting errors.

You can view the pre-commit hook in the file `.husky/pre-commit.`

You can bypass the pre-commit hook by using the `--no-verify` flag when committing. This should only be used in emergencies.

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

## Developing in NestJs

### Generate a new resource

`nest g resource` command not only generates all the NestJS building blocks (module, service, controller classes) but also an entity class, DTO classes as well as the testing (.spec) files.

```bash
`nest g resource`
```

### Create a new module only

```bash
nest g module <<module-name>>
```

### Create a new service only

```bash
nest g service <<service-name>>
```

Generate without tests (spec file) - not recommended as every file should have a corresponding spec/test file:

```bash
nest g service <<service-name>> --no-spec
```

### Create a new controller only

```bash
nest g controller <<controller-name>>
```

## Prisma Schema management and migrations

Prisma can generate new migration.sql files every time we change the PostgreSQL database schema in `prisma/schema.prisma`. Read the official [Getting Started: Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate/get-started) docs to understand how it works.

1. Make changes to the schema in `prisma/schema.prisma`
2. Update relevant data transform object (DTO) files
3. Update relevant entity files to update Swagger types
4. Run prisma migrate to generate migration.sql files: `yarn prisma migrate dev --name name-your-changes`
5. Restart Prisma studio (`yarn studio` script). You should see your new data model in the Prisma studio

Where `name-your-changes` should describe the changes you made to the schema.
