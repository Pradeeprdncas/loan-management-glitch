import express from "express";
import { addEntry, getEntries } from "../app/controllers/EntryController.js";

const router = express.Router();

router.post("/", addEntry);
router.get("/", getEntries);

export default router;
