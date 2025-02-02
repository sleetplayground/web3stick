import styles from '@/styles/main-content.module.css';
import { Footer } from '@/components/footer';

export const Home = () => {
  return (
    <div className={styles.pageContainer}>
      <section className={styles.mainSection}>
        <div className={styles.snapContainer}>
          <section className={`${styles.section} ${styles.section1}`}>
            <h1 className={styles.title}>WEB3STICK</h1>
            <p className={styles.subtitle}>
              I am a stick figure,<br/>
              you are a stick figure,<br/>
              we are all stick figures.
            </p>
          </section>

          <section className={`${styles.section} ${styles.section2}`}>
            <h2 className={styles.sectionTitle}>NFT COLOR PLAYGROUND</h2>
            <p className={styles.sectionText}>
              Express yourself through colors and create unique digital art pieces
              that live on the blockchain forever.
            </p>
            <button className={styles.homeButton}>EXPLORE PLAYGROUND</button>
          </section>

          <section className={`${styles.section} ${styles.section3}`}>
            <h2 className={styles.sectionTitle}>.WEB3STICK STORE</h2>
            <p className={styles.sectionText}>
              Discover and collect unique stick figure NFTs created by our community.
            </p>
            <button className={styles.homeButton}>VISIT STORE</button>
          </section>

          <div className={styles.sectionIndicator}>
            <div className={styles.dot} data-section="1"></div>
            <div className={styles.dot} data-section="2"></div>
            <div className={styles.dot} data-section="3"></div>
          </div>
        </div>
      </section>
      <section className={styles.footerSection}>
        <Footer />
      </section>
    </div>
  );
};