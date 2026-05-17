'use client';

import { useState } from 'react';
import Header from '@/components/Header/Header';
import CodeInput from '@/components/CodeInput/CodeInput';
import ReviewResult from '@/components/ReviewResult/ReviewResult';
import { ReviewResponse } from '@/types/review';
import styles from './page.module.scss';

export default function Home() {
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setReview(data as ReviewResponse);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <CodeInput onReview={handleReview} loading={loading} />
        <ReviewResult review={review} loading={loading} error={error} />
      </main>
    </div>
  );
}
