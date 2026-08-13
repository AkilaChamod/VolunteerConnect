const { db } = require('../database/database');
function findByStudentAndEvent(studentId, eventId) { return db.prepare('SELECT id FROM registrations WHERE student_id = ? AND event_id = ?').get(studentId, eventId); }
function createRegistration(studentId, eventId) { return db.prepare('INSERT INTO registrations (student_id, event_id) VALUES (?, ?)').run(studentId, eventId); }
module.exports = { findByStudentAndEvent, createRegistration };
