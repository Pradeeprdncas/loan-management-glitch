import dbPromise from "../services/db.js";

export default class Entry {
  static async create(name) {
    const db = await dbPromise;
    const result = await db.run("INSERT INTO entries (name) VALUES (?)", [name]);
    return { id: result.lastID, name };
  }

  static async getAll() {
    const db = await dbPromise;
    return db.all("SELECT * FROM entries ORDER BY created_at DESC");
  }
}
