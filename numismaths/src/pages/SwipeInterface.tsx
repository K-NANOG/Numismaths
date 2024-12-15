import React from 'react';
import Header from '../components/Header.tsx';
import Footer from '../components/Footer.tsx';
import CardStack from '../components/CardStack.tsx';

const SwipeInterface: React.FC = () => {
  return (
    <div className="card-stack">
      <Header />
      <main>
        <CardStack />
      </main>
      <Footer />
    </div>
  );
};

export default SwipeInterface;
