import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = Router();
import {
  getAssignedEmployees,
  getALLprobation,
  getProbationById,
  updateProbation,
} from "../controllers/probationController.js";

//Fetching Assign Employees of particular manager
router.get("/getassignemployees", verifyToken, getAssignedEmployees);
router.get("/probationEnd", verifyToken, getALLprobation);
router.get("/:id", verifyToken, getProbationById);
router.put("/:id", verifyToken, updateProbation);

export default router;
