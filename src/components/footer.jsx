import styles from '@/styles/footer.module.css';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.socialLink}>
        <a href="https://web3stick.near.social/" target="_blank" rel="noopener noreferrer">
          WEB3STICK.NEAR
        </a>
      </div>

      <div className={styles.navLinks}>
        <Link to="/">Home</Link>
        <Link to="/playground">Playground</Link>
        <Link to="/store">Store</Link>
      </div>

      <div className="text-uppercase">
        COPYRIGHT 2025 BY<br/>
        <a href="https://sleet.near.social/" target="_blank" rel="noopener noreferrer">
          SLEET.NEAR
        </a>
      </div>
    </footer>
  );
};