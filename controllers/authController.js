const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const { getValidationErrors } = require('../middleware/validation');
function showAuth(req, res) { res.render('auth', { mode: req.query.mode === 'register' ? 'register' : 'login', errors: [], values: {} }); }
async function register(req, res) {
  const errors = getValidationErrors(req);
  const values = { name: req.body.name, email: req.body.email, role: req.body.role };
  if (errors.length) return res.status(400).render('auth', { mode: 'register', errors, values });
  const name = req.body.name.trim();
  const email = req.body.email.trim().toLowerCase();
  const role = req.body.role;
  if (userModel.findByEmail(email)) return res.status(409).render('auth', { mode: 'register', errors: [{ msg: 'An account with that email already exists.' }], values });
  const passwordHash = await bcrypt.hash(req.body.password, 12);
  const user = userModel.createUser({ name, email, passwordHash, role });
  req.session.regenerate(err => {
    if (err) return res.status(500).send('Unable to create session.');
    req.session.user = user;
    return res.redirect('/dashboard');
  });
}
async function login(req, res) {
  const errors = getValidationErrors(req);
  const values = { email: req.body.email };
  if (errors.length) return res.status(400).render('auth', { mode: 'login', errors, values });
  const email = req.body.email.trim().toLowerCase();
  const user = userModel.findByEmail(email);
  if (!user || !(await bcrypt.compare(req.body.password, user.password_hash))) return res.status(401).render('auth', { mode: 'login', errors: [{ msg: 'Invalid email or password.' }], values });
  req.session.regenerate(err => {
    if (err) return res.status(500).send('Unable to create session.');
    req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    return res.redirect('/dashboard');
  });
}
function logout(req, res) { req.session.destroy(() => { res.clearCookie('connect.sid'); res.redirect('/'); }); }
module.exports = { showAuth, register, login, logout };
