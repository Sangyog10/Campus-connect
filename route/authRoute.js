import { Router } from "express";
import {
  registerStudent,
  registerTeacher,
  loginStudent,
  loginTeacher,
} from "../controller/authController.js";

const router = Router();

router.post("/teacher/register", registerTeacher);
router.post("/teacher/login", loginTeacher);
router.post("/student/register", registerStudent);
router.post("/student/login", loginStudent);

export default router;
