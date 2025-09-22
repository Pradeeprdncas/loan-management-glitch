const express = require("express");
const router = express.Router();
const staffController = require("../controllers/employeeController");

router.get("/", staffController.getAllStaff);
router.post("/", staffController.addStaff);
router.put("/:id", staffController.updateStaff);
router.delete("/:id", staffController.deleteStaff);

module.exports = router;
