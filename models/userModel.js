const { db } = require('../database/database');
function findByEmail(email) { return db.prepare('SELECT id, name, email, password_hash, role FROM users WHERE email = ?').get(email); }
function findById(id) { return db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(id); }
function createUser({ name, email, passwordHash, role }) {
  const result = db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)').run(name, email, passwordHash, role);
  return findById(result.lastInsertRowid);
}
module.exports = { findByEmail, findById, createUser };
