import { gen, tracer } from "$lib/server/index";

export const POST = async ({ request }) => {
	const images = await request.json();
	if (!images.length) {
		return Response.json({ success: false, error: "No images provided" }, { status: 400 });
	}
	const template = await tracer.createTraceDescriptors(images);
	const created = await gen.createTemplate(template);
	return Response.json({ success: true, id: created.id });
};
