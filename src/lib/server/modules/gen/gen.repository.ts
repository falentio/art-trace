import type { Database } from "$lib/server/infrastructures/drizzle/index";
import { type Generate, TGenerate } from "$lib/server/infrastructures/drizzle/schema";
import { desc, eq } from "drizzle-orm";

export class GenRepository {
	constructor(private db: Database) {}

	async listByTemplateId(templateId: string): Promise<{ id: string }[]> {
		return this.db
			.select({
				id: TGenerate.id,
			})
			.from(TGenerate)
			.where(eq(TGenerate.templateId, templateId))
			.limit(30)
			.orderBy(desc(TGenerate.createdAt))
			.all();
	}

	async get(id: string): Promise<Generate | undefined> {
		return this.db
			.select()
			.from(TGenerate)
			.where(eq(TGenerate.id, id))
			.get();
	}

	async create(req: GenRepository.CreateRequest): Promise<Generate> {
		const result = await this.db
			.insert(TGenerate)
			.values(req)
			.returning()
			.get();
		return result;
	}
}

export declare namespace GenRepository {
	export type CreateRequest = {
		templateId: string;
		imageBlob: string;
		imageMimeType: string;
	};
}
