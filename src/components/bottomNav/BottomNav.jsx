import React, { useState } from 'react';
import './bottomNav.css';
import { Link } from 'react-router-dom';

const BottomNav = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  return (
    <div className="container bottom-nav">
      <Link onClick={() => setCurrentPath('/home')} className={`nav-link d-flex flex-column align-items-center ${currentPath === '/home' ? 'active-nav' : ''}`} to="/home">

        <i
          className={`bi ${currentPath === '/home' ? 'bi-house-fill' : 'bi-house'}`}
        ></i>
        <span>Home</span>

      </Link>

      <Link
        onClick={() => setCurrentPath('/refer')}
        className={`nav-link d-flex flex-column align-items-center ${currentPath === '/refer' ? 'active-nav' : ''}`}
        to="/refer"
      >
        <i
          className={`bi ${currentPath === '/refer' ? 'bi-people-fill' : 'bi-people'
            }`}
        ></i>
        <span>Refer</span>
      </Link>

      <Link
        onClick={() => setCurrentPath('/profile')}
        className={`nav-link d-flex flex-column align-items-center ${currentPath === '/profile' ? 'active-nav' : ''}`}
        to="/profile"
      >
        <i
          className={`bi ${currentPath === '/profile' ? 'bi-person-fill' : 'bi-person'
            }`}
        ></i>

        <span>Profile</span>
      </Link>
    </div>
  );
};

export default BottomNav;
