import React, { useEffect, useState, useCallback } from "react";
import Spacer from "./Spacer";
import "../styles.css";

interface Concept {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
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
      cardElement.style.transition = "transform 0.5s, opacity 0.5s";
      cardElement.style.transform = direction === "left" ? "translateX(-200%)" : "translateX(200%)";
      cardElement.style.opacity = "0";

      // If swiped right, save to liked concepts
      if (direction === "right") {
        setSavingLike(true);
        const response = await fetch("http://localhost:8080/api/save-liked", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          throw new Error(`Failed to save liked concept: ${response.statusText}`);
        }
      }

      // Wait for animation to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update state
      setConcepts(prev => prev.filter(concept => concept.id !== id));
    } catch (error) {
      console.error("Error during swipe:", error);
      // Reset card position on error
      cardElement.style.transition = "transform 0.3s, opacity 0.3s";
      cardElement.style.transform = "";
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
      setError(null); // Clear any previous errors on new interaction
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || isAnimating || savingLike) return;
      currentX = e.clientX;
      shiftX = currentX - startX;
      cardsElement.style.transform = `translateX(${shiftX}px) rotate(${shiftX / 20}deg)`;

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
        cardsElement.style.transition = "transform 0.3s";
        cardsElement.style.transform = "";
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
    <div id="cards-container" className="cards-container">
      {concepts.length === 0 ? (
        <div className="text-center">
          <p>No more concepts to explore!</p>
          <button className="btn btn-primary mt-3" onClick={() => loadConcepts()}>
            Start Over
          </button>
        </div>
      ) : (
        concepts.map((concept, index) => (
          <div
            key={concept.id}
            data-id={concept.id}
            className="cards"
            style={{ zIndex: concepts.length - index }}
          >
            <h2>{concept.name}</h2>
            <p>{concept.description}</p>
            <Spacer size="sm" direction="vertical" />
            <span className="badge badge-info">{concept.category}</span>
            <Spacer size="sm" direction="vertical" />
            <span className={`badge badge-${concept.difficulty.toLowerCase()}`}>
              {concept.difficulty}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default CardStack;
