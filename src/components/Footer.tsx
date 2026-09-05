import styles from './Footer.module.css'

export function Footer() {
  return <footer className={styles.footer}>© {new Date().getFullYear()} Smart Goal Crafter
  <div>Turn a rough idea into one well-formed SMART goal • specific, measurable, achievable, relevant, and time-bound.</div>
  </footer>
}
