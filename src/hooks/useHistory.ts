'use client';

import { useState } from 'react';
import { HistoryEntry, ReviewResponse } from '@/types/review';

const STORAGE_KEY = 'cra_history';
const MAX_ENTRIES = 10;

function load(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(() => load());

  const push = (code: string, language: string, review: ReviewResponse) => {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      code,
      language,
      review,
      createdAt: Date.now(),
    };
    const next = [entry, ...load()].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setHistory(next);
  };

  return { history, push };
}
