require('dotenv').config();

const express = require('express');
const session = require('express-session');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

const app = express();


connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(express.static('public'));
app.set('view engine', 'ejs');


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));


app.get('/', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/chat');
  }
  res.redirect('/login');
});


app.use('/', authRoutes);
app.use('/chat', chatRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});