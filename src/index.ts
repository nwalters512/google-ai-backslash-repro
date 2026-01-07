import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

process.loadEnvFile(".env");
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const prompt = "Generate an object with a single boolean field set to true.";

const BackslashSchema = z.object({ "\\mathbf{abc}": z.boolean() });
const NoBackslashSchema = z.object({ "mathbf{abc}": z.boolean() });

for (const [schemaName, TestSchema] of [
  ["BackslashSchema", BackslashSchema],
  ["NoBackslashSchema", NoBackslashSchema],
] as const) {
  const jsonSchema = z.toJSONSchema(TestSchema);
  console.log(`\nTesting schema: ${schemaName}`);
  console.log(JSON.stringify(jsonSchema, null, 2));

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: jsonSchema,
    },
  });

  if (!response.text) {
    console.error(
      `No response received from the AI model for schema: ${schemaName}`
    );
    continue;
  }

  try {
    const output = TestSchema.parse(JSON.parse(response.text));
    console.log(`Response object for ${schemaName}:`, output);
  } catch (err: any) {
    console.error(`Error parsing response for schema: ${schemaName}`);
    console.error(`Response text was: ${response.text}`);
    console.error(`Full error message: ${err}`);
  }
}
