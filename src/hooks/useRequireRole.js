import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL; //Ympäristömuuttuja serverin osoitteeksi

function useRequireRole(requiredRole) {
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Jos pääsy on jo estetty, ei suoriteta mitään
    const verifyAccess = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/protected`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();

        // Tarkistetaan, onko käyttäjän rooli sallittu
        if (requiredRole && !requiredRole.includes(data.user.role)) {
          setAccessDenied(true);  // Jos rooli ei ole sallittu, estetään pääsy
        } else {
          setUser(data.user);  // Jos rooli on sallittu, asetetaan käyttäjän tiedot
        }
      } catch (err) {
        setAccessDenied(true);  // Jos palvelimella on virhe, estetään pääsy
      } finally {
        setLoading(false);  // Ladataan valmis
      }
    };

    verifyAccess();  // Suoritetaan funktio, joka tarkistaa oikeudet
  }, [JSON.stringify(requiredRole)]);  // Hookin käynnistyminen vain roolin muuttumisen yhteydessä

  return { loading, accessDenied, user };
}

export default useRequireRole;
