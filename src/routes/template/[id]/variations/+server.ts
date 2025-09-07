import { gen, genai } from "$lib/server/index";

export const POST = async ({ params, request }) => {
	const image = await request.json();
	const res = await fetch(image.uri);
	const uri = await genai.files.upload({
		file: await res.arrayBuffer().then(buf => new Blob([buf], { type: image.mimeType })),
	});
	const result = await gen.generate({
		image: {
			uri: uri.uri!,
			mimeType: image.mimeType,
		},
		templateId: params.id,
		variation: true,
	});
	return Response.json({ id: result.id });
};
