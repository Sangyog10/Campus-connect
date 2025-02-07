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
router.post("/section", authenticateUser, getAllStudentsBySection);
router.post("/faculty", authenticateUser, getAllStudentsByFaculty);
router.get("/students", authenticateUser, getAllStudents);
router.get("/teachers", authenticateUser, getAllTeachers);

export default router;
