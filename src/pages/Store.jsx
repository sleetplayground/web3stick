import { useState } from 'react';
import styles from '@/styles/store.module.css';
import { Footer } from '@/components/footer';
import KeyGenerator from '@/components/KeyGenerator';
import AccountPurchaseForm from '../components/AccountPurchaseForm';

export const Store = () => {
  const [activeSection, setActiveSection] = useState('');

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? '' : section);
  };

  return (
    <div className={styles.storeContainer}>
      <h1 className={styles.title}>.WEB3STICK.NEAR STORE</h1>
      <div className={styles.description}>
        <p>
          Purchase a .web3stick account and become part of my growing community.
          <br/>Use your .web3stick.near account as your wallet address and near social handle.
        </p>
      </div>

      <div className={styles.contentSection}>
      <AccountPurchaseForm />
        <KeyGenerator />
      </div>

      <div className={styles.dropdownSection}>
        <div 
          className={`${styles.dropdownHeader} ${activeSection === 'purchase' ? styles.active : ''}`}
          onClick={() => toggleSection('purchase')}
        >
          <h3>How to Purchase</h3>
        </div>
        {activeSection === 'purchase' && (
          <div className={styles.dropdownContent}>
            <ul>
              <li>Securely connect your near wallet (like Meteor wallet, or Bitte)</li>
              <li>Enter the desired account username</li>
              <li>Paste the public key, use tool to create one, read key guide</li>
              <li>Click buy, each .web3stick.near account costs 0.1 near</li>
              <li>You can play on testnet before making a mainnet purchase if you want</li>
            </ul>
          </div>
        )}
      </div>

      <div className={styles.dropdownSection}>
        <div 
          className={`${styles.dropdownHeader} ${activeSection === 'key' ? styles.active : ''}`}
          onClick={() => toggleSection('key')}
        >
          <h3>Private Key Generation and Info</h3>
        </div>
        {activeSection === 'key' && (
          <div className={styles.dropdownContent}>
            <ul>
              <li>Generate a new private key and public key</li>
              <li>Make sure you save private key safe somewhere</li>
              <li>If you lose access to your private key you will lose access to your .web3stick account</li>
              <li>You can use the private key to import your account into your wallet app</li>
              <li>Do not use the same key if buying multiple .web3stick.near account</li>
            </ul>
          </div>
        )}
      </div>

      <div className={styles.dropdownSection}>
        <div 
          className={`${styles.dropdownHeader} ${activeSection === 'benefits' ? styles.active : ''}`}
          onClick={() => toggleSection('benefits')}
        >
          <h3>Why Buy a .web3stick Account?</h3>
        </div>
        {activeSection === 'benefits' && (
          <div className={styles.dropdownContent}>
            <ul>
              <li>Use as your near onsocial handle</li>
              <li>Grants you access to the web3stick community, a growing community of sticks</li>
              <li>Near accounts are also assets that can be used for various purposes, they can also be minted and resold</li>
            </ul>
          </div>
        )}
      </div>

      <div className={styles.dropdownSection}>
        <div 
          className={`${styles.dropdownHeader} ${activeSection === 'failure' ? styles.active : ''}`}
          onClick={() => toggleSection('failure')}
        >
          <h3>What to Do in Case of Purchase Failure</h3>
        </div>
        {activeSection === 'failure' && (
          <div className={styles.dropdownContent}>
            <ul>
              <li>Check near blocks for transaction history</li>
              <li>Contact web3stick on near social</li>
              <li>Please note we cannot help if you lose your private key or enter information incorrectly</li>
              <li>If the deposit was successful but account creation failed, we can create an account for you, or try again if the deposite shows up correctly.</li>
              <li>All transaction history is on the blockchain - the block explorer will show if transactions were successful</li>
              <li>Check web3stick.testnet or web3stick.near or your wallet address on the explorer</li>
              <li>Visit <a href="https://nearblocks.io" target="_blank" rel="noopener noreferrer">Near Blocks Mainnet</a> or <a href="https://testnet.nearblocks.io" target="_blank" rel="noopener noreferrer">Near Blocks Testnet</a></li>
              <li>Only deposit once if you want to purchase one .web3stick.near account. refunds are not available.</li>
            </ul>
          </div>
        )}
      </div>

      <div className={styles.dropdownSection}>
        <div 
          className={`${styles.dropdownHeader} ${activeSection === 'notes' ? styles.active : ''}`}
          onClick={() => toggleSection('notes')}
        >
          <h3>Other Important Notes</h3>
        </div>
        {activeSection === 'notes' && (
          <div className={styles.dropdownContent}>
            <ul>
              <li>Because anyone can do anything with their .web3stick account, make sure you get updated and accurate information from our official profile</li>
              <li>Beware of people launching tokens with their .web3stick accounts. If we launch a .web3stick token, we will announce it on our social media, but currently have no plans to do so</li>
              <li>Launching meme tokens can be fun - maybe a community meme token launchpad in the future</li>
            </ul>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};