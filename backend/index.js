const express = require("express");
const path = require("path");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- SQLite setup ---
let db;
(async () => {
  db = await sqlite.open({
    filename: path.join(__dirname, "database.db"),
    driver: sqlite3.Database
  });

  // Optional: create table if not exists
  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    )
  `);
})();

// --- API example ---
app.get("/api/test", async (req, res) => {
  const users = await db.all("SELECT * FROM users");
  res.json({ message: "Backend working!", users });
});

// --- Serve React build ---
app.use(express.static(path.join(__dirname, "../frontend/build")));

// --- Catch-all route for React Router ---
app.get(/^\/.*$/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// --- Start server ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
