import {
  addAttendence,
  getAttendenceOfSubject,
} from "../controller/attendenceController.js";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { Router } from "express";

const router = Router();

router.get("/my-attendence", authenticateUser, getAttendenceOfSubject);
router.post("/create-attendence", authenticateUser, addAttendence);

export default router;
