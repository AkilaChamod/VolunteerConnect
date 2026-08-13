const express = require('express');
const path = require('path');
const session = require('express-session');
const helmet = require('helmet');
const { initialiseDatabase } = require('./database/database');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

initialiseDatabase();
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'development-only-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 3600000 }
}));
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
});
app.get('/', (req, res) => req.session.user ? res.redirect('/dashboard') : res.render('auth', { mode: 'login', errors: [], values: {} }));
app.use('/', authRoutes);
app.use('/events', eventRoutes);
app.use('/events', registrationRoutes);
app.use((req, res) => req.session.user ? res.redirect('/dashboard') : res.redirect('/'));
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`VolunteerConnect running at http://localhost:${port}`));
}
module.exports = app;
