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
  error: string | null;
}

function Skeleton() {
  return (
    <div className={styles.skeleton}>
      {[80, 60, 90, 50].map((w, i) => (
        <div key={i} className={styles.skeletonLine} style={{ width: `${w}%` }} />
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

export default function ReviewResult({ review, loading, error }: Props) {
  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <span className={styles.label}>Review</span>
        {review && (
          <button
            className={styles.copy}
            onClick={() => {
              const text = review.categories
                .map(c => {
                  const meta = CATEGORY_META[c.type];
                  return `${meta.emoji} ${meta.label}\n${c.items.map(i => `• ${i.description}`).join('\n')}`;
                })
                .join('\n\n');
              navigator.clipboard.writeText(text);
            }}
          >
            Copy
          </button>
        )}
      </div>

      <div className={styles.content}>
        {loading && <Skeleton />}
        {!loading && error && (
          <div className={styles.empty}>
            <p style={{ color: '#f87171' }}>{error}</p>
          </div>
        )}
        {!loading && !error && !review && (
          <div className={styles.empty}>
            <p>Paste your code and click Review →</p>
          </div>
        )}
        {!loading && review && review.categories.map((cat) => (
          <Category key={cat.type} category={cat} />
        ))}
      </div>
    </div>
  );
}
