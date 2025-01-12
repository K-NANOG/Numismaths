import React from 'react';

const PokedexButton: React.FC = () => {
  return (
    <div className="d-flex justify-content-center py-5">
      <a
        className="btn neumorphic-button px-5 py-3"
        href="/numidex"
        style={{
          fontSize: '1.5rem',
          borderRadius: '12px',
        }}
      >
        Explore the Numidex
      </a>
    </div>
  );
};

export default PokedexButton;
