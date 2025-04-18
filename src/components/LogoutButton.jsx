// src/components/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Tyhjennetään localStorage
    localStorage.clear();
    // Ohjataan käyttäjä takaisin kirjautumissivulle
    navigate('/');
  };

  return (
    <button className="btn btn-danger" onClick={handleLogout}>
      Kirjaudu ulos
    </button>
  );
};

export default LogoutButton;
