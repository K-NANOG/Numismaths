import React, { useState, useEffect } from 'react';
import { WikipediaService } from '../services/WikipediaService';
import { ConceptCard } from '../types/Wikipedia';
import { Tag, tagCategories } from '../config/tags';
import TagSelector from './TagSelector';
import TagModal from './TagModal';
import '../styles.css';

interface WikipediaSearchProps {
  onNewCards: (cards: ConceptCard[], theme: string, offset: number, tags: Tag[]) => void;
}

const WikipediaSearch: React.FC<WikipediaSearchProps> = ({ onNewCards }) => {
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  // Function to handle search based on current theme and tags
  const handleSearch = async () => {
    if (!theme.trim() && selectedTags.length === 0) {
      setError('Please enter a theme or select tags to search for');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const wikipediaService = WikipediaService.getInstance();
      const cards = await wikipediaService.searchArticles(theme, selectedTags);
      onNewCards(cards, theme, 0, selectedTags);
      setTheme('');
    } catch (err) {
      setError('Failed to fetch articles. Please try again.');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle tag selection
  const handleTagSelection = (tags: Tag[]) => {
    setSelectedTags(tags);
    setIsTagModalOpen(false);
    // Automatically search if tags are selected
    if (tags.length > 0) {
      handleSearch();
    }
  };

  // Display selected tags
  const renderSelectedTags = () => {
    if (selectedTags.length === 0) return null;

    return (
      <div className="selected-tags mt-2 mb-3">
        {selectedTags.map(tag => (
          <span key={tag.id} className="badge badge-info mr-2">
            {tag.name}
            <button
              className="btn-close ml-2"
              onClick={() => handleRemoveTag(tag)}
              aria-label="Remove tag"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    );
  };

  // Remove individual tag
  const handleRemoveTag = (tagToRemove: Tag) => {
    const newTags = selectedTags.filter(tag => tag.id !== tagToRemove.id);
    setSelectedTags(newTags);
    if (newTags.length > 0 || theme.trim()) {
      handleSearch();
    }
  };

  return (
    <div className="wikipedia-search">
      <h3>Explore New Concepts</h3>
      <p>
        Search Wikipedia to discover more mathematical concepts and add them to your collection.
      </p>
      <div className="search-container">
        <div className="input-group mb-3">
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
        
        {renderSelectedTags()}
        
        <TagSelector
          selectedTags={selectedTags}
          onTagClick={() => setIsTagModalOpen(true)}
        />
      </div>
      
      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}

      <TagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onTagsSelected={handleTagSelection}
        selectedTags={selectedTags}
      />
    </div>
  );
};

export default WikipediaSearch; 