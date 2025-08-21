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
    { username: 'customer', password: 'pass123', role: 'customer', allowedForms: ['Asiakaspalaute', 'Kysely']},
    { username: 'expert', password: 'expert123', role: 'expert', allowedForms: ['all']}
  ];

  // Simuloitu tietokanta tai mock-tiedot
const mockForms = [
  {
    id: 1,
    name: "Asiakaspalaute",
    fields: [
      { name: "Nimi", type: "string" },
      { name: "Palaute", type: "string" },
      { name: "Saako", type: "boolean" }

    ]
  },
  {
    id: 2,
    name: "Kysely",
    fields: [
      { name: "Nimi", type: "string" },
      { name: "Tunnit", type: "number"},
      { name: "Testaaja", type: "boolean"}
    ]
  },
  {
    id: 3,
    name: "Test form 3",
    fields: [
      { name: "ID", type: "number" },
      { name: "Text", type: "string" },
      { name: "Test", type: "boolean" }
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

  app.get('/forms/user', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.status(403).json({ error: 'Token is invalid or expired' });

      const dbUser = users.find(u => u.username === user.username);
      if (!dbUser) return res.status(404).json({ error: 'User not found' });
      //tarkasta rooli, jos expert palauta kaikki, jos muu palauta sallitut lista
      const forms = dbUser.role === 'expert'
        ? mockForms.map(f => f.name)
        : (Array.isArray(dbUser.allowedForms) ? dbUser.allowedForms : []);
      return res.json({ forms });
    });
  });

// API-reitti, joka palauttaa vain haetun lomakkeen nimen perusteella
app.get('/forms', (req, res) => {
  
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token is invalid or expired' });

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
});

  app.post('/forms', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.status(403).json({ error: 'Token is invalid or expired' });
      console.log("Lomakkeen lähettäjä: ", user.username)
      console.log("Tallennettu lomake:", req.body);
      res.status(201).json({ message: 'Lomake vastaanotettu' });
    });
  });

app.post('/forms/save', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token is invalid or expired' });

    const form = req.body;
    
    console.log("Vastaanotettu lomake:", form);
    
    //Tallennus  tietokantaan
    //Simuloidaan vastaus
    res.status(200).json({
      message: "Lomake tallennettu",
      savedForm: form
    });
  });
});

app.delete('/forms/:formName', (req, res) => {
  console.log("Expert logged in");
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token is invalid or expired' });

    // vain expert voi  poistaa, periaatteessa customer ei pitäisi päästä tähän, mutta varmuuden vuoksi
    if (user.role !== 'expert') {
      return res.status(403).json({ error: 'Käyttöoikeus evätty' });
    }

    const { formName } = req.params;
    const index = mockForms.findIndex(f => f.name === formName);

    if (index === -1) {
      return res.status(404).json({ error: `Lomaketta "${formName}" ei löytynyt` });
    }

    // poistetaan lomake
    const deletedForm = mockForms.splice(index, 1)[0];
    console.log(`Lomake poistettu:`, deletedForm);

    return res.json({ message: `Lomake "${formName}" poistettu onnistuneesti` });
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
