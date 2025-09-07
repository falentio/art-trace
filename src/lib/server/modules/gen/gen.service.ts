import type { Template } from "$lib/server/infrastructures/drizzle/schema";
import type { GenRepository } from "$lib/server/modules/gen/gen.repository";
import type { CreateTemplateRequest, GenerateRequest } from "$lib/server/modules/gen/gen.schema";
import type { TemplateRepository } from "$lib/server/modules/gen/template.repository";
import type { ImageData } from "$lib/types";
import { createPartFromUri, createUserContent, type GoogleGenAI } from "@google/genai/web";
import { decodeBase64 } from "@std/encoding/base64";
import generateImageSystemPrompt from "./generate-image-system-prompt.md?raw";
export class GenService {
	constructor(
		private genai: GoogleGenAI,
		private templateRepository: TemplateRepository,
		private genRepository: GenRepository,
	) {}

	createTemplate(template: CreateTemplateRequest) {
		return this.templateRepository.create(template);
	}

	listTemplates() {
		return this.templateRepository.list();
	}

	getTemplate(id: string) {
		return this.templateRepository.get(id);
	}

	listByTemplateId(templateId: string) {
		return this.genRepository.listByTemplateId(templateId);
	}

	async getImage(id: string) {
		const gen = await this.genRepository.get(id);
		if (!gen) throw new Error("Generated image not found");
		return {
			blob: gen.imageBlob,
			mimeType: gen.imageMimeType,
		};
	}

	async generate(req: GenerateRequest) {
		const tmpl = await this.templateRepository.get(req.templateId);
		if (!tmpl) throw new Error("Template not found");
		return this.generateImage(tmpl, req.image, req.variation);
	}

	async getAlternate(image: ImageData) {
		const response = await this.genai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: [
				createUserContent([
					createPartFromUri(image.uri, image.mimeType),
					JSON.stringify({
						task: "Think about new poses, expressions, positions for the character.",
						rules: [
							"do not describe the character",
							"do not mention the character",
							"focus on new poses, expressions, positions",
						],
						notes: ["be creative"],
					}),
				]),
			],
		});
		return response.text || "";
	}

	async generateImage(template: Template, image: ImageData, variation = false) {
		const response = await this.genai.models.generateContent({
			model: "gemini-2.5-flash-image-preview",
			contents: [
				createUserContent([
					"Here is the art-style descriptions for you to follow:",
					template.template,
					"Here is the image to recreate:",
					createPartFromUri(image.uri, image.mimeType),
					variation
						? JSON.stringify({
							task:
								"Create variation of the given image that follows the art-style descriptions provided.",
							rules: [
								"follow all rules in system prompt",
								"make sure the new image is a variation, not a complete re-creation",
								"keep the main subject, composition, and elements of the original image while applying the art styles",
								"you can change minor details to better fit the art styles, but avoid major alterations that would change the essence of the original image",
								"ensure the new image still clearly relates to the original image",
								"act as you are drawing alternate stickers of the same character in different art styles",
								"dont use same poses as original image",
								"dont use same expression as original image",
								"dont use same position as original image",
								"be creative about new poses, expressions, positions",
							],
							notes: ["follow all rules in system prompt"],
							alternate: await this.getAlternate(image),
						})
						: JSON.stringify({
							task: "Generate an image that follows the art-style descriptions provided.",
							notes: [
								"follow all rules in system prompt",
							],
						}),
				]),
			],
			config: {
				systemInstruction: generateImageSystemPrompt,
			},
		});

		if (!response.candidates?.[0]?.content?.parts?.length) {
			console.error(JSON.stringify(response, null, 2));
			throw new Error("No image generated");
		}
		const imageData = response.candidates[0].content.parts.find(part => part.inlineData?.data)?.inlineData;
		if (!imageData?.data) throw new Error("No image data");
		return this.genRepository.create({
			templateId: template.id,
			imageBlob: imageData.data,
			imageMimeType: imageData.mimeType || "image/png",
		});
	}
}
