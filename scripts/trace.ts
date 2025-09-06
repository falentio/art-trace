import { GoogleGenAI } from "@google/genai/web";
import { TracerService } from "../src/lib/server/modules/tracer/tracer.service.ts";
process.loadEnvFile();
const genai = new GoogleGenAI({
	apiKey: process.env.GOOGLE_GENAI_API_KEY,
});
const tracer = new TracerService(genai);
await tracer.createTraceDescriptors(
	[
		{
			"uri": "https://generativelanguage.googleapis.com/v1beta/files/b4t954w640sn",
			"mimeType": "image/jpeg",
		},
		{
			"uri": "https://generativelanguage.googleapis.com/v1beta/files/qtge4x49rrtj",
			"mimeType": "image/jpeg",
		},
		{
			"uri": "https://generativelanguage.googleapis.com/v1beta/files/b71ul4ahe2zr",
			"mimeType": "image/jpeg",
		},
		{
			"uri": "https://generativelanguage.googleapis.com/v1beta/files/bfuyhaql6bf9",
			"mimeType": "image/jpeg",
		},
		{
			"uri": "https://generativelanguage.googleapis.com/v1beta/files/agzt6ci46k93",
			"mimeType": "image/jpeg",
		},
		{
			"uri": "https://generativelanguage.googleapis.com/v1beta/files/xap959vu42la",
			"mimeType": "image/jpeg",
		},
	],
);
