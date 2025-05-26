import React from 'react';
import './WikipediaLink.css';

interface WikipediaLinkProps {
  url: string;
  conceptName: string;
  className?: string;
  children: React.ReactNode;
}

export const WikipediaLink: React.FC<WikipediaLinkProps> = ({ url, conceptName, className = '', children }) => {
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={`Read more about ${conceptName} on Wikipedia (opens in new tab)`}
      title={`Read more about ${conceptName} on Wikipedia`}
      role="link"
    >
      {children}
    </a>
  );
}; 