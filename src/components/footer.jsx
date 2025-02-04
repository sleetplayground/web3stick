import styles from '@/styles/footer.module.css';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      

      <div className={styles.navLinks}>
        <Link to="/">Home</Link>
        <Link to="/playground">Playground</Link>
        <Link to="/store">Store</Link>
        {/* <Link to="/explore">Explore</Link> */}
        <Link to="/social">Social</Link>
      </div>

      <img src="/white_stick.png" alt="Web3Stick Figure" style={{ width: '50px', height: 'auto', margin: '1rem 0' }} />

      <div className={styles.socialLink}>
      <a href="https://web3stick.near.social/" target="_blank" rel="noopener noreferrer">WEB3STICK.NEAR</a>
      </div>

      <div className="text-uppercase">
        COPYRIGHT 2025 BY <a href="https://sleet.near.social/" target="_blank" rel="noopener noreferrer">SLEET.NEAR</a>
        <br/>
        BUILD A COMMUNITY AROUND ANY NEAR ACCOUNT<br/>
        CONTACT ME TODAY FOR CUSTOM SOLUTIONS
      </div>
    </footer>
  );
};