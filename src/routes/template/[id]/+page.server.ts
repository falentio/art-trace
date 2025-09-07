import { gen } from "$lib/server/index";

export const load = async ({ params }) => {
	const [generated, template] = await Promise.all([
		gen.listByTemplateId(params.id),
		gen.getTemplate(params.id),
	]);
	if (!template) {
		throw new Error("Template not found");
	}
	return { generated, template };
};
