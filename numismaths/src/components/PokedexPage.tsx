import React from 'react';
import '../index.css';

const PokedexPage: React.FC = () => {
  // Array of 100 placeholders for the buttons/icons
  const pokedexItems = Array.from({ length: 100 }, (_, index) => index + 1);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        {pokedexItems.map((item) => (
          <div key={item} className="col-4 col-sm-3 col-md-2 mb-4">
            <button
              className="btn btn-light p-4 w-100 d-flex flex-column align-items-center justify-content-center shadow-sm"
              style={{
                borderRadius: '10px',
                boxShadow: '5px 5px 10px #b8b9be, -5px -5px 10px #FFFFFF',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '1.2rem',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  fontSize: '4rem',
                  color: '#e0e0e0',
                  zIndex: 0,
                  fontWeight: '700',
                }}
              >
                {item}
              </span>
              <span style={{ position: 'relative', zIndex: 1 }}>Item {item}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokedexPage;
