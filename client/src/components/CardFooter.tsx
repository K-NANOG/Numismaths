import React from 'react';

const CardFooter: React.FC = () => {
  return (
    <footer className="swipe-footer">
      <div className="swipe-instructions">
        <span className="instruction-left">
          Swipe Left to Skip
        </span>
        <span className="instruction-divider">•</span>
        <span className="instruction-right">
          Swipe Right to Store
        </span>
      </div>
    </footer>
  );
};

export default CardFooter;