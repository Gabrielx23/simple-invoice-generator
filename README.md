
## Description
Simple invoices generator. API docs for the project are available with a Swagger documentation at `/api`.
Run `docker-compose up --build -V -d` and go to `http://localhost:3000/api`
API allows to create companies, contractors and invoices. 
It connects DDD aproach in Invoice block
with normal nest modules.

## Technologies & Concepts
1. Nest.js
2. TypeORM
3. MySQL
4. Docker
5. Jest
6. DDD

## Before first run

1. Run `npm install`
2. Copy `.env.example` to `.env` and fill it with your data
3. Run tests `npm run test`

## Running with docker

```bash
$ docker-compose up --build -V -d
```

## Running without docker

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
## License

[MIT licensed](LICENSE).
