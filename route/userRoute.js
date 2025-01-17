import {
  getAllTeachers,
  getAllstudents,
  getAllstudentsBySection,
  getAllstudentsByFaculty,
} from "../controller/userController.js";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { Router } from "express";

const router = Router();

router.post("/section", authenticateUser, getAllstudentsBySection);
router.post("/faculty", authenticateUser, getAllstudentsByFaculty);
router.get("/students", authenticateUser, getAllstudents);
router.get("/teachers", authenticateUser, getAllTeachers);

export default router;
