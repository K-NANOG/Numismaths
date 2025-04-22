import React from 'react';
import { Link } from 'react-router-dom';

const NavigationPills: React.FC = () => {
  return (
    <div className="nav-wrapper position-relative">
      <ul className="nav nav-pills">
        <li className="nav-item">
          <Link className="nav-link mb-sm-3 mb-md-0 active" to="/swipe">
            <span className="fas fa-chart-pie"></span>Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link mb-sm-3 mb-md-0" to="/profile">
            <span className="far fa-user"></span>Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link mb-sm-3 mb-md-0" to="/settings">
            <span className="fas fa-cog"></span>Settings
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link mb-sm-3 mb-md-0" to="/messages">
            <span className="far fa-comment-dots"></span>Messages
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default NavigationPills; 