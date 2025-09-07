import type { Database } from "$lib/server/infrastructures/drizzle/index";
import { type Template, TTemplate } from "$lib/server/infrastructures/drizzle/schema";
import { desc, eq, sql } from "drizzle-orm";

export class TemplateRepository {
	constructor(
		private db: Database,
	) {}

	async create(req: TemplateRepository.CreateRequest): Promise<TemplateRepository.CreateResponse> {
		const result = await this.db
			.insert(TTemplate)
			.values(req)
			.returning()
			.get();
		return result;
	}

	async get(id: string): Promise<Template | undefined> {
		return this.db
			.select()
			.from(TTemplate)
			.where(eq(TTemplate.id, id))
			.get();
	}

	list(): Promise<Template[]> {
		return this.db
			.select()
			.from(TTemplate)
			.orderBy(desc(TTemplate.createdAt))
			.limit(20)
			.all();
	}
}

export declare namespace TemplateRepository {
	export type CreateRequest = {
		template: string;
		title: string;
		description: string;
	};

	export type CreateResponse = {
		id: string;
	};
}
