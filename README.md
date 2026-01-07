# google-ai-backslash-repro

Reproduction of an issue with backslashes in keys with Gemini structured output: https://github.com/googleapis/js-genai/issues/1226

## Instructions

Install dependencies:

```bash
npm install
```

Add a Gemini API key to a `.env` file in the root of the project:

```
API_KEY=your_api_key_here
```

Run the script (requires Node 24+):

```bash
node src/index.ts
```

Observe output like the following, where the schema that has a key with a backslash fails to parse/validate:

```
Testing schema: BackslashSchema
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "\\mathbf{abc}": {
      "type": "boolean"
    }
  },
  "required": [
    "\\mathbf{abc}"
  ],
  "additionalProperties": false
}
Error parsing response for schema: BackslashSchema
Response text was: {"\mathbf{abc}":true}
Full error message: SyntaxError: Bad escaped character in JSON at position 3 (line 1 column 4)

Testing schema: NoBackslashSchema
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "mathbf{abc}": {
      "type": "boolean"
    }
  },
  "required": [
    "mathbf{abc}"
  ],
  "additionalProperties": false
}
Response object for NoBackslashSchema: { 'mathbf{abc}': true }
```
