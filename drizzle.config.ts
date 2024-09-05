import { defineConfig } from "drizzle-kit";



declare module "bun" {
    interface Env {
        DATABASE_URL: string;
    }
  }

export default defineConfig({
    dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
    schema: "./src/database/schema/*",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
    

});