import { gen } from "$lib/server/index";
import { decodeBase64 } from "@std/encoding/base64";

export const GET = async ({ params }) => {
	const { id } = params;
	const image = await gen.getImage(id);
	const decoded = decodeBase64(image.blob);
	return new Response(decoded, {
		headers: {
			"Content-Type": image.mimeType,
			"Cache-Control": "public, max-age=31536000, immutable",
			"Content-Disposition": `inline; filename="${id}.${getExtension(image.mimeType)}"`,
		},
	});
};

function getExtension(mimeType: string) {
	switch (mimeType) {
		case "image/png":
			return "png";
		case "image/jpeg":
			return "jpg";
		case "image/webp":
			return "webp";
		case "image/gif":
			return "gif";
		case "image/svg+xml":
			return "svg";
		default:
			return "bin";
	}
}
