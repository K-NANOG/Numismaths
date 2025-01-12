import React from 'react';
import '../index.css';

const PokedexPage: React.FC = () => {
  // Array of 100 placeholders for the buttons/icons
  const pokedexItems = Array.from({ length: 100 }, (_, index) => index + 1);

  return (
    <div className="container py-5">
      <h1 className="text-center text-primary mb-4">Numidex</h1> {/* Original header */}
      <div className="row justify-content-center">
        {pokedexItems.map((item) => (
          <div key={item} className="col-4 col-sm-3 col-md-2 mb-4">
            <button
              className="btn inset-shadow p-4 w-100 d-flex flex-column align-items-center justify-content-center"
              style={{
                borderRadius: '10px', // Enforce square shape
                aspectRatio: '1 / 1', // Make it square
                position: 'relative',
              }}
            >
              <span
                className="text-primary"
                style={{
                  position: 'absolute',
                  fontSize: '2rem', // Smaller number font size
                  zIndex: 0,
                  fontWeight: '500',
                  opacity: 0.5,
                }}
              >
                {item}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokedexPage;
