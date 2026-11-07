import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      © {new Date().getFullYear()} SMART Goal Crafter
      <div>Turn a rough idea into one well-formed SMART goal • specific, measurable, achievable, relevant, and time-bound.</div>
      <div className={styles.links}>
        {/* A plain <a>, not react-router's Link, /faq/ is a standalone static page (see
            public/faq/index.html), not a client-side route, so this needs a real navigation. */}
        <a className={styles.link} href="/faq/">
          What is a SMART goal? (FAQ)
        </a>
        <span className={styles.divider} aria-hidden="true">
          ·
        </span>
        <a className={styles.link} href="https://buymeacoffee.com/kmorr182" target="_blank" rel="noopener noreferrer">
          Buy me a coffee ☕
        </a>
      </div>
    </footer>
  )
}
