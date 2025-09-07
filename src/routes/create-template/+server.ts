import { gen, tracer } from "$lib/server/index";

export const POST = async ({ request }) => {
	const images = await request.json();
	const template = await tracer.createTraceDescriptors(images);
	const created = await gen.createTemplate(template);
	return Response.json({ success: true, id: created.id });
};
