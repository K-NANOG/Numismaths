// Spacer.tsx
import React from 'react';

// Define the types for the spacer component props
type SpacerProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // Predefined size options
  direction?: 'vertical' | 'horizontal'; // Orientation of the spacing
};

const Spacer: React.FC<SpacerProps> = ({ size = 'md', direction = 'vertical' }) => {
  // Define spacing values mapped to size tokens
  const spacingValues: Record<string, string> = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  };

  return (
    <div
      style={{
        width: direction === 'horizontal' ? spacingValues[size] : '100%',
        height: direction === 'vertical' ? spacingValues[size] : '100%',
      }}
    />
  );
};

export default Spacer;
