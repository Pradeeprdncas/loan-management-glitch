import express from "express";
import {
  addCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  approveCustomer,
  rejectCustomer
} from "../app/controllers/CustomerController.js";

const router = express.Router();

router.post("/", addCustomer);
router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);
router.post("/:id/approve", approveCustomer);
router.post("/:id/reject", rejectCustomer);

export default router;


