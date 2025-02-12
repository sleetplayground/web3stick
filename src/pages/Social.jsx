import styles from '../styles/social.module.css';
import Footer from '../components/footer';

const Social = () => {
  const socialProfiles = [
    {
      name: 'stick',
      description: 'just a stick',
      url: 'https://web3stick.near.social/'
    },
    {
      name: 'nonresistant really',
      description: 'just trying to be real',
      url: 'https://nonresistant.near.social/'
    },
    {
      name: 'sleet',
      description: 'helping you build a community around your near account, contact for custom solutions and to see what i can do for you',
      url: 'https://sleet.near.social/'
    }
  ];

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>the best community<br/>happens on chain</h1>
        <p className={styles.subtitle}>join me on near social today</p>
      
        <div className={styles.profileGrid}>
          {socialProfiles.map((profile, index) => (
            <a 
              key={index} 
              href={profile.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.profileBox}
            >
              <h2>{profile.name}</h2>
              <p>{profile.description}</p>
              <p className={styles.profileUrl}>{profile.url}</p>
            </a>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Social;