import {
  getAllTeachers,
  getAllStudents,
  getAllStudentsBySection,
  getAllStudentsByFaculty,
  myDetails,
} from "../controller/userController.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/authenticateUser.js";
import { Router } from "express";

const router = Router();

router.get("/me", authenticateUser, myDetails);
router.post("/section", getAllStudentsBySection);
router.post("/faculty", getAllStudentsByFaculty);
router.get("/students", getAllStudents);
router.get("/teachers", getAllTeachers);

export default router;
