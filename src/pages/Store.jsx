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
          Purchase a .web3stick.near sub account and become part of my growing community.
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
          <h3>Why Buy a .web3stick.near Sub-Account?</h3>
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
              <li>If the deposit was successful but account creation failed, try again if your Deposit amount shows up correctly</li>
              <li>All transaction history is on the blockchain, the block explorer will have info on if transaction was successful or not</li>
              <li>Check for web3stick.testnet or web3stick.near or your wallet address on <a href="https://nearblocks.io" target="_blank" rel="noopener noreferrer">Near Blocks mainnet</a> or <a href="https://testnet.nearblocks.io" target="_blank" rel="noopener noreferrer">Near Blocks testnet</a></li>
              <li>Only deposit once if you want to purchase one .web3stick.near account. Refunds are not available</li>
            </ul>
          </div>
        )}
      </div>

      <div className={styles.dropdownSection}>
        <div 
          className={`${styles.dropdownHeader} ${activeSection === 'community' ? styles.active : ''}`}
          onClick={() => toggleSection('community')}
        >
          <h3>Important Community Notes</h3>
        </div>
        {activeSection === 'community' && (
          <div className={styles.dropdownContent}>
            <ul>
              <li>Because anyone can do anything with their .web3stick account make sure you get updated and accurate information from our official profile</li>
              <li>Beware of people launching tokens with their .web3stick accounts. If we launch a .web3stick token, we will announce on our social media (currently no plans)</li>
              <li>This is an experiment by sleet.near and nonresistant.near. See contract code at our <a href='https://github.com/sleetplayground/sleet_subaccount_store_contract'>GitHub repository</a></li>
            </ul>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Store;