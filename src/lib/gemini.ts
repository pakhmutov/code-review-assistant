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

export async function reviewCode(code: string, language: string): Promise<ReviewResponse> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT(code, language) }] }],
        generationConfig: { temperature: 0.2 },
      }),
    }
  );

  const data = await res.json();

  if (data.error) {
    throw new Error(`Gemini API error ${data.error.code}: ${data.error.message}`);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean) as ReviewResponse;
}
