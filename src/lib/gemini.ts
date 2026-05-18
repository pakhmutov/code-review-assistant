import { ReviewResponse } from '@/types/review';

const PROMPT = (code: string, language: string) => `
You are a senior software engineer doing a code review.
Analyze the following ${language === 'Auto-detect' ? '' : language} code and return a JSON response.

Return ONLY valid JSON, no markdown, no explanation. Use this exact structure:
{
  "categories": [
    {
      "type": "bugs",
      "label": "Bugs",
      "emoji": "🐛",
      "items": [{ "line": 5, "description": "..." }]
    },
    {
      "type": "improvements",
      "label": "Improvements",
      "emoji": "⚡",
      "items": [{ "description": "..." }]
    },
    {
      "type": "security",
      "label": "Security",
      "emoji": "🔒",
      "items": [{ "description": "..." }]
    },
    {
      "type": "style",
      "label": "Code Style",
      "emoji": "🎨",
      "items": [{ "description": "..." }]
    }
  ]
}

"line" is optional — include it only when you can pinpoint the exact line number.
If a category has no issues, return an empty items array.

Code to review:
\`\`\`
${code}
\`\`\`
`;

export function streamReviewCode(code: string, language: string): ReadableStream<Uint8Array> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:streamGenerateContent?alt=sse&key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: PROMPT(code, language) }] }],
            generationConfig: { temperature: 0.2 },
          }),
        }
      );

      if (!res.body) {
        controller.error(new Error('No response body from Gemini'));
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const parsed = JSON.parse(line.slice(6));
            if (parsed.error) {
              controller.error(new Error(`Gemini API error ${parsed.error.code}: ${parsed.error.message}`));
              return;
            }
            const text: string = parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
            if (text) controller.enqueue(encoder.encode(text));
          } catch {
            // skip malformed SSE lines
          }
        }
      }

      controller.close();
    },
  });
}

export function parseReviewResponse(raw: string): ReviewResponse {
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean) as ReviewResponse;
}
