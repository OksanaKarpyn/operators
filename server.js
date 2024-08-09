const express = require('express');
const bodyParser = require('body-parser');
const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');

const server = express();
const dbPath = path.join(__dirname, 'public', 'db.json');
const router = jsonServer.router(dbPath); // JSON Server userà questo file come database
const middlewares = jsonServer.defaults();

const SECRET_KEY = 'your_secret_key';
const expiresIn = '1h';

const { v4: uuidv4 } = require('uuid');

function generateId() {
  return uuidv4();
}


function readDatabase() {
    try {
      // Legge il contenuto del file
      const fileContent = fs.readFileSync(dbPath, 'UTF-8');
      
      // Parsea il contenuto JSON
      return JSON.parse(fileContent);
    } catch (error) {
      console.error('Errore nella lettura del database:', error);
      throw new Error('Impossibile leggere il database.');
    }
  }

  function writeDatabase(data) {
    try {
      // Converte i dati in una stringa JSON
      const jsonData = JSON.stringify(data, null, 2);
      
      // Scrive i dati nel file
      fs.writeFileSync(dbPath, jsonData, 'UTF-8');
    } catch (error) {
      console.error('Errore nella scrittura del database:', error);
      throw new Error('Impossibile scrivere nel database.');
    }
  }
// Crea un token da un payload
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Verifica il token
function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err);
}

// Verifica se l'utente esiste nel database
function isAuthenticated({ email, password }) {
  const userdb = JSON.parse(fs.readFileSync(dbPath, 'UTF-8'));
  const user = userdb.operators.find(user => user.email === email);
  if (user) {
    return bcrypt.compareSync(password, user.password);
  }
  return false;
}

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cookieParser());
server.use(middlewares);


// // Endpoint per ottenere gli operatori basato su una query di email
// server.get('/operators', (req, res) => {
//     console.log('Received query:', req.query); // Log della query email per debug
//     const userdb = JSON.parse(fs.readFileSync(dbPath, 'UTF-8'));
//     const operators = userdb.operators.filter(operator => operator.email === req.query.email);
//     console.log('Found operators:', operators); // Log degli operatori trovati per debug
//     res.json(operators);
// });


// Endpoint per ottenere tutti gli operatori
server.get('/operators', (req, res) => {
  const userdb = JSON.parse(fs.readFileSync(dbPath, 'UTF-8'));
  const operators = userdb.operators;
  res.json(operators);
});



server.post('/register', (req, res) => {
    const { name, surname, email, password } = req.body;
  
    console.log('Received registration request:', req.body); // Debugging request body
  
    let userdb;
    try {
      userdb = readDatabase();
      console.log('Current database:', userdb); // Debugging current database state
    } catch (error) {
      console.error('Error reading database:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  
    // Verifica se l'email esiste già
    if (userdb.operators.find(user => user.email === email)) {
      return res.status(400).json({ message: 'Email already exists' });
    }
  
    // Cripta la password
    const hashedPassword = bcrypt.hashSync(password, 8);
  
    // Crea un nuovo operatore
    const newOperator = { id: generateId(), name, surname, email, password: hashedPassword };
    console.log('New operator to be added:', newOperator); // Debugging new operator
  
    // Aggiungi il nuovo operatore al database
    userdb.operators.push(newOperator);
  
    try {
      writeDatabase(userdb);
      console.log('Database after adding new operator:', readDatabase()); // Debugging updated database
    } catch (error) {
      console.error('Error writing to database:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  
    // Crea un token e restituiscilo nella risposta
    // const accessToken = createToken({ email });
    // res.cookie('token', accessToken, { httpOnly: true });
    res.status(201);
  });
  
  

// Effettua il login dell'utente
server.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!isAuthenticated({ email, password })) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = createToken({ email });
  //res.cookie('token', accessToken, { httpOnly: true });
  res.status(200).json({ accessToken });
});

// Middleware per verificare il token
server.use((req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    const verifyTokenResult = verifyToken(token);
    if (verifyTokenResult instanceof Error) {
      return res.status(401).json({ message: 'Access token not valid' });
    }
    next();
  } else {
    return res.status(401).json({ message: 'Access token not provided' });
  }
});

server.use(router);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
