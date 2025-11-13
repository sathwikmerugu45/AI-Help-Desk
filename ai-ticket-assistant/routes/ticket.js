import express from "express";
import { createTicket, getTicket, getTickets } from "../controllers/ticket.js";

const router = express.Router();

// ✅ Removed authenticate middleware
router.get("/", getTickets);
router.get("/:id", getTicket);
router.post("/", createTicket);

export default router;