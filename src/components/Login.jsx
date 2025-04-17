import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL; //Ympäristömuuttuja serverin osoitteeksi

function Login({ credentials }) {
  const [username, setUsername] = useState(credentials.username);
  const [password, setPassword] = useState(credentials.password);
  const [error, setError] = useState('');

  useEffect(() => {
    // Päivitetään username ja password, jos credentials muuttuu
    setUsername(credentials.username);
    setPassword(credentials.password);
  }, [credentials]);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        // Jos vastaus ei ole ok, heitetään virhe
        throw new Error('Invalid credentials');
      }
  
      const data = await response.json();
  
      // Tallenna token localStorageen
      localStorage.setItem('authToken', data.token);
  
      // Ohjataan etusivulle
      window.location.href = '/';
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  /*
  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p>{error}</p>}
    </div>
  );
*/
}
export default Login;
