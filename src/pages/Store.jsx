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
      <Footer />
    </div>
  );
};