import { Router } from "express";
import {
  getAllManagers,
  getAllUser,
  getAllReportees,
  deleteUser,
  updateUser,
  getUserById,
} from "../controllers/userController.js";
import { verifyToken, isManager } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/allManagers", getAllManagers);
router.get("/allUsers", getAllUser);
router.get("/allReportees", verifyToken, isManager, getAllReportees);

router.delete("/:id", verifyToken, deleteUser);
router.put("/:id", verifyToken, updateUser);
router.get("/:id", getUserById);

export default router;
