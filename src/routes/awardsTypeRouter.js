import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createAwards,
  getAllAward,
  getAwardbyId,
  updateAward,
  deleteAward,
} from "../controllers/awardsTypeController.js";
import multer from "multer";
import express from "express";

const app = express();
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/addAwards", verifyToken, upload.single("awardImage"), createAwards);
router.get("/awardTypes", verifyToken, getAllAward);
router.get("/:id", verifyToken, getAwardbyId);
router.put("/:id", verifyToken, updateAward);
router.delete("/:id", verifyToken, deleteAward);

export default router;
