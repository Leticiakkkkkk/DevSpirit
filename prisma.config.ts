import "dotenv/config"; 
import { defineConfig, env } from "prisma/config";

type Env = {
  DIRECT_DATABASE_URL: string;
  DATABASE_URL?: string; 
};

export default defineConfig({
  schema: "server/prisma/schema.prisma",
  migrations: {
    path: "server/prisma/migrations",
  },
  datasource: {
    url: env<Env>("DIRECT_DATABASE_URL"),
  },
});
