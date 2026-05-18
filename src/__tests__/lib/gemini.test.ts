import { describe, it, expect } from 'vitest';
import { parseReviewResponse } from '@/lib/gemini';

const VALID = {
  categories: [
    { type: 'bugs', label: 'Bugs', emoji: '🐛', items: [{ line: 5, description: 'Null dereference' }] },
    { type: 'improvements', label: 'Improvements', emoji: '⚡', items: [] },
    { type: 'security', label: 'Security', emoji: '🔒', items: [] },
    { type: 'style', label: 'Code Style', emoji: '🎨', items: [] },
  ],
};

describe('parseReviewResponse', () => {
  it('parses valid JSON', () => {
    const result = parseReviewResponse(JSON.stringify(VALID));
    expect(result.categories).toHaveLength(4);
    expect(result.categories[0].type).toBe('bugs');
  });

  it('strips markdown code fences before parsing', () => {
    const wrapped = `\`\`\`json\n${JSON.stringify(VALID)}\n\`\`\``;
    const result = parseReviewResponse(wrapped);
    expect(result.categories[0].items[0].description).toBe('Null dereference');
  });

  it('strips plain code fences before parsing', () => {
    const wrapped = `\`\`\`\n${JSON.stringify(VALID)}\n\`\`\``;
    const result = parseReviewResponse(wrapped);
    expect(result.categories).toHaveLength(4);
  });

  it('preserves line numbers on items', () => {
    const result = parseReviewResponse(JSON.stringify(VALID));
    expect(result.categories[0].items[0].line).toBe(5);
  });

  it('throws on invalid JSON', () => {
    expect(() => parseReviewResponse('not json')).toThrow();
  });
});
