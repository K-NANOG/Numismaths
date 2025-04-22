import React from 'react';
import { Tag } from '../config/tags';

interface TagSelectorProps {
  onTagClick: () => void;
  selectedTags: Tag[];
}

const TagSelector: React.FC<TagSelectorProps> = ({ onTagClick, selectedTags }) => {
  return (
    <div className="nav-wrapper position-relative">
      <ul className="nav nav-pills">
        <li className="nav-item">
          <button 
            className="nav-link mb-sm-3 mb-md-0" 
            onClick={onTagClick}
          >
            <span className="fas fa-filter mr-2"></span>
            Filter Tags
          </button>
        </li>
      </ul>
    </div>
  );
};

export default TagSelector; 