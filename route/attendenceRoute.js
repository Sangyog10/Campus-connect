import {
  addAttendence,
  getAttendenceOfSubject,
  getSubjectAttendance,
} from "../controller/attendenceController.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/authenticateUser.js";
import { Router } from "express";

const router = Router();

router.get("/my-attendence", authenticateUser, getAttendenceOfSubject);

router.post(
  "/create-attendence",
  authenticateUser,
  authorizeRoles("teacher"),
  addAttendence
);

router.post(
  "/details",
  authenticateUser,
  authorizeRoles("teacher"),
  getSubjectAttendance
);

export default router;
