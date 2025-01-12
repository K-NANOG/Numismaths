import React from 'react';
import NumidexHeader from '../components/NumidexHeader.tsx';
import Footer from '../components/Footer.tsx';
import CardStack from '../components/CardStack.tsx';
import CardFooter from '../components/CardFooter.tsx';
import PokedexButton from '../components/PokedexButton.tsx';

const SwipeInterface: React.FC = () => {
  return (
    <div className="card-stack">
      <NumidexHeader />
      <main>
        <CardStack />
      </main>
      <CardFooter />
      <PokedexButton />
      <Footer />
    </div>
  );
};

export default SwipeInterface;
