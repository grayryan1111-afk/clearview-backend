import sqlite3 from "sqlite3";
sqlite3.verbose();

const db = new sqlite3.Database("./database.sqlite");

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clientName TEXT,
    propertyAddress TEXT,
    floors INTEGER,
    windowCount INTEGER,
    pricePerWindow REAL,
    gutterLength REAL,
    pricePerFootGutter REAL,
    totalPrice REAL,
    detectedWindows INTEGER,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
