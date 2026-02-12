<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Two-factor Authentication

**Stack:**

- NestJS
- TypeScript
- Prisma

## Running the app

```bash
docker compose up -d
npm run start:dev
```

## Example of .env

```
PORT=8080
SERVER_URL=http://localhost:8080

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"

EMAIL_TRANSPORT=smtp://your_email_address:your_email_key@smtp.gmail.com:587
EMAIL_ADDRESS=your_email_address

ACCESS_TOKEN=your_access_token_secret
REFRESH_TOKEN=your_refresh_token_secret
```
