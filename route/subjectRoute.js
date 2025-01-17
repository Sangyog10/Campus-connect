import { authenticateUser } from "../middleware/authenticateUser.js";
import { Router } from "express";
import {
  addSubject,
  getSubjectsByFaculty,
} from "../controller/subjectController.js";

const router = Router();

router.post("/add", authenticateUser, addSubject);
router.post("/show", authenticateUser, getSubjectsByFaculty);

export default router;
