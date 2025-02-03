import styles from '@/styles/footer.module.css';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      

      <div className={styles.navLinks}>
        <Link to="/">HOME</Link>
        <Link to="/playground">PLAYGROUND</Link>
        <Link to="/store">STORE</Link>
        {/* <Link to="/explore">EXPLORE</Link> */}
      </div>

      <div className={styles.socialLink}>
      WEB3STICK.NEAR<br/>
      〇 <a href="https://web3stick.near.social/" target="_blank" rel="noopener noreferrer">ONSOCIAL</a>

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