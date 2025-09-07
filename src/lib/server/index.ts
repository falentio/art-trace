import { env } from "$env/dynamic/private";
import { createDatabase } from "$lib/server/infrastructures/drizzle/index";
import { GenRepository } from "$lib/server/modules/gen/gen.repository";
import { GenService } from "$lib/server/modules/gen/gen.service";
import { TemplateRepository } from "$lib/server/modules/gen/template.repository";
import { TracerService } from "$lib/server/modules/tracer/tracer.service";
import { GoogleGenAI } from "@google/genai/web";

export const genai = new GoogleGenAI({
	apiKey: env.GOOGLE_GENAI_API_KEY,
});

const db = createDatabase(
	env.LIBSQL_DATABASE_URL,
	env.LIBSQL_DATABASE_AUTH_TOKEN,
);

const templateRepository = new TemplateRepository(db);
const genRepository = new GenRepository(db);

export const tracer = new TracerService(genai);
export const gen = new GenService(genai, templateRepository, genRepository);
