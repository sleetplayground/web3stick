import styles from '@/styles/playground.module.css';

export const Playground = () => {
  return (
    <div className={styles.playgroundContainer}>
      <h1 className={styles.title}>Stick Playground</h1>
      <div className={styles.canvasArea}>
        {/* Canvas implementation will be added later */}
        <p className={styles.comingSoon}>Canvas implementation coming soon...</p>
      </div>
      <div className={styles.controls}>
        <div className={styles.colorPicker}>
          {/* Color picker implementation will be added later */}
        </div>
        <button className={styles.saveButton}>Save Stick</button>
      </div>
    </div>
  );
};