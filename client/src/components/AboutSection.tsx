import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section className="text-center py-5">
      <h2 className="text-secondary">About Numismaths</h2>
      <p className="inset-shadow">
        Numismaths is designed to provide a comprehensive glossary of mathematical concepts and tools.
        It aims to bridge the gap between abstract thinking and practical accessibility, fostering curiosity 
        and a deeper understanding of mathematical logic and reasoning.
      </p>
      <p className="inset-shadow">
        By offering an innovative approach akin to a dating site for concepts and a flashcard-like interface, 
        Numismaths ensures concepts are classified, approachable, and interactive. Learn just enough to
        spark interest and solve problems intuitively.
      </p>
    </section>
  );
};

export default AboutSection;
