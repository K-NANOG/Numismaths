import React from 'react';
import { Tag } from '../config/tags';

interface TagSelectorProps {
  onTagClick: () => void;
  selectedTags: Tag[];
}

const TagSelector: React.FC<TagSelectorProps> = ({ onTagClick, selectedTags }) => {
  return (
    <div className="filter-tags-wrapper">
      <button 
        className="btn btn-primary neumorphic-btn"
        onClick={onTagClick}
      >
        <span className="fas fa-filter mr-2"></span>
        Filter Tags
      </button>
    </div>
  );
};

export default TagSelector; 