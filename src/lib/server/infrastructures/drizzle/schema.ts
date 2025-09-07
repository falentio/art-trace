import { blob, int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const TTemplate = sqliteTable("template", {
	id: text().primaryKey().$default(() => crypto.randomUUID()),
	description: text().notNull(),
	title: text().notNull(),
	template: text().notNull(),
	createdAt: int({ mode: "timestamp" }).$default(() => new Date()),
});

export type Template = typeof TTemplate.$inferSelect;

export const TGenerate = sqliteTable("generate", {
	id: text().primaryKey().$default(() => crypto.randomUUID()),
	templateId: text()
		.notNull()
		.references(() => TTemplate.id, { onDelete: "cascade" }),
	imageBlob: text().notNull(),
	imageMimeType: text().notNull(),
	createdAt: int({ mode: "timestamp" }).$default(() => new Date()),
});
export type Generate = typeof TGenerate.$inferSelect;
