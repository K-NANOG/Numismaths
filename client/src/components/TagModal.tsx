import React, { useState } from 'react';
import { Tag, tagCategories } from '../config/tags';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTagsSelected: (tags: Tag[]) => void;
  selectedTags: Tag[];
}

const TagModal: React.FC<TagModalProps> = ({ isOpen, onClose, onTagsSelected, selectedTags }) => {
  const [localSelectedTags, setLocalSelectedTags] = useState<Tag[]>(selectedTags);

  const toggleTag = (tag: Tag) => {
    setLocalSelectedTags(prev => {
      const isSelected = prev.some(t => t.id === tag.id);
      if (isSelected) {
        return prev.filter(t => t.id !== tag.id);
      } else {
        return [...prev, tag];
      }
    });
  };

  const handleApply = () => {
    onTagsSelected(localSelectedTags);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Select Tags</h2>
            <button type="button" className="close" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            {tagCategories.map(category => (
              <div key={category.id}>
                <h3>{category.name}</h3>
                <div className="btn-group-toggle">
                  {category.tags.map(tag => (
                    <label
                      key={tag.id}
                      className={`btn ${
                        localSelectedTags.some(t => t.id === tag.id) ? 'active' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={localSelectedTags.some(t => t.id === tag.id)}
                        onChange={() => toggleTag(tag)}
                      />
                      {tag.name}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn" onClick={handleApply}>
              Apply
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagModal; 