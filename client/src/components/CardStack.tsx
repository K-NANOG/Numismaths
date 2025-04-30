import React, { useEffect, useState, useCallback } from "react";
import Spacer from "./Spacer";
import WikipediaSearch from "./WikipediaSearch";
import "../styles.css";

interface Concept {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  pageUrl?: string;
  fullArticle?: string;
  visuals?: Array<{
    type: string;
    url: string;
    description: string;
  }>;
}

type SwipeAction = {
  id: string;
  direction: "left" | "right";
  timestamp: number;
};

const CardStack: React.FC = () => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [savingLike, setSavingLike] = useState(false);

  const loadConcepts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:8080/api/concepts");
      if (!response.ok) throw new Error("Failed to fetch concepts");
      const data = await response.json();
      setConcepts(data);
    } catch (error) {
      console.error("Error loading concepts:", error);
      setError("Failed to load concepts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConcepts();
  }, [loadConcepts]);

  const handleNewCards = (newCards: Concept[]) => {
    // Add temporary IDs to new cards from Wikipedia
    const cardsWithTempIds = newCards.map((card, index) => ({
      ...card,
      id: `temp_${Date.now()}_${index}`
    }));
    setConcepts(prev => [...prev, ...cardsWithTempIds]);
  };

  const handleSwipe = useCallback(async (id: string, direction: "left" | "right") => {
    if (isAnimating || savingLike) return;
    setIsAnimating(true);

    const cardElement = document.querySelector<HTMLDivElement>(`.cards[data-id="${id}"]`);
    const currentConcept = concepts.find(c => c.id === id);
    
    if (!currentConcept || !cardElement) {
      setIsAnimating(false);
      return;
    }

    try {
      // Start animation
      cardElement.style.transition = "transform 0.5s ease-out, opacity 0.5s ease-out";
      cardElement.style.transform = direction === "left" 
        ? "translateX(-200%) rotate(-30deg)" 
        : "translateX(200%) rotate(30deg)";
      cardElement.style.opacity = "0";

      // Animate remaining cards up
      const remainingCards = document.querySelectorAll<HTMLDivElement>(`.cards:not([data-id="${id}"])`);
      remainingCards.forEach((card, index) => {
        card.style.transition = "all 0.4s ease-out";
        if (index === 0) {
          card.style.transform = "translateY(0) scale(1)";
          card.style.opacity = "1";
        } else if (index === 1) {
          card.style.transform = "translateY(-10px) scale(0.95)";
          card.style.opacity = "0.9";
        } else if (index === 2) {
          card.style.transform = "translateY(-20px) scale(0.9)";
          card.style.opacity = "0.8";
        } else if (index === 3) {
          card.style.transform = "translateY(-30px) scale(0.85)";
          card.style.opacity = "0.7";
        } else {
          card.style.transform = "translateY(-40px) scale(0.8)";
          card.style.opacity = "0.6";
        }
      });

      // If swiped right, save to liked concepts
      if (direction === "right") {
        setSavingLike(true);
        const response = await fetch("http://localhost:8080/api/save-liked", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            concept: id.startsWith('temp_') ? currentConcept : undefined
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to save liked concept: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.newId) {
          currentConcept.id = data.newId;
        }
      }

      // Wait for animation to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update state
      setConcepts(prev => prev.filter(concept => concept.id !== id));
    } catch (error) {
      console.error("Error during swipe:", error);
      // Reset card position on error
      cardElement.style.transition = "transform 0.3s ease-out, opacity 0.3s ease-out";
      cardElement.style.transform = "translateY(0) scale(1)";
      cardElement.style.opacity = "1";
      setError("Failed to process swipe action. Please try again.");
    } finally {
      setIsAnimating(false);
      setSavingLike(false);
    }
  }, [concepts, isAnimating, savingLike]);

  const setupSwipeHandlers = useCallback((cardsElement: HTMLDivElement, id: string) => {
    let startX = 0;
    let currentX = 0;
    let shiftX = 0;
    let isDragging = false;

    const onMouseDown = (e: MouseEvent) => {
      if (isAnimating || savingLike) return;
      isDragging = true;
      startX = e.clientX;
      cardsElement.style.transition = "none";
      setError(null);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || isAnimating || savingLike) return;
      currentX = e.clientX;
      shiftX = currentX - startX;
      const rotation = shiftX / 20;
      const scale = Math.max(0.95, 1 - Math.abs(shiftX) / 1000);
      
      cardsElement.style.transform = `translateX(${shiftX}px) rotate(${rotation}deg) scale(${scale})`;
      cardsElement.style.opacity = `${1 - Math.abs(shiftX) / 1000}`;

      if (shiftX > 50) cardsElement.classList.add("like");
      else if (shiftX < -50) cardsElement.classList.add("dislike");
      else cardsElement.classList.remove("like", "dislike");
    };

    const onMouseUp = () => {
      if (!isDragging || isAnimating || savingLike) return;
      isDragging = false;

      if (Math.abs(shiftX) > 100) {
        handleSwipe(id, shiftX > 0 ? "right" : "left");
      } else {
        cardsElement.style.transition = "transform 0.3s ease-out, opacity 0.3s ease-out";
        cardsElement.style.transform = "translateY(0) scale(1)";
        cardsElement.style.opacity = "1";
        cardsElement.classList.remove("like", "dislike");
      }
    };

    cardsElement.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      cardsElement.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [handleSwipe, isAnimating, savingLike]);

  useEffect(() => {
    const cardsElements = document.querySelectorAll<HTMLDivElement>(".cards");
    const cleanupFns: (() => void)[] = [];

    cardsElements.forEach((cards) => {
      const id = cards.getAttribute("data-id");
      if (id) {
        const cleanup = setupSwipeHandlers(cards, id);
        cleanupFns.push(cleanup);
      }
    });

    return () => {
      cleanupFns.forEach(cleanup => cleanup());
    };
  }, [concepts, setupSwipeHandlers]);

  // Add keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating || savingLike || concepts.length === 0) return;
      
      const topCard = concepts[0];
      if (!topCard) return;

      if (e.key === "ArrowLeft") {
        handleSwipe(topCard.id, "left");
      } else if (e.key === "ArrowRight") {
        handleSwipe(topCard.id, "right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [concepts, handleSwipe, isAnimating, savingLike]);

  if (loading) {
    return (
      <div className="cards-container">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading concepts...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cards-container">
        <div className="text-center">
          <p className="text-danger mb-3">{error}</p>
          <button className="btn btn-primary" onClick={() => loadConcepts()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="cards-container" 
      className="cards-container"
      tabIndex={0} // Make container focusable
      aria-label="Card stack. Use left arrow to skip, right arrow to save."
    >
      {concepts.length === 0 ? (
        <div className="text-center">
          <WikipediaSearch onNewCards={handleNewCards} />
        </div>
      ) : (
        <>
          {concepts.map((concept, index) => (
            <div
              key={concept.id}
              data-id={concept.id}
              className="cards"
              style={{ zIndex: concepts.length - index }}
            >
              <div className="cards-content">
                <h2>{concept.name}</h2>
                <p>{concept.description}</p>
              </div>
              <div className="cards-tags">
                <span className="badge badge-info">
                  {concept.category}
                </span>
                <Spacer size="sm" direction="vertical" />
                <span className={`badge badge-${concept.difficulty.toLowerCase()}`}>
                  {concept.difficulty}
                </span>
              </div>
            </div>
          ))}
          <WikipediaSearch onNewCards={handleNewCards} />
        </>
      )}
    </div>
  );
};

export default CardStack;
