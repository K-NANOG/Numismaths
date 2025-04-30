import React, { useState, useEffect } from 'react';
import { ConceptCard } from '../types/Wikipedia';
import { WikipediaService } from '../services/WikipediaService';
import { UserPreferencesService } from '../services/UserPreferencesService';
import TagModal from './TagModal';
import TagSelector from './TagSelector';
import { Tag } from '../config/tags';
import { tagCategories } from '../config/tags';
import '../styles.css';

export const Swipe: React.FC = () => {
  const [concepts, setConcepts] = useState<ConceptCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const wikipediaService = WikipediaService.getInstance();
  const userPreferences = UserPreferencesService.getInstance();

  const fetchConcepts = async () => {
    setIsLoading(true);
    try {
      const newConcepts = await wikipediaService.searchArticles('Science');
      setConcepts(newConcepts);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching concepts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConcepts();
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex < concepts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      fetchConcepts();
    }
  };

  const handleTagSelection = (tags: Tag[]) => {
    userPreferences.setSelectedTags(tags);
    setIsTagModalOpen(false);
    fetchConcepts();
  };

  const currentConcept = concepts[currentIndex];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentConcept) {
    return <div>No concepts available</div>;
  }

  return (
    <div className="swipe-container">
      <div className="tag-controls">
        <button 
          className="btn btn-primary neumorphic-btn"
          onClick={() => setIsTagModalOpen(true)}
        >
          <span className="fas fa-filter mr-2"></span>
          Filter Tags
        </button>
        <div className="selected-tags">
          {userPreferences.getSelectedTags().map(tag => (
            <span key={tag.id} className="badge badge-info">
              {tag.name}
            </span>
          ))}
        </div>
      </div>

      <TagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onTagsSelected={handleTagSelection}
        selectedTags={userPreferences.getSelectedTags()}
      />

      <div className="concept-card shadow-soft border border-light rounded p-4">
        <h2 className="h3 mb-3">{currentConcept.name}</h2>
        <p className="text-gray mb-4">{currentConcept.description}</p>
        <div className="concept-tags mb-4">
          {currentConcept.tags.map((tag, index) => (
            <span key={index} className="badge badge-info mr-2">
              {tag}
            </span>
          ))}
        </div>
        <div className="swipe-buttons d-flex justify-content-between">
          <button 
            className="btn btn-primary"
            onClick={() => handleSwipe('left')}
          >
            <span className="fas fa-times mr-2"></span>
            Skip
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => handleSwipe('right')}
          >
            <span className="fas fa-check mr-2"></span>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}; 