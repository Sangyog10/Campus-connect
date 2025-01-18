import { Router } from "express";
import {
  addMarks,
  updateInternlMark,
  getIndividualMarks,
  deleteInternalMarks,
} from "../controller/marksController.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = Router();

router.post("/add", authenticateUser, addMarks);
router.get("/my-marks", authenticateUser, getIndividualMarks);
router.put("/", authenticateUser, updateInternlMark);
router.delete("/", authenticateUser, deleteInternalMarks);

export default router;
