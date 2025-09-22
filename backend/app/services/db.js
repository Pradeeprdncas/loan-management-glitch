import sqlite3 from "sqlite3";
import { open } from "sqlite";

// open the database
const dbPromise = open({
  filename: "./database.sqlite",
  driver: sqlite3.Database
});

// init tables if not exist
(async () => {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS loan_management_staff_details (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      staff_code TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      address TEXT,
      salary REAL,
      join_date DATE,
      status TEXT DEFAULT 'active',
      bank_details TEXT,
      emergency_contact TEXT,
      kyc_details TEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS loan_management_customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_code TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      phone_primary TEXT NOT NULL,
      phone_secondary TEXT,
      phone_tertiary TEXT,
      email TEXT,
      address TEXT,
      kyc_details TEXT,
      bank_account_number TEXT,
      bank_ifsc_code TEXT,
      bank_name TEXT,
      bank_branch TEXT,
      parent_or_partner_name TEXT,
      co_applicant_name TEXT,
      co_applicant_details TEXT,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
})();

export default dbPromise;
