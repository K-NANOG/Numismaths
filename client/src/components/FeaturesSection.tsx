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
    <section className="row text-center py-5">
      {features.map((feature, index) => (
        <div key={index} className="col-md-4">
          <div className="card p-4 shadow">
            <h3 className={feature.colorClass}>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default FeaturesSection;
