import {
  addAttendence,
  getAttendence,
} from "../controller/attendenceController.js";
import { Router } from "express";

const router = Router();

router.get("/get", getAttendence);
router.post("/add", addAttendence);

export default router;
