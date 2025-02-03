import styles from '@/styles/playground.module.css';
import { Footer } from '@/components/footer';
import { Canvas } from '@/components/Canvas';
import { useState } from 'react';

export const Playground = () => {
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  return (
    <div className={styles.playgroundContainer}>
      <h1 className={styles.title}>Stick Playground</h1>
      <div className={styles.description}>
        <p>Draw and create your own stick figure to use as a profile pic,
            or create something unique to share on <a href="https://onsocial.id/" target="_blank" rel="noopener noreferrer">onsocial</a>.
            <br/>
            Be sure to tag @web3stick.near or use #web3stick when sharing!</p>
        <p>If you have a LNCR NFT, you can add color to it here.</p>
      </div>
      <div className={styles.inputSection}>
        <input
          type="text"
          className={styles.textInput}
          placeholder="Enter stick data..."
        />
        <div className={styles.inputButtons}>
          <button className={styles.actionButton}>Load</button>
          <button className={styles.actionButton}>Upload</button>
        </div>
      </div>
      <div className={styles.canvasArea}>
        <Canvas backgroundColor={backgroundColor} />
      </div>
      <div className={styles.controls}>
        <div className={styles.colorPicker}>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className={styles.colorInput}
          />
        </div>
        <button className={styles.saveButton}>Save Stick</button>
      </div>
      <div className={styles.infoSection}>
        <details className={styles.infoDropdown}>
          <summary>Important Note about Learn Near Club</summary>
          <p>
            Web3stick does not have a partnership with or any affiliation with Learn Near Club.
            <br/>I just like their NFT collection. Do not use or download others NFT&apos;s.
            <br/>Only download your own NFT.
            <br/>If you do not have one you can mint one at <a href="https://learnnear.club/lncer/" target="_blank" rel="noopener noreferrer">LNCR NFT</a>.
            <br/>Forgot your NFT number? Check your wallet or <a href="https://www.mintbase.xyz/contract/lncernft.learnclub.near" target="_blank" rel="noopener noreferrer">Mintbase</a>.</p>
        </details>
        <details className={styles.infoDropdown}>
          <summary>About LNCer NFT Collection</summary>
          <p>LNCer NFT collection is a collab between LNC community and one of the best award winning graphic designers in Europe. Art concept is based on dynamic human intelligence diversity powered by uniqueness of every learner.</p>
          <p>Every NFT minter is invited to creatively participate in this project:</p>
          <ul className={styles.infoList}>
            <li>Generate and pick posture of the graphic character crafted by design genius</li>
            <li>Give name to your creature</li>
            <li>Curate your personal unique collection</li>
          </ul>
        </details>
      </div>
      <Footer />
    </div>
  );
};