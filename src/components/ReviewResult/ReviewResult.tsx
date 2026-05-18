import { useState, useEffect } from 'react';
import { ReviewResponse, ReviewCategory } from '@/types/review';
import styles from './ReviewResult.module.scss';

const CATEGORY_META: Record<string, { emoji: string; label: string }> = {
  bugs:         { emoji: '🐛', label: 'Bugs' },
  improvements: { emoji: '⚡', label: 'Improvements' },
  security:     { emoji: '🔒', label: 'Security' },
  style:        { emoji: '🎨', label: 'Code Style' },
};

interface Props {
  review: ReviewResponse | null;
  loading: boolean;
  streamingText: string | null;
  error: string | null;
}

const CATEGORIES = [
  { type: 'bugs',         emoji: '🐛', label: 'Bugs' },
  { type: 'improvements', emoji: '⚡', label: 'Improvements' },
  { type: 'security',     emoji: '🔒', label: 'Security' },
  { type: 'style',        emoji: '🎨', label: 'Code Style' },
];

function Skeleton() {
  return (
    <div className={styles.skeleton}>
      {[80, 60, 90, 50].map((w, i) => (
        <div key={i} className={styles.skeletonLine} style={{ width: `${w}%` }} />
      ))}
    </div>
  );
}

function AnalyzingStatus() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive(i => (i + 1) % CATEGORIES.length), 700);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.analyzing}>
      {CATEGORIES.map((cat, i) => (
        <div key={cat.type} className={`${styles.analyzingRow} ${i === active ? styles.analyzingActive : ''}`}>
          <span className={styles.analyzingEmoji}>{cat.emoji}</span>
          <span className={styles.analyzingLabel}>{cat.label}</span>
          {i === active && <span className={styles.analyzingDot} />}
        </div>
      ))}
    </div>
  );
}

function Category({ category }: { category: ReviewCategory }) {
  const meta = CATEGORY_META[category.type];
  return (
    <div className={styles.category}>
      <div className={styles.categoryHeader}>
        <span>{meta.emoji} {meta.label}</span>
        <span className={styles.count}>{category.items.length}</span>
      </div>
      {category.items.length > 0 ? (
        <ul className={styles.items}>
          {category.items.map((item, i) => (
            <li key={i} className={styles.item}>
              {item.line && <span className={styles.line}>L{item.line}</span>}
              {item.description}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>No issues found</p>
      )}
    </div>
  );
}

export default function ReviewResult({ review, loading, streamingText, error }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!review) return;
    const text = review.categories
      .map(c => {
        const meta = CATEGORY_META[c.type];
        return `${meta.emoji} ${meta.label}\n${c.items.map(i => `• ${i.description}`).join('\n')}`;
      })
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <span className={styles.label}>Review</span>
        {review && (
          <button
            className={styles.copy}
            onClick={handleCopy}
            aria-label="Copy review to clipboard"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>

      <div className={styles.content}>
        {loading && !streamingText && <Skeleton />}
        {loading && streamingText !== null && <AnalyzingStatus />}
        {!loading && streamingText !== null && <AnalyzingStatus />}
        {!loading && streamingText === null && error && (
          <div className={styles.empty} role="alert">
            <p style={{ color: '#f87171' }}>{error}</p>
          </div>
        )}
        {!loading && streamingText === null && !error && !review && (
          <div className={styles.empty}>
            <p>Paste your code and click Review →</p>
          </div>
        )}
        {!loading && streamingText === null && review && review.categories.map((cat) => (
          <Category key={cat.type} category={cat} />
        ))}
      </div>
    </div>
  );
}
