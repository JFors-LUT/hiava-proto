import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL; //Ympäristömuuttuja serverin osoitteeksi

export default function Home() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    // Tarkistetaan, onko käyttäjä kirjautunut sisään ja rooli tallennettu localStorageen
    const savedRole = localStorage.getItem("userRole");

    if (savedRole) {
      // Ohjataan oikealle sivulle roolin mukaan
      if (savedRole === "expert") {
        navigate("/build-form");
      } else if (savedRole === "customer") {
        navigate("/fill-form");
      }
    }
  }, [navigate]);

  const handleRoleSelect = (role) => {
    // Määritellään käyttäjän tiedot roolin mukaan
    const credentials = role === "expert" 
      ? { username: 'expert', password: 'expert123' }
      : { username: 'customer', password: 'pass123' };

    // Lähetetään käyttäjätiedot serverille kirjautumista varten
    fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          // Tallenna token ja rooli
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userRole", role);
          
          // Ohjataan käyttäjä roolin mukaan
          if (role === "expert") {
            navigate("/build-form");
          } else {
            navigate("/fill-form");
          }
        } else {
          setError("Invalid credentials");
        }
      })
      .catch(() => setError("Tapahtui virhe kirjautumisessa."));
  };

  return (
    <div className="p-8 max-w-xl mx-auto text-center container mt-5 pt-4">
      <div className="alert alert-success" role="alert">
        Tervetuloa! Valitse käyttäjäroolisi jatkaaksesi.
      </div>
      <h1>Kirjaudu sisään</h1>
      <p>Valitse käyttäjäroolisi:</p>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="d-flex justify-content-center gap-4 mt-4">
        <button className="btn btn-primary" onClick={() => handleRoleSelect("customer")}>
          Asiakas
        </button>
        <button className="btn btn-secondary" onClick={() => handleRoleSelect("expert")}>
          Asiantuntija
        </button>
      </div>
    </div>
  );
}
