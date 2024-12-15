import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SwipeInterface from './pages/SwipeInterface';
import PokedexViewPage from './pages/PokedexViewPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/swipe" element={<SwipeInterface />} />
        <Route path="/numidex" element={<PokedexViewPage />} />
      </Routes>
    </Router>
  );
};

export default App;
