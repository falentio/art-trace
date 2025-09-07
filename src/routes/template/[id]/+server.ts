import { gen } from "$lib/server/index";

export const POST = async ({ params, request }) => {
	const image = await request.json();
	const result = await gen.generate({
		image,
		templateId: params.id,
		variation: false,
	});
	return Response.json({ id: result.id });
};
