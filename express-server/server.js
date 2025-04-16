// server.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();  // Ympäristömuuttujien lataaminen .env tiedostosta

const app = express();
const port = process.env.PORT || 4000;
const secretKey = process.env.JWT_SECRET_KEY || 'Hiava';


// Middleware
app.use(cors());
app.use(express.json());  // JSON-datan käsittely

//käyttäjätesti
const users = [
    { username: 'customer', password: 'pass123', role: 'customer' },
    { username: 'expert', password: 'expert123', role: 'expert' }
  ];


////REITIT //////////
// Kirjautumisreitti (esimerkki)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
  
    if (user) {
      const token = jwt.sign(
        { username: user.username, role: user.role },
        secretKey,
        { expiresIn: '1h' }
      );
      return res.json({ token });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  app.post('/verify-token', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Haetaan token "Bearer <token>"
    if (!token) {
      return res.status(401).json({ valid: false });
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ valid: false });
      }
  
      // Palautetaan rooli ja tieto siitä, että token on validi
      res.json({ valid: true, role: decoded.role });
    });
  });

// Suojattu reitti
app.get('/protected', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
  
    if (!token) {
      return res.status(403).json({ error: 'No token provided' });
    }
  
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Token is invalid or expired' });
      }
      return res.json({ message: 'Protected data', user });
    });
  });

  // Mock-lomakkeet
app.get('/forms', (req, res) => {
    const mockForms = [
      {
        id: 1,
        name: "Asiakaspalaute",
        fields: [
          { label: "Nimi", type: "text" },
          { label: "Palaute", type: "textarea" }
        ]
      },
      {
        id: 2,
        name: "Kysely",
        fields: [
          { label: "Ikä", type: "number" },
          { label: "Sukupuoli", type: "select", options: ["Mies", "Nainen", "Muu"] }
        ]
      }
    ];
  
    res.json(mockForms);
  });

  app.post('/forms', (req, res) => {
    console.log("Tallennettu lomake:", req.body);
    res.status(201).json({ message: 'Lomake vastaanotettu' });
  });

  
// Yleinen virheenkäsittely
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Jotain meni pieleen!' });
  });


// Palvelimen käynnistäminen
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
