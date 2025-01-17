import { Router } from "express";
import {
  addMarks,
  showAllMarks,
  getIndividualMarks,
} from "../controller/marksController.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = Router();

router.post("/", addMarks);
router.get("/", getIndividualMarks);
router.get("/", showAllMarks);

export default router;
