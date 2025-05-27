import React from 'react';
import { Tag } from '../config/tags';

interface TagSelectorProps {
  onTagClick: () => void;
  selectedTags: Tag[];
  isActive?: boolean;
}

const TagSelector: React.FC<TagSelectorProps> = ({ onTagClick, selectedTags, isActive }) => {
  return (
    <div className="filter-tags-wrapper">
      <button 
        className={`btn btn-primary neumorphic-btn${isActive ? ' neumorphic-btn-inset' : ''}`}
        onClick={onTagClick}
        aria-pressed={isActive}
      >
        <span className="fas fa-filter mr-2"></span>
        Filter Tags
      </button>
    </div>
  );
};

export default TagSelector; 