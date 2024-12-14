import React from 'react';
import './App.css';
import Header from './components/Header';
import AboutSection from './components/AboutSection';
import FeaturesSection from './components/FeaturesSection';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <main className="container">
        <AboutSection />
        <FeaturesSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default App;
