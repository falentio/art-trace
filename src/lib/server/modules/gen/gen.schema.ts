import { vv } from "$lib/server/utils/valibot/index";
import * as v from "valibot";
export const Template = v.object({
	id: vv.id(),
	template: vv.longText(),
	title: vv.titleText(),
	description: vv.longText(),
	createdAt: vv.coercedDate(),
});

export const SCreateTemplateRequest = v.pick(Template, ["template", "title", "description"]);
export type CreateTemplateRequest = v.InferOutput<typeof SCreateTemplateRequest>;

export const SGenerateRequest = v.object({
	templateId: vv.id(),
	image: v.object({
		uri: v.pipe(v.string(), v.url()),
		mimeType: vv.shortText(),
	}),
});
export type GenerateRequest = v.InferOutput<typeof SGenerateRequest>;
