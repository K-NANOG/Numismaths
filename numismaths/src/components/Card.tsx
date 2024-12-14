import React, { useEffect, useRef, useState } from 'react';

// Define types for the concept data
interface Concept {
  name: string;
  description: string;
  category: string;
  difficulty: string;
}

const CardStack: React.FC = () => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const cardRef = useRef<HTMLDivElement | null>(null); // Create ref for the card

  // Load cards dynamically from data.json
  const loadCards = async () => {
    try {
      const response = await fetch('data.json');
      const data: Concept[] = await response.json();
      setConcepts(data);
    } catch (error) {
      console.error('Error loading JSON data:', error);
    }
  };

  // Swipe logic handler
  const setupSwipe = (card: HTMLDivElement) => {
    let startX = 0;
    let currentX = 0;
    let shiftX = 0;
    let isDragging = false;

    // Mouse events for PC
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.clientX;
      card.style.transition = 'none';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      currentX = e.clientX;
      shiftX = currentX - startX;
      card.style.transform = `translateX(${shiftX}px) rotate(${shiftX / 20}deg)`;

      if (shiftX > 50) card.classList.add('like');
      else if (shiftX < -50) card.classList.add('dislike');
      else card.classList.remove('like', 'dislike');
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;

      if (shiftX > 100) swipeCard(card, 'right');
      else if (shiftX < -100) swipeCard(card, 'left');
      else {
        card.style.transition = 'transform 0.5s';
        card.style.transform = '';
        card.classList.remove('like', 'dislike');
      }
    };

    card.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    // Cleanup events when the card is removed
    return () => {
      card.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  };

  // Handle swipe actions
  const swipeCard = (card: HTMLDivElement, direction: 'left' | 'right') => {
    card.style.transform = `translateX(${direction === 'right' ? 1000 : -1000}px) rotate(${direction === 'right' ? 30 : -30}deg)`;
    card.style.opacity = '0';

    setTimeout(() => {
      card.remove();
      // Reload more cards if needed
      if (concepts.length === 0) {
        loadCards();
      }
    }, 500);
  };

  useEffect(() => {
    loadCards();
  }, []);

  return (
    <div id="card-container" style={{ position: 'relative' }}>
      {concepts.map((concept, index) => (
        <div
          key={index}
          className="card shadow-soft rounded"
          ref={(card) => {
            if (card) {
              // Initialize swipe logic for each card
              const cleanupSwipe = setupSwipe(card);
              return () => cleanupSwipe();
            }
          }}
          style={{ zIndex: concepts.length - index }}
        >
          <h2 className="text-primary">{concept.name}</h2>
          <p className="text-secondary">{concept.description}</p>
          <span className="badge badge-info">{concept.category}</span>
          <span className="badge badge-warning">{concept.difficulty}</span>
        </div>
      ))}
    </div>
  );
};

export default CardStack;
