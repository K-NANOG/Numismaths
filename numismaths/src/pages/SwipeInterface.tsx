import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import conceptsData from '../data/concepts.json'; // Import JSON directly

interface Concept {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: string;
}

const SwipeInterface: React.FC = () => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Load concepts into state
    setConcepts(conceptsData as Concept[]);
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      alert(`Learn more about ${concepts[currentIndex].name}`);
    }

    // Move to the next card
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div className="swipe-interface">
      <Header title="Numismaths" subtitle="Swipe to Explore Concepts" />
      <div className="card-container">
        {concepts.length > currentIndex ? (
          <Card concept={concepts[currentIndex]} onSwipe={handleSwipe} />
        ) : (
          <p>No more concepts to explore!</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SwipeInterface;
