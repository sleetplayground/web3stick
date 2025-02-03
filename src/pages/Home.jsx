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