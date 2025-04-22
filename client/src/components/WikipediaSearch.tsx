import React, { useState } from 'react';
import { WikipediaService } from '../services/WikipediaService';
import { ConceptCard } from '../types/Wikipedia';
import '../styles.css';

interface WikipediaSearchProps {
  onNewCards: (cards: ConceptCard[]) => void;
}

const WikipediaSearch: React.FC<WikipediaSearchProps> = ({ onNewCards }) => {
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!theme.trim()) {
      setError('Please enter a theme to search for');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const wikipediaService = WikipediaService.getInstance();
      const cards = await wikipediaService.searchArticles(theme);
      onNewCards(cards);
      setTheme('');
    } catch (err) {
      setError('Failed to fetch articles. Please try again.');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wikipedia-search">
      <h3>Explore New Concepts</h3>
      <p>
        Search Wikipedia to discover more mathematical concepts and add them to your collection.
      </p>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Enter a theme (e.g., Mathematics, Physics)"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          className="btn btn-primary"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          ) : (
            'Search'
          )}
        </button>
      </div>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default WikipediaSearch; 