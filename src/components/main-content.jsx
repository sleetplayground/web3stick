import styles from '@/styles/main-content.module.css';

export const MainContent = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>WEB3STICK</h1>
      <p className={styles.subtitle}>
        I am a stick figure,
        you are a stick figure,
        we are all stick figures.
      </p>
      <div className={styles.buttonContainer}>
        <button className={styles.homeButton}>NFT COLOR PLAYGROUND</button>
        <button className={styles.homeButton}>.WEB3STICK STORE</button>
      </div>
    </div>
  );
};