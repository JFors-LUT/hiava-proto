// src/components/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Tyhjennetään autentikointitiedot localStoragesta
    localStorage.removeItem('authToken');
    
    // Voimme myös tyhjentää mahdolliset käyttäjän rooliin liittyvät tiedot
    localStorage.removeItem('userRole');

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
