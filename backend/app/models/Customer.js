import dbPromise from "../services/db.js";

export default class Customer {
  static async create(customerData) {
    const db = await dbPromise;
    const {
      customer_code,
      full_name,
      phone_primary,
      phone_secondary,
      phone_tertiary,
      email,
      address,
      kyc_details,
      bank_account_number,
      bank_ifsc_code,
      bank_name,
      bank_branch,
      parent_or_partner_name,
      co_applicant_name,
      co_applicant_details,
      status,
      notes
    } = customerData;

    const result = await db.run(
      `
      INSERT INTO loan_management_customers (
        customer_code, full_name, phone_primary, phone_secondary, phone_tertiary,
        email, address, kyc_details, bank_account_number, bank_ifsc_code,
        bank_name, bank_branch, parent_or_partner_name, co_applicant_name,
        co_applicant_details, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        customer_code,
        full_name,
        phone_primary,
        phone_secondary,
        phone_tertiary,
        email,
        address,
        kyc_details,
        bank_account_number,
        bank_ifsc_code,
        bank_name,
        bank_branch,
        parent_or_partner_name,
        co_applicant_name,
        co_applicant_details,
        status,
        notes
      ]
    );

    return { id: result.lastID, ...customerData };
  }

  static async getAll() {
    const db = await dbPromise;
    return db.all(
      "SELECT * FROM loan_management_customers ORDER BY created_at DESC"
    );
  }

  static async getById(id) {
    const db = await dbPromise;
    return db.get(
      "SELECT * FROM loan_management_customers WHERE id = ?",
      [id]
    );
  }

  static async update(id, customerData) {
    const db = await dbPromise;
    const {
      customer_code,
      full_name,
      phone_primary,
      phone_secondary,
      phone_tertiary,
      email,
      address,
      kyc_details,
      bank_account_number,
      bank_ifsc_code,
      bank_name,
      bank_branch,
      parent_or_partner_name,
      co_applicant_name,
      co_applicant_details,
      status,
      notes
    } = customerData;

    const result = await db.run(
      `
      UPDATE loan_management_customers
      SET customer_code=?, full_name=?, phone_primary=?, phone_secondary=?, phone_tertiary=?,
          email=?, address=?, kyc_details=?, bank_account_number=?, bank_ifsc_code=?,
          bank_name=?, bank_branch=?, parent_or_partner_name=?, co_applicant_name=?,
          co_applicant_details=?, status=?, notes=?, updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `,
      [
        customer_code,
        full_name,
        phone_primary,
        phone_secondary,
        phone_tertiary,
        email,
        address,
        kyc_details,
        bank_account_number,
        bank_ifsc_code,
        bank_name,
        bank_branch,
        parent_or_partner_name,
        co_applicant_name,
        co_applicant_details,
        status,
        notes,
        id
      ]
    );

    return { updated: result.changes };
  }

  static async delete(id) {
    const db = await dbPromise;
    const result = await db.run(
      "DELETE FROM loan_management_customers WHERE id = ?",
      [id]
    );
    return { deleted: result.changes };
  }

  static async setStatus(id, newStatus) {
    const db = await dbPromise;
    const result = await db.run(
      `UPDATE loan_management_customers SET status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
      [newStatus, id]
    );
    return { updated: result.changes };
  }
}


