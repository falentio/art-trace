import { genai } from "$lib/server";
import * as v from "valibot";

const UploadSchema = v.object({
	files: v.pipe(
		v.array(v.file()),
		v.minLength(1),
	),
});

export const POST = async ({ request }) => {
	const form = await request.formData();
	const validated = v.safeParse(UploadSchema, { files: form.getAll("files") });
	if (!validated.success) {
		console.error(validated.issues);
		return Response.json({ success: false, issues: validated.issues }, { status: 400 });
	}
	const urlsPromises = validated.output.files.map(async (file) => {
		const res = await genai.files.upload({
			file,
			config: { abortSignal: request.signal },
		});
		return {
			uri: res.uri,
			mimeType: file.type,
		};
	});
	const urls = await Promise.all(urlsPromises);
	return Response.json({ success: true, urls });
};
