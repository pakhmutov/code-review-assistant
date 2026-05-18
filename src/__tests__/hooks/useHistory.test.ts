import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHistory } from '@/hooks/useHistory';
import { ReviewResponse } from '@/types/review';

const MOCK_REVIEW: ReviewResponse = {
  categories: [
    { type: 'bugs', label: 'Bugs', emoji: '🐛', items: [] },
    { type: 'improvements', label: 'Improvements', emoji: '⚡', items: [] },
    { type: 'security', label: 'Security', emoji: '🔒', items: [] },
    { type: 'style', label: 'Code Style', emoji: '🎨', items: [] },
  ],
};

describe('useHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with empty history', () => {
    const { result } = renderHook(() => useHistory());
    expect(result.current.history).toEqual([]);
  });

  it('push() adds an entry with correct fields', () => {
    const { result } = renderHook(() => useHistory());
    act(() => {
      result.current.push('const x = 1;', 'TypeScript', MOCK_REVIEW);
    });
    const entry = result.current.history[0];
    expect(entry.code).toBe('const x = 1;');
    expect(entry.language).toBe('TypeScript');
    expect(entry.review).toEqual(MOCK_REVIEW);
    expect(entry.id).toBeTruthy();
  });

  it('push() prepends — newest entry is first', () => {
    const { result } = renderHook(() => useHistory());
    act(() => { result.current.push('first', 'TypeScript', MOCK_REVIEW); });
    act(() => { result.current.push('second', 'Python', MOCK_REVIEW); });
    expect(result.current.history[0].code).toBe('second');
    expect(result.current.history[1].code).toBe('first');
  });

  it('limits history to 10 entries', () => {
    const { result } = renderHook(() => useHistory());
    for (let i = 0; i < 12; i++) {
      act(() => { result.current.push(`code ${i}`, 'TypeScript', MOCK_REVIEW); });
    }
    expect(result.current.history).toHaveLength(10);
  });

  it('persists to localStorage on push', () => {
    const { result } = renderHook(() => useHistory());
    act(() => { result.current.push('let y = 2;', 'JavaScript', MOCK_REVIEW); });
    const stored = JSON.parse(localStorage.getItem('cra_history') ?? '[]');
    expect(stored[0].code).toBe('let y = 2;');
  });

  it('loads existing history from localStorage on mount', () => {
    const existing = [{ id: '1', code: 'old code', language: 'Go', review: MOCK_REVIEW, createdAt: 1 }];
    localStorage.setItem('cra_history', JSON.stringify(existing));
    const { result } = renderHook(() => useHistory());
    expect(result.current.history[0].code).toBe('old code');
  });

  it('returns empty array when localStorage contains invalid JSON', () => {
    localStorage.setItem('cra_history', 'not valid json {{');
    const { result } = renderHook(() => useHistory());
    expect(result.current.history).toEqual([]);
  });
});
