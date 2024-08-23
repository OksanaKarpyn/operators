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
const userdb = JSON.parse(fs.readFileSync(dbPath, 'UTF-8'));
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
      console.log('sono nel func readDataBase')
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
  console.log('sono dentro la funzione isAuthenticated');
  //ricarica database per avere dati aggiornati
  const userdb = readDatabase();

  const user = userdb.users.find(user => user.email === email);
  console.log(user);
  console.log(`User prova a logarsi: ${JSON.stringify(user)}`);

  if (user) {
    console.log(`User found: ${JSON.stringify(user)}`);
    const isMatch = bcrypt.compareSync(password, user.password);
    console.log(`Password match: ${isMatch}`);
    return isMatch;
  }
  return false;
}

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cookieParser());
server.use(middlewares);


// Endpoint per il logout
server.post('/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
});

// Effettua il login dell'utente
server.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  //ricarica database per avere dati aggiornati
  const userdb = readDatabase();
  const user = userdb.users.find(user => user.email === email);
  console.log(`Trovato utente per login: ${JSON.stringify(user)}`);
  console.log('prima di authenticazione');

  if (!isAuthenticated({ email,password })) {
    console.log('non authentificato');
    return res.status(401).json({ message: 'Invalid credentials' });
  }
 
  const accessToken = createToken({ email,role:user.role ,id:user.id});
  //res.cookie('token', accessToken, { httpOnly: true });
  res.status(200).json({ user,accessToken });
});



// registra utente
server.post('/users/register', (req, res) => {
    const { name, surname,role, email, password } = req.body;
  
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
    if (userdb.users.find(user => user.email === email)) {
      return res.status(400).json({ message: 'Email already exists' });
    }
  
    // Cripta la password
    const hashedPassword = bcrypt.hashSync(password, 8);
  
    // Crea un nuovo operatore
    const newOperator = { id: generateId(), name, surname, role, email, password: hashedPassword };
    console.log('New operator to be added:', newOperator); // Debugging new operator
  
    // Aggiungi il nuovo operatore al database
    userdb.users.push(newOperator);
  
    try {
      writeDatabase(userdb);
      console.log('Database after adding new operator:', readDatabase()); // Debugging updated database
    } catch (error) {
      console.error('Error writing to database:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
    console.log('fine funzione');
  
    // Crea un token e restituiscilo nella risposta
    // const accessToken = createToken({ email });
    // res.cookie('token', accessToken, { httpOnly: true });
    userdb = readDatabase();
    return res.status(200).json({})
    // res.status(200).json({  operatorId: newOperator.id });

  });
  






// Endpoint per ottenere gli operatori basato su una query di email
server.get('/users', (req, res) => {
    console.log('Received query:', req.body); // Log della query email per debug
    const users = userdb.users.filter(operator => operator.email === req.body.email);
    console.log('Found users:', users); // Log degli operatori trovati per debug
    res.json(users);
});

// //user profilo
server.get('/users/profile',(req,res)=>{
  const token = req.cookies.token;
  if (token) {
    const verifyTokenResult = verifyToken(token);
    console.log(verifyTokenResult);

    const email = verifyTokenResult.email;
    const userdb = readDatabase();
    const user = userdb.users.find(operator => operator.email === email);
   return res.json(user);

  }
  return res.status(401).json({ message: 'Access token not provided' });
})

// Endpoint per ottenere tutti gli utenti
server.get('/users/all',(req,res)=>{
  // Ricarica il database per avere i dati aggiornati
  const userdb = readDatabase();
  console.log('Returning all users');
  return res.json(userdb.users);
 })

 // Endpoint per ottenere un utente per ID
 server.get('/users/:id', (req, res) => {
  const userId = req.params.id;

  console.log(`Request to get user with ID: ${userId}`);
  
  let userdb;
  try {
    userdb = readDatabase();
  } catch (error) {
    console.error('Error reading the database:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }

  const user = userdb.users.find(user => user.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json(user);
});


  



// Middleware per verificare il token
server.use((req, res, next) => {
  const token = req.cookies.token;
  console.log('Token from cookies:', token);

  if (token) {
    const verifyTokenResult = verifyToken(token);
    console.log('Token verification result:', verifyTokenResult);
    if (verifyTokenResult instanceof Error) {
      return res.status(401).json({ message: 'Access token not valid' });
    }
    next();
  } else {
    return res.status(401).json({ message: 'Access token not provided' });
  }
});



server.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;

  let userdb = readDatabase();
  const userIndex = userdb.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Se la password è presente nel body della richiesta, hashala
  if (updatedUser.password) {
    console.log('Hashing the new password');
    const hashedPassword = bcrypt.hashSync(updatedUser.password, 8);
    console.log('Hashed Password:', hashedPassword); 
    updatedUser.password = hashedPassword;
  }

  // Aggiorna i dati dell'utente (inclusa la password hashata se presente)
  const oldUserData = userdb.users[userIndex];
  userdb.users[userIndex] = { ...oldUserData, ...updatedUser };

  // Scrivi il database aggiornato
  try {
    writeDatabase(userdb);
    console.log('User updated successfully. Re-reading the database...');
    userdb = readDatabase();
    console.log('User updated successfully:', userdb.users[userIndex]);
    return res.status(200).json(userdb.users[userIndex]);
  } catch (error) {
    console.error('Error writing to the database:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
  



server.delete('/users/:id', (req, res)=>{
  const userId = req.params.id;
  console.log(`Request to delete user with ID: ${userId}`);
  let userDb;
  try{
   userDb = readDatabase();
  }catch(err){
    console.error('Error reading the database:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
  const userIndex = userDb.users.findIndex(user=>user.id === userId);
    // Rimuovi l'utente dal database
    userdb.users.splice(userIndex, 1);

    // Scrivi il database aggiornato
    try {
      writeDatabase(userdb);
      console.log('User deleted successfully');
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error writing to the database:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
})


//------------------------------sales-products-data----------------------
//-----------------------------------------------------------------------

server.get('/sales', (req, res) => {
  const salesdb = readDatabase();
  return res.json(salesdb.sales);
});
















//------------------------------sales-products-data----------------------
//-----------------------------------------------------------------------

server.use(router);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

