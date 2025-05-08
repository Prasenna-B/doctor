import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="main-header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">🩺</span>
          <h1>MediBook</h1>
        </div>
      </div>
    </header>
  );
}

export default Header;