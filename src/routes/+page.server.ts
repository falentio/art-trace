import { gen } from "$lib/server/index";

export const load = async () => {
	const templtates = await gen.listTemplates();
	const templatesWithExample = await Promise.all(
		templtates.map(async (template) => {
			const generated = await gen.listByTemplateId(template.id);
			return {
				template,
				generated,
			};
		}),
	);
	return { templtates: templatesWithExample };
};
