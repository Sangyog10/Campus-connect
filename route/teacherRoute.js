import { authenticateUser } from "../middleware/authenticateUser.js";
import { Router } from "express";
import {
  assignSubjectToTeacher,
  getAllSubjectOfTeacher,
} from "../controller/teacherController.js";

const router = Router();

router.get("/subjects", authenticateUser, getAllSubjectOfTeacher);
router.post("/assign", authenticateUser, assignSubjectToTeacher);

export default router;
