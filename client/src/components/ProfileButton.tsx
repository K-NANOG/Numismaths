import React from 'react';

const ProfileButton: React.FC = () => {
  return (
    <div className="d-flex justify-content-center py-5">
      <a
        className="btn neumorphic-button px-5 py-3"
        href="/profile"
        style={{
          fontSize: '1.5rem',
          borderRadius: '12px',
        }}
      >
        User Profile
      </a>
    </div>
  );
};

export default ProfileButton;
