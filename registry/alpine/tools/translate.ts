import { z } from "zod";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Tool } from "ai";

export interface TranslateResult {
	text: string;
	targetLanguage: string;
	translated: string;
}

export const translateTool: Tool = {
	name: "translate",
	description: "Translate a given text into a target language (demo/mock).",
	inputSchema: z.object({
		text: z.string().min(1),
		targetLanguage: z.string().default("en"),
	}),
	execute: async ({
		text,
		targetLanguage,
	}: {
		text: string;
		targetLanguage: string;
	}): Promise<TranslateResult> => {
		// Mock translation: annotate rather than call a real API.
		const translated = `[${targetLanguage}] ${text}`;
		return { text, targetLanguage, translated };
	},
};

export default translateTool;
