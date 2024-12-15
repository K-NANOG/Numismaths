import React from 'react';

const CardFooter: React.FC = () => {
  return (
    <footer className="text-center py-3">
      <p className="text-secondary">
        <i className="fas fa-arrow-left text-danger"></i> Swipe Left to Skip |
        <i className="fas fa-arrow-right text-success"></i> Swipe Right to Learn More
      </p>
    </footer>
  );
};

export default CardFooter;