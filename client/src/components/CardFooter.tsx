import React from 'react';

const CardFooter: React.FC = () => {
  return (
    <footer className="text-center py-3">
      <p className="text-secondary">
        <i className="fas fa-arrow-left text-danger"></i>  <span className='text-danger'>&lt;-</span> Swipe Left to Skip |
        <i className="fas fa-arrow-right text-success"></i> Swipe Right to Learn More <span className='text-success'>-&gt;</span>
      </p>
    </footer>
  );
};

export default CardFooter;