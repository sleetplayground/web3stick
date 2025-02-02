import { useState, useEffect } from 'react';

export const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState(1);

  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]');
    
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6, // Section needs to be 60% visible to be considered active
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionNumber = parseInt(entry.target.getAttribute('data-section'));
          setActiveSection(sectionNumber);
        }
      });
    }, options);

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return activeSection;
};