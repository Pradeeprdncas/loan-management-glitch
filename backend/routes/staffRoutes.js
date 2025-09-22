import express from "express";
import { 
  addStaff, 
  getAllStaff, 
  getStaffById, 
  updateStaff, 
  deleteStaff 
} from "../app/controllers/StaffController.js";

const router = express.Router();

// Staff CRUD routes
router.post("/", addStaff);
router.get("/", getAllStaff);
router.get("/:id", getStaffById);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);

export default router;

