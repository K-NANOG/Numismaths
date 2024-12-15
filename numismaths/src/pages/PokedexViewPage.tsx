import React from 'react';
import Footer from '../components/Footer.tsx';
import PokedexPage from '../components/PokedexPage.tsx';

const PokedexViewPage: React.FC = () => {
  return (
    <div className="card-stack">
      <main>
        <PokedexPage />
      </main>
      <Footer />
    </div>
  );
};

export default PokedexViewPage;
