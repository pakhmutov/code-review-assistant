'use client';

import { HistoryEntry } from '@/types/review';
import styles from './HistoryBar.module.scss';

interface Props {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function HistoryBar({ history, onSelect }: Props) {
  if (history.length === 0) return null;

  return (
    <div className={styles.bar}>
      <span className={styles.label}>History</span>
      <div className={styles.list}>
        {history.map((entry) => (
          <button
            key={entry.id}
            className={styles.entry}
            onClick={() => onSelect(entry)}
            title={entry.code.slice(0, 120)}
          >
            <span className={styles.lang}>{entry.language}</span>
            <span className={styles.time}>{formatTime(entry.createdAt)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
