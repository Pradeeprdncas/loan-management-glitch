const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Serve React build folder
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Example API route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working!" });
});

// Send all other requests to React
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
