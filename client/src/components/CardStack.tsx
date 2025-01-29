import React, { useEffect, useState } from "react";
import Spacer from "./Spacer";
import "../index.css";

type Concept = {
  id: string; // Added an id property to uniquely identify each cards
  name: string;
  description: string;
  category: string;
  difficulty: string;
  image?: string;
};

const cardsStack: React.FC = () => {
  const [concepts, setConcepts] = useState<Concept[]>([]);

  useEffect(() => {
    const loadcardss = async () => {
      try {
        const response = await fetch("/concepts");
        if (!response.ok) throw new Error("Failed to fetch concepts");
        const data = await response.json();
        setConcepts(data);
      } catch (error) {
        console.error("Error loading JSON data:", error);
      }
    };

    loadcardss();
  }, []);

  const handleSwipe = async (id: string, direction: "left" | "right") => {
    const cardElement = document.querySelector<HTMLDivElement>(`.cards[data-id="${id}"]`);
  
    if (cardElement) {
      cardElement.style.transition = "transform 0.5s, opacity 0.5s";
      cardElement.style.transform = direction === "left" ? "translateX(-200%)" : "translateX(200%)";
      cardElement.style.opacity = "0";
    }
  
    if (direction === "right") {
      try {
        await fetch("/save-liked", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
      } catch (error) {
        console.error("Error saving liked concept:", error);
      }
    }
  
    setTimeout(() => {
      setConcepts((prev) => prev.filter((concept) => concept.id !== id));
    }, 500); // Match CSS transition delay
  };
  

  const setupSwipeHandlers = (cardsElement: HTMLDivElement, id: string) => {
    let startX = 0;
    let currentX = 0;
    let shiftX = 0;
    let isDragging = false;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.clientX;
      cardsElement.style.transition = "none";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      currentX = e.clientX;
      shiftX = currentX - startX;
      cardsElement.style.transform = `translateX(${shiftX}px) rotate(${shiftX / 20}deg)`;

      if (shiftX > 50) cardsElement.classList.add("like");
      else if (shiftX < -50) cardsElement.classList.add("dislike");
      else cardsElement.classList.remove("like", "dislike");
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;

      if (shiftX > 100) {
        handleSwipe(id, "right");
      } else if (shiftX < -100) {
        handleSwipe(id, "left");
      } else {
        cardsElement.style.transition = "transform 0.5s";
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
  };

  useEffect(() => {
    const cardsElements = document.querySelectorAll<HTMLDivElement>(".cards");
    cardsElements.forEach((cards) => {
      const id = cards.getAttribute("data-id");
      if (id) setupSwipeHandlers(cards, id);
    });
  }, [concepts]);

  return (
    <div id="cards-container" className="cards-container">
      {concepts.length === 0 ? (
        <p>No more cards...</p>
      ) : (
        concepts.map((concept, index) => (
          <div
            key={concept.id} // Use the unique id for the key
            data-id={concept.id} // Add a data-id attribute for DOM access
            className="cards"
            style={{ zIndex: concepts.length - index }}
          >
            {concept.image && <img src={concept.image} alt={concept.name} />}
            <h2>{concept.name}</h2>
            <p>{concept.description}</p>
            <Spacer size="sm" direction="vertical" />
            <span className="badge badge-info">{concept.category}</span>
            <Spacer size="sm" direction="vertical" />
            <span className={`badge badge-${concept.difficulty.toLowerCase()}`}>{concept.difficulty}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default cardsStack;
