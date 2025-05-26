import React, { useEffect, useState, useCallback } from 'react';
import '../styles.css';
import { WikipediaLink } from './WikipediaLink';
import { FiExternalLink } from 'react-icons/fi';

interface Concept {
  id: string;
  name: string;
  difficulty: string;
  pageUrl?: string;
  wikipediaUrl?: string;
}

const PokedexPage: React.FC = () => {
  const [likedConcepts, setLikedConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  const fetchLikedConcepts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8080/api/liked-concepts');
      if (!response.ok) throw new Error('Failed to fetch liked concepts');
      const data = await response.json();
      setLikedConcepts(data);
    } catch (err) {
      console.error('Error fetching liked concepts:', err);
      setError('Failed to load liked concepts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLikedConcepts();
  }, [fetchLikedConcepts, lastUpdate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLastUpdate(Date.now());
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading liked concepts...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <p className="text-danger mb-3">{error}</p>
          <button className="btn btn-primary" onClick={() => setLastUpdate(Date.now())}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate total slots (100 for now, like a Pokédex)
  const totalSlots = 100;
  const numidexSlots = Array.from({ length: totalSlots }, (_, index) => {
    const concept = likedConcepts[index];
    return {
      number: (index + 1).toString().padStart(3, '0'),
      concept
    };
  });

  return (
    <div className="numidex-container">
      <h1 className="text-center mb-4">Your Numidex</h1>
      <div className="numidex-grid">
        {numidexSlots.map(({ number, concept }) => {
          const url = concept?.pageUrl || concept?.wikipediaUrl;
          const CardContent = (
            <>
              <span className="concept-number">{number}</span>
              {url && (
                <FiExternalLink className="link-icon" size={16} aria-label="Wikipedia link" />
              )}
              <h3 className="concept-name no-underline">{concept?.name}</h3>
              <span className={`difficulty-badge ${concept?.difficulty?.toLowerCase()}`} style={{ marginTop: '0.2rem' }}>
                {concept?.difficulty}
              </span>
            </>
          );
          return (
            <div key={number} className="numidex-slot">
              {concept ? (
                url ? (
                  <WikipediaLink url={url} conceptName={concept.name} className="concept-card-link">
                    <div className={`concept-card ${concept.difficulty.toLowerCase()}`} tabIndex={-1}>
                      {CardContent}
                    </div>
                  </WikipediaLink>
                ) : (
                  <div className={`concept-card ${concept.difficulty.toLowerCase()}`}>{CardContent}</div>
                )
              ) : (
                <div className="concept-card empty">
                  <span className="concept-number">{number}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PokedexPage;
