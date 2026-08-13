const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const dbPath = path.join(__dirname, 'volunteerconnect.db');
const schemaPath = path.join(__dirname, 'schema.sql');
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');
function initialiseDatabase() { db.exec(fs.readFileSync(schemaPath, 'utf8')); }
module.exports = { db, initialiseDatabase, dbPath };
