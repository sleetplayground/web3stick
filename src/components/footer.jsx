import styles from '@/styles/footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      
      <div className={styles.socialLink}>
        <a href="https://web3stick.near.social/" target="_blank" rel="noopener noreferrer">
        WEB3STICK.NEAR
        </a>
      </div>

      <div className="text-uppercase">
        COPYRIGHT 2025 BY SLEET.NEAR
      </div>

    </footer>
  );
};