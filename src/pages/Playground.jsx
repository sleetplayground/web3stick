import styles from '@/styles/playground.module.css';
import { Footer } from '@/components/footer';
import { Canvas } from '@/components/Canvas';
import { useState, useRef, useContext } from 'react';
import { NearContext } from '@/wallets/near';

export const Playground = () => {
  const { wallet, signedAccountId } = useContext(NearContext);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleLoadNFT = async () => {
    if (!signedAccountId) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check for owned NFTs
      const nfts = await wallet.viewMethod({
        contractId: 'lncernft.learnclub.near',
        method: 'nft_tokens_for_owner',
        args: {
          account_id: signedAccountId,
          from_index: '0',
          limit: 100
        }
      });

      if (!nfts || nfts.length === 0) {
        throw new Error('No LNCR NFTs found in your wallet');
      }

      // Use the first NFT found
      const firstNft = nfts[0];
      
      if (!firstNft.metadata || !firstNft.metadata.media) {
        throw new Error('NFT metadata not found');
      }

      // Fix the IPFS URL format
      const mediaUrl = firstNft.metadata.media.startsWith('http') 
        ? firstNft.metadata.media 
        : `https://ipfs.io/ipfs/${firstNft.metadata.media.replace('ipfs://', '')}`;

      try {
        await canvasRef.current.drawImage(mediaUrl);
      } catch (imageError) {
        throw new Error(`Failed to load NFT image: ${imageError.message}`);
      }
    } catch (err) {
      setError(err.message || 'Error loading NFT');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          await canvasRef.current.drawImage(e.target.result);
          setError('');
        } catch (err) {
          setError('Error loading image');
          console.error('Error:', err);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Error reading file');
      console.error('Error:', err);
    }
  };

  const { canvasElement, drawImage, saveCanvasAsPNG } = Canvas({ backgroundColor });
  canvasRef.current = { drawImage, saveCanvasAsPNG };

  return (
    <div className={styles.playgroundContainer}>
      <h1 className={styles.title}>Stick Playground</h1>
      <div className={styles.description}>
        <p>Draw and create your own stick figure to use as a profile pic,
            or create something unique to share on <a href="https://onsocial.id/" target="_blank" rel="noopener noreferrer">onsocial</a>.
            <br/>
            Be sure to tag @web3stick.near or use #web3stick when sharing!</p>
        <p>
          If you have a LNCer NFT, you can add color to it here.<br/>
          Connect your wallet to load automaticly!
        </p>
      </div>

      <div className={styles.canvasArea}>
      <div className={styles.inputSection}>
        <div className={styles.inputButtons}>
          <button 
            className={styles.actionButton}
            onClick={handleLoadNFT}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load LNCer NFT'}
          </button>
          <button 
            className={styles.actionButton}
            onClick={handleUpload}
            disabled={loading}
          >
            Upload
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      
        {canvasElement}
     
      <div className={styles.controls}>
        <div className={styles.colorPicker}>
          <span className={styles.colorPickerLabel}>PICK COLOR</span>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className={styles.colorInput}
          />
        </div>
        <button 
          className={styles.saveButton}
          onClick={() => canvasRef.current.saveCanvasAsPNG()}
        >
          Save Stick
        </button>
      </div>
      </div>


      <div className={styles.infoSection}>
        <details className={styles.infoDropdown}>
          <summary>Important Note about Learn Near Club</summary>
          <p>
            Web3stick does not have a partnership with or any affiliation with Learn Near Club.
            <br/>I just like their NFT collection. Do not use or download others NFT&apos;s.
            <br/>Only download your own NFT.
            <br/>If you do not have one you can mint one at <a href="https://learnnear.club/lncer/" target="_blank" rel="noopener noreferrer">LNCer NFT</a>.
           </p>
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