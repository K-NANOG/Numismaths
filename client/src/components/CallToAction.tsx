import React from 'react';

const CallToAction: React.FC = () => {
  return (
    <section className="text-center py-5">
      <h2 className="text-primary">Join the Journey</h2>
      <p>Start exploring the wonders of mathematics and logic today.</p>
      <div className="nav-wrapper d-flex justify-content-center">
        <ul className="nav nav-pills" style={{ maxWidth: '250px' }}>
          <li className="nav-item">
          <a className="btn btn-primary" href="/swipe">
            Get Started
          </a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default CallToAction;
