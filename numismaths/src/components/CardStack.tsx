import React, { useEffect, useState } from 'react';
import '../index.css';

type Concept = {
  name: string;
  description: string;
  category: string;
  difficulty: string;
  image?: string;
};

const CardStack: React.FC = () => {
  const [concepts, setConcepts] = useState<Concept[]>([]);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const response = await fetch('/concepts.json');
        if (!response.ok) throw new Error('Failed to fetch concepts.json');
        const data = await response.json();
        setConcepts(data);
      } catch (error) {
        console.error('Error loading JSON data:', error);
      }
    };

    loadCards();
  }, []);

  const handleSwipe = (index: number, direction: 'left' | 'right') => {
    const cardToSwipe = document.querySelectorAll<HTMLDivElement>('.card')[index];

    // Add swipe animation class
    if (cardToSwipe) {
      cardToSwipe.style.transition = 'transform 0.5s, opacity 0.5s';
      cardToSwipe.style.transform = direction === 'left' ? 'translateX(-200%)' : 'translateX(200%)';
      cardToSwipe.style.opacity = '0';
    }

    // Delay state update to allow animation to complete
    setTimeout(() => {
      const updatedConcepts = concepts.filter((_, i) => i !== index);
      setConcepts(updatedConcepts);

      if (updatedConcepts.length === 0) {
        console.log('All cards swiped');
      }
    }, 500); // Match this delay with the CSS transition duration
  };

  const setupSwipeHandlers = (cardElement: HTMLDivElement, index: number) => {
    let startX = 0;
    let currentX = 0;
    let shiftX = 0;
    let isDragging = false;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.clientX;
      cardElement.style.transition = 'none';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      currentX = e.clientX;
      shiftX = currentX - startX;
      cardElement.style.transform = `translateX(${shiftX}px) rotate(${shiftX / 20}deg)`;

      if (shiftX > 50) cardElement.classList.add('like');
      else if (shiftX < -50) cardElement.classList.add('dislike');
      else cardElement.classList.remove('like', 'dislike');
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;

      if (shiftX > 100) {
        handleSwipe(index, 'right');
      } else if (shiftX < -100) {
        handleSwipe(index, 'left');
      } else {
        cardElement.style.transition = 'transform 0.5s';
        cardElement.style.transform = '';
        cardElement.classList.remove('like', 'dislike');
      }
    };

    cardElement.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      cardElement.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  };

  useEffect(() => {
    const cardElements = document.querySelectorAll<HTMLDivElement>('.card');
    cardElements.forEach((card, index) => {
      setupSwipeHandlers(card, index);
    });
  }, [concepts]);

  return (
    <div id="card-container" className="card-container">
      {concepts.length === 0 ? (
        <p>Loading cards...</p>
      ) : (
        concepts.map((concept, index) => (
          <div
            key={index}
            className="card"
            style={{ zIndex: concepts.length - index }}
          >
            {concept.image && <img src={concept.image} alt={concept.name} />}
            <h2>{concept.name}</h2>
            <p>{concept.description}</p>
            <span className="badge badge-info">{concept.category}</span>
            <span className="badge badge-warning">{concept.difficulty}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default CardStack;
