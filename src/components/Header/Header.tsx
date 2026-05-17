import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.icon}>◈</span>
        <span className={styles.title}>Code Review Assistant</span>
      </div>
      <a
        href="https://github.com/pakhmutov/code-review-assistant"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.github}
      >
        GitHub ↗
      </a>
    </header>
  );
}
