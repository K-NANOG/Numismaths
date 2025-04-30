import React from 'react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'Glossary of Tools',
      description: 'Explore a curated list of mathematical and logical tools designed for accessibility and discovery.',
      colorClass: 'text-danger',
    },
    {
      title: 'Interactive Learning',
      description: 'Swipe through concepts like a serious game. Decide what\'s intriguing and save them for later study.',
      colorClass: 'text-success',
    },
    {
      title: 'Categorization',
      description: 'Concepts are organized by user-defined parameters, ensuring structured and intuitive exploration.',
      colorClass: 'text-warning',
    },
  ];

  return (
    <section className="container-fluid py-5">
      <div className="d-flex justify-content-center" style={{ gap: '2rem' }}>
        {features.map((feature, index) => (
          <div key={index} style={{ width: '360px', margin: '0 1.5rem', flex: '0 0 360px' }}>
            <div className="card p-4 inset-shadow h-100">
              <h3 className={`${feature.colorClass} text-center`}>{feature.title}</h3>
              <p className="mb-0 text-center">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
