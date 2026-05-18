'use client';

import { useState } from 'react';
import styles from './CodeInput.module.scss';

const LANGUAGES = [
  'Auto-detect',
  'TypeScript',
  'JavaScript',
  'Python',
  'Go',
  'Rust',
  'Java',
  'C#',
  'CSS',
  'SQL',
];

interface Props {
  onReview: (code: string, language: string) => void;
  loading: boolean;
}

export default function CodeInput({ onReview, loading }: Props) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('Auto-detect');

  const handleSubmit = () => {
    if (!code.trim() || loading) return;
    onReview(code, language);
  };

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    if (text) setCode(text);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <span className={styles.label}>Code</span>
        <button className={styles.pasteBtn} onClick={handlePaste} aria-label="Paste from clipboard">
          Paste
        </button>
        <select
          className={styles.select}
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <textarea
        className={styles.textarea}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here..."
        spellCheck={false}
      />

      <div className={styles.footer}>
        <span className={styles.chars}>
          {code.length > 0 ? `${code.length} chars` : ''}
        </span>
        <button
          className={styles.button}
          onClick={handleSubmit}
          disabled={!code.trim() || loading}
        >
          {loading ? 'Reviewing...' : 'Review →'}
        </button>
      </div>
    </div>
  );
}
