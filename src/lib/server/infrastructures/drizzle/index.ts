import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql/web";
import * as schema from "./schema";
export function createDatabase(
	url: string,
	token: string,
) {
	const client = createClient({
		url,
		authToken: token,
	});
	return drizzle(client, {
		schema,
	});
}
export type Database = ReturnType<typeof createDatabase>;
