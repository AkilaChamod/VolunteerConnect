const { db } = require('../database/database');
function listUpcoming() {
  return db.prepare(`SELECT e.id, e.title, e.description, e.location, e.event_date, e.capacity,
    u.name AS charity_name,
    (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id) AS registered_count
    FROM events e JOIN users u ON u.id = e.charity_id
    WHERE datetime(e.event_date) >= datetime('now') ORDER BY datetime(e.event_date) ASC`).all();
}
function listByCharity(charityId) {
  return db.prepare(`SELECT e.id, e.title, e.description, e.location, e.event_date, e.capacity,
    (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id) AS registered_count
    FROM events e WHERE e.charity_id = ? ORDER BY datetime(e.event_date) ASC`).all(charityId);
}
function findById(eventId) {
  return db.prepare(`SELECT e.id, e.title, e.description, e.location, e.event_date, e.capacity,
    e.charity_id, u.name AS charity_name,
    (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id) AS registered_count
    FROM events e JOIN users u ON u.id = e.charity_id WHERE e.id = ?`).get(eventId);
}
function createEvent({ charityId, title, description, location, eventDate, capacity }) {
  const result = db.prepare(`INSERT INTO events (charity_id, title, description, location, event_date, capacity) VALUES (?, ?, ?, ?, ?, ?)`).run(charityId, title, description, location, eventDate, capacity);
  return findById(result.lastInsertRowid);
}
function listRegistrants(eventId) {
  return db.prepare(`SELECT u.name, u.email, r.registered_at FROM registrations r
    JOIN users u ON u.id = r.student_id WHERE r.event_id = ? ORDER BY datetime(r.registered_at) ASC`).all(eventId);
}
module.exports = { listUpcoming, listByCharity, findById, createEvent, listRegistrants };
