import express from "express";
import { login } from "../controllers/authController.js";
import { createQuote, getQuotes, getQuoteById } from "../controllers/quoteController.js";
import { createUser } from "../controllers/userController.js";
import { upload } from "../middleware/upload.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/auth/login", login);
router.post("/users", createUser);

router.post("/quotes", requireAuth, upload.single("buildingImage"), createQuote);
router.get("/quotes", requireAuth, getQuotes);
router.get("/quotes/:id", requireAuth, getQuoteById);

export default router;
