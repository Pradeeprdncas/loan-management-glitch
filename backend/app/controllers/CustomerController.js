import Customer from "../models/Customer.js";

export const addCustomer = async (req, res) => {
  try {
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
      status = "pending",
      notes
    } = req.body;

    if (!customer_code || !full_name || !phone_primary) {
      return res.status(400).json({
        error: "Customer code, full name and phone_primary are required"
      });
    }

    const customer = await Customer.create({
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
    });

    res.status(201).json(customer);
  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed")) {
      return res.status(400).json({ error: "Customer code already exists" });
    }
    res.status(500).json({ error: err.message });
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.getAll();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.getById(id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customer_code,
      full_name,
      phone_primary
    } = req.body;

    if (!customer_code || !full_name || !phone_primary) {
      return res.status(400).json({
        error: "Customer code, full name and phone_primary are required"
      });
    }

    const result = await Customer.update(id, req.body);
    if (result.updated === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json({ message: "Customer updated successfully", updated: result.updated });
  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed")) {
      return res.status(400).json({ error: "Customer code already exists" });
    }
    res.status(500).json({ error: err.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Customer.delete(id);
    if (result.deleted === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json({ message: "Customer deleted successfully", deleted: result.deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const approveCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Customer.setStatus(id, "approved");
    if (result.updated === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json({ message: "Customer approved", updated: result.updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rejectCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Customer.setStatus(id, "rejected");
    if (result.updated === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json({ message: "Customer rejected", updated: result.updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


