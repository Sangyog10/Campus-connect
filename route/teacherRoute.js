import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/authenticateUser.js";
import { Router } from "express";
import {
  assignSubjectToTeacher,
  getAllSubjectOfTeacher,
} from "../controller/teacherController.js";

const router = Router();

router.get(
  "/subjects",
  authenticateUser,
  authorizeRoles("teacher"),
  getAllSubjectOfTeacher
);
router.post(
  "/assign",
  authenticateUser,
  authorizeRoles("teacher"),
  assignSubjectToTeacher
);

export default router;
