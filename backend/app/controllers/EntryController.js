import Entry from "../models/Entry.js";

export const addEntry = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const entry = await Entry.create(name);
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEntries = async (req, res) => {
  try {
    const entries = await Entry.getAll();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

