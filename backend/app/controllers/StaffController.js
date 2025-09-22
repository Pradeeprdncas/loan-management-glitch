import Staff from "../models/Staff.js";

export const addStaff = async (req, res) => {
  try {
    const {
      staff_code, full_name, role, phone, email, address,
      salary, join_date, status, bank_details,
      emergency_contact, kyc_details, notes
    } = req.body;

    if (!staff_code || !full_name || !role) {
      return res.status(400).json({ 
        error: "Staff code, full name, and role are required" 
      });
    }

    const staff = await Staff.create({
      staff_code, full_name, role, phone, email, address,
      salary, join_date, status, bank_details,
      emergency_contact, kyc_details, notes
    });

    res.status(201).json(staff);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: "Staff code already exists" });
    }
    res.status(500).json({ error: err.message });
  }
};

export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.getAll();
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await Staff.getById(id);
    
    if (!staff) {
      return res.status(404).json({ error: "Staff member not found" });
    }
    
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      staff_code, full_name, role, phone, email, address,
      salary, join_date, status, bank_details,
      emergency_contact, kyc_details, notes
    } = req.body;

    if (!staff_code || !full_name || !role) {
      return res.status(400).json({ 
        error: "Staff code, full name, and role are required" 
      });
    }

    const result = await Staff.update(id, {
      staff_code, full_name, role, phone, email, address,
      salary, join_date, status, bank_details,
      emergency_contact, kyc_details, notes
    });

    if (result.updated === 0) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    res.json({ message: "Staff member updated successfully", updated: result.updated });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: "Staff code already exists" });
    }
    res.status(500).json({ error: err.message });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Staff.delete(id);

    if (result.deleted === 0) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    res.json({ message: "Staff member deleted successfully", deleted: result.deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

