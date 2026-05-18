'use client';

import { useState } from 'react';
import Header from '@/components/Header/Header';
import CodeInput from '@/components/CodeInput/CodeInput';
import ReviewResult from '@/components/ReviewResult/ReviewResult';
import HistoryBar from '@/components/HistoryBar/HistoryBar';
import { useHistory } from '@/hooks/useHistory';
import { HistoryEntry, ReviewResponse } from '@/types/review';
import styles from './page.module.scss';

export default function Home() {
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restoredCode, setRestoredCode] = useState<string | undefined>();
  const [restoredLanguage, setRestoredLanguage] = useState<string | undefined>();

  const { history, push } = useHistory();

  const handleReview = async (code: string, language: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Unknown error');
      const result = data as ReviewResponse;
      setReview(result);
      push(code, language, result);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setRestoredCode(entry.code);
    setRestoredLanguage(entry.language);
    setReview(entry.review);
    setError(null);
  };

  return (
    <div className={styles.page}>
      <Header />
      <HistoryBar history={history} onSelect={handleHistorySelect} />
      <main className={styles.main}>
        <CodeInput
          onReview={handleReview}
          loading={loading}
          value={restoredCode}
          language={restoredLanguage}
        />
        <ReviewResult review={review} loading={loading} error={error} />
      </main>
    </div>
  );
}
