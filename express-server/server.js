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

  // Simuloitu tietokanta tai mock-tiedot
const mockForms = [
  {
    id: 1,
    name: "Asiakaspalaute",
    fields: [
      { label: "Nimi", type: "string" },
      { label: "Palaute", type: "string" }
    ]
  },
  {
    id: 2,
    name: "Kysely",
    fields: [
      { label: "Nimi", type: "string" },
      { label: "Tunnit", type: "number"},
      { label: "Testaaja", type: "boolean"}
    ]
  },
  {
    id: 3,
    name: "Test form 3",
    fields: [
      { label: "ID", type: "number" },
      { label: "Text", type: "string" },
      { label: "Test", type: "boolean" }
    ]
  }
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
/*
  app.get('/me', authenticateToken, (req, res) => {
    res.json({ username: req.user.username, role: req.user.role });
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
  */

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
  
      // Token on validi -> palautetaan käyttäjän tiedot
      return res.json({ user });
    });
  });

// API-reitti, joka palauttaa vain haetun lomakkeen nimen perusteella
app.get('/forms', (req, res) => {
  

  const { formName } = req.query;  // Haetaan query-parametri 'formName'
  console.log(`lomaketta ${formName} haetaan...`);
  if (!formName) {
    return res.status(400).json({ error: 'Lomakkeen nimi puuttuu' });  // Virhe, jos formName ei ole mukana
  }

  // Etsitään lomake mockForms-taulukosta formName:n perusteella
  const form = mockForms.find((f) => f.name === formName);

  if (!form) {
    return res.status(404).json({ error: 'Lomaketta ei löytynyt' });  // Virhe, jos lomaketta ei löydy
  }

  // Palautetaan löytynyt lomake
  res.json(form);
});

  app.post('/forms', (req, res) => {
    console.log("Tallennettu lomake:", req.body);
    res.status(201).json({ message: 'Lomake vastaanotettu' });
  });

app.post('/forms/save', (req, res) => {
  const form = req.body;
  
  console.log("Vastaanotettu lomake:", form);
  
  //Tallennus  tietokantaan
  //Simuloidaan vastaus
  res.status(200).json({
    message: "Lomake tallennettu",
    savedForm: form
  });
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
