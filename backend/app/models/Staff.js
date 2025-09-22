import dbPromise from "../services/db.js";

export default class Staff {
  static async create(staffData) {
    const db = await dbPromise;
    const {
      staff_code, full_name, role, phone, email, address,
      salary, join_date, status, bank_details,
      emergency_contact, kyc_details, notes
    } = staffData;

    const result = await db.run(`
      INSERT INTO loan_management_staff_details (
        staff_code, full_name, role, phone, email, address,
        salary, join_date, status, bank_details,
        emergency_contact, kyc_details, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      staff_code, full_name, role, phone, email, address,
      salary, join_date, status, bank_details,
      emergency_contact, kyc_details, notes
    ]);

    return { id: result.lastID, ...staffData };
  }

  static async getAll() {
    const db = await dbPromise;
    return db.all("SELECT * FROM loan_management_staff_details ORDER BY created_at DESC");
  }

  static async getById(id) {
    const db = await dbPromise;
    return db.get("SELECT * FROM loan_management_staff_details WHERE id = ?", [id]);
  }

  static async update(id, staffData) {
    const db = await dbPromise;
    const {
      staff_code, full_name, role, phone, email, address,
      salary, join_date, status, bank_details,
      emergency_contact, kyc_details, notes
    } = staffData;

    const result = await db.run(`
      UPDATE loan_management_staff_details
      SET staff_code=?, full_name=?, role=?, phone=?, email=?, address=?,
          salary=?, join_date=?, status=?, bank_details=?,
          emergency_contact=?, kyc_details=?, notes=?, updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `, [
      staff_code, full_name, role, phone, email, address,
      salary, join_date, status, bank_details,
      emergency_contact, kyc_details, notes, id
    ]);

    return { updated: result.changes };
  }

  static async delete(id) {
    const db = await dbPromise;
    const result = await db.run("DELETE FROM loan_management_staff_details WHERE id = ?", [id]);
    return { deleted: result.changes };
  }
}

