import React from 'react';
import Header from '../components/Header';
import AboutSection from '../components/AboutSection';
import FeaturesSection from '../components/FeaturesSection';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';
{/*import SignupPage from './SignupPage';
import LoginPage from './Loginpage';*/}
  
{/*import ProfileButton from '../components/ProfileButton';*/}

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <Header />
      {/*<SignupPage />
      <LoginPage />*/}
      <main className="container">
        <AboutSection />
        <FeaturesSection />
        <CallToAction />
       {/* <ProfileButton /> */}
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
