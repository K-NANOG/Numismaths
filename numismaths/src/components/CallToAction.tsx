import React from 'react';

const CallToAction: React.FC = () => {
  return (
    <section className="text-center py-5">
      <h2 className="text-primary">Join the Journey</h2>
      <p>Start exploring the wonders of mathematics and logic today.</p>
      <div className="nav-wrapper d-flex justify-content-center">
        <ul className="nav nav-pills" style={{ maxWidth: '250px' }}>
          <li className="nav-item">
            <a
              className="nav-link mb-sm-3 mb-md-0 active shadow text-center py-3"
              href="/index.html"
              style={{ fontSize: '1.2rem', padding: '1.5rem' }}
            >
              Get Started
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default CallToAction;
