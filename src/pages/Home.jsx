import React from 'react';
import styles from '@/styles/main-content.module.css';
import { Footer } from '@/components/footer';

export const Home = () => {
  const [activeSection, setActiveSection] = React.useState(1);

  React.useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionIndex = Array.from(document.querySelectorAll(`.${styles.section}`)).indexOf(entry.target);
          setActiveSection(sectionIndex + 1);
        }
      });
    }, options);

    const sections = document.querySelectorAll(`.${styles.section}`);
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const scrollToSection = (sectionNumber) => {
    const sections = document.querySelectorAll(`.${styles.section}`);
    if (sections[sectionNumber - 1]) {
      sections[sectionNumber - 1].scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.snapContainer}>
        <section className={`${styles.section} ${styles.section1}`}>
          <h1 className={styles.title}>WEB3STICK</h1>
          <p className={styles.subtitle}>
          You are a unique stick.<br/>
          I am a unique stick.<br/>
          We are all unique sticks.
          </p>
        </section>

        <section className={`${styles.section} ${styles.section2}`}>
          <div className={styles.infoBox}>
            <div className={styles.infoBoxContent}>
              <h3 className={styles.infoTitle}>What is Web3Stick?</h3>
              <p>Web3stick is a social experiment and growing community by nonresistant.near</p>
            </div>
          </div>

          <div className={styles.infoBox}>
            <div className={styles.infoBoxContent}>
              <h3 className={styles.infoTitle}>What does Web3Stick mean?</h3>
              <p>The web3 part doesn&apos;t really mean anything, just that we are on near protocol. The stick part is about who all ultimately are. We are all just sticks, or stick figures, and we are all on the round ball called earth, and we are all trying to figure out life.</p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.section3}`}>
          <h2 className={styles.sectionTitle}>CREATE & COLLECT</h2>
          <p className={styles.sectionText}>
            Create art and add color to stick figures in my playground,<br/>
            buy a .web3stick.near account in my store!
          </p>
          <div className={styles.buttonContainer}>
            <button className={styles.homeButton} onClick={() => window.location.href = '/playground'}>STICK PLAYGROUND</button>
            <button className={styles.homeButton} onClick={() => window.location.href = '/store'}>.WEB3STICK.NEAR STORE</button>
          </div>
        </section>

        <section className={`${styles.section} ${styles.section1}`}>
          <Footer />
        </section>

        <div className={styles.sectionIndicator}>
          {[1, 2, 3, 4].map((section) => (
            <div
              key={section}
              className={styles.dot}
              data-active={activeSection === section}
              onClick={() => scrollToSection(section)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};