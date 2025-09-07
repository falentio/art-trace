/// <reference types="vite" />
import { defineConfig } from "drizzle-kit";

console.log({
	url: process.env.LIBSQL_DATABASE_URL,
	token: process.env.LIBSQL_DATABASE_AUTH_TOKEN,
});

export default defineConfig({
	schema: "./src/lib/server/infrastructures/drizzle/schema.ts",
	out: "./drizzle",
	dialect: "turso",
	dbCredentials: {
		url: process.env.LIBSQL_DATABASE_URL!,
		authToken: process.env.LIBSQL_DATABASE_AUTH_TOKEN!,
	},
	strict: true,
	verbose: true,
});
