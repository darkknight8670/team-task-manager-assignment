# Railway Deployment Guide

Follow these steps to deploy the Team Task Manager to Railway.

## 1. Prepare your Repository
1. Initialize a git repository if you haven't already:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Push your code to a GitHub repository.

## 2. Setup Database on Railway
1. Log in to [Railway](https://railway.app/).
2. Create a **New Project**.
3. Select **Provision PostgreSQL**. Railway will give you a `DATABASE_URL`.

## 3. Deploy the App
1. In your Railway project, click **New** -> **GitHub Repo**.
2. Select your repository.
3. Railway will start the build. It will likely fail at first because environment variables are missing.

## 4. Configure Environment Variables
In the **Variables** tab of your service on Railway, add the following:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | The connection string from your Railway Postgres instance. |
| `NEXTAUTH_SECRET` | A random string (e.g., use `openssl rand -base64 32`). |
| `NEXTAUTH_URL` | Your Railway app URL (e.g., `https://your-app-name.up.railway.app`). |
| `NODE_ENV` | `production` |

## 5. Update Prisma for Postgres
Since we used SQLite locally, you need to change the provider in `prisma/schema.prisma` before deploying:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then run `npx prisma migrate dev` or let Railway handle it via a custom build command:
`npx prisma migrate deploy && npm run build`

## 6. Access your App
Once the build succeeds, click the provided domain to access your live application!
