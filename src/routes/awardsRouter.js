import { Router } from "express";
import { verifyToken, isManager } from "../middleware/authMiddleware.js";
import {
  getAssignedEmployees,
  nominate,
  getAllnominations,
  updateNomination,
  deleteNomination,
  getAllwinners,
  getNominationById,
} from "../controllers/awardsController.js";
import { getAllAward } from "../controllers/awardsTypeController.js";

const router = Router();

//Fetching Assign Employees of particular manager
router.get("/getassignemployees", verifyToken, isManager, getAssignedEmployees);

//Fetching Award Details
router.get("/getawards", getAllAward);

//Performing Nomination based on details provided
router.post("/addnomination", verifyToken, isManager, nominate);

//Fetching all nomination details
router.get("/getallnomination", getAllnominations);

//update Nomination
router.put("/:id", verifyToken, updateNomination);

//Delete nomination
router.delete("/:id", verifyToken, deleteNomination);

//Fetching all nomination winner details
router.get("/getallwinners", getAllwinners);

//Fetching nomination by id
router.get("/:id", getNominationById);

export default router;
