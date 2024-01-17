import { Router } from "express";
// import authMiddleware from "../middleware/authMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import authController from "../controllers/authController.js";

const router = Router();

router.post("/login", authController.login);
router.post("/register", verifyToken, authController.registerUser);
router.get("/profile", verifyToken, authController.UserProfile);
router.post("/refresh", authController.refToken);

export default router;
