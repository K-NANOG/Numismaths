import React from 'react';
import Header from '../components/Header';
import AboutSection from '../components/AboutSection';
import FeaturesSection from '../components/FeaturesSection';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
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

export default LandingPage;
