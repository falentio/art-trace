import { gen } from "$lib/server/index";
[
	{
		"uri": "https://generativelanguage.googleapis.com/v1beta/files/azyv5jf3bgxx",
		"mimeType": "image/jpeg",
	},
];
export const POST = async () => {
	const result = await gen.generate({
		templateId: "166ab39b-571e-45f9-97e6-13d9d6a0a45b",
		image: {
			"uri": "https://generativelanguage.googleapis.com/v1beta/files/azyv5jf3bgxx",
			"mimeType": "image/png",
		},
	});
	return Response.json({ success: true, result: result.id });
};
