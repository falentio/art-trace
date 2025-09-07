import { type Content, createPartFromUri, createUserContent, GoogleGenAI } from "@google/genai/web";
import { toJsonSchema } from "@valibot/to-json-schema";
import * as v from "valibot";
import tracerSystemPrompt from "./tracer-system-prompt.md?raw";

export const TraceDescriptors = v.pipe(
	v.record(
		v.string(),
		v.pipe(
			v.record(
				v.string(),
				v.pipe(
					v.string(),
					v.description(
						"We prefer descriptors as compact as possible and relevant with sub-descriptors, but we don't limit how much descriptors ",
					),
				),
			),
			v.description("A mapping of sub-descriptors for more specific descriptions."),
		),
	),
	v.description(
		"A mapping of trace descriptor names to their values. the keys are a parts of the art styles. and have sub-parts for more specific descriptions",
	),
);

export class TracerService {
	constructor(
		private genai: GoogleGenAI,
	) {}

	async createTraceDescriptors(images: {
		uri: string;
		mimeType: string;
	}[]) {
		const response = await this.genai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: [
				createUserContent({
					text: tracerSystemPrompt,
				}),
				createUserContent(
					images.map(img => createPartFromUri(img.uri, img.mimeType)),
				),
				createUserContent(
					"{\"task\":\"Describe the art styles in the images provided. Provide a JSON object with keys as art style parts and values as lists of descriptors. Use sub-keys for more specific descriptions.\"}",
				),
			],
			config: {
				responseJsonSchema: toJsonSchema(TraceDescriptors),
				thinkingConfig: {
					includeThoughts: false,
					thinkingBudget: 2096,
				},
			},
		});
		if (!response.text) {
			throw new Error("TracerService: response.text is undefined");
		}
		const [title, description] = await Promise.all([
			this.createTitle(response.text),
			this.createDescriptions(response.text),
		]);
		return {
			template: response.text,
			title,
			description,
		};
	}

	async createDescriptions(text: string) {
		const response = await this.genai.models.generateContent({
			model: "gemini-2.5-flash-lite",
			contents: [
				createUserContent(text),
				createUserContent(
					"Based on art styles above, please create conclusion about the art style, you must describe as compact as possible within 1 sentence with maximum 20 words.",
				),
			],
		});
		if (!response.text) {
			throw new Error("No description generated");
		}
		return response.text;
	}

	async createTitle(text: string) {
		const response = await this.genai.models.generateContent({
			model: "gemini-2.5-flash-lite",
			contents: [
				createUserContent([
					text,
					"based on above art styles, please help me choose suitable title for that art styles, describe using less then 8 words. Reply only with single sentences/title, I dont need variant of title. Just reply a plain text.",
				]),
			],
		});
		if (!response.text) {
			throw new Error("No title generated");
		}
		return response.text;
	}
}
