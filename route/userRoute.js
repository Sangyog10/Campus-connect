import {
  getAllTeachers,
  getAllstudents,
} from "../controller/userController.js";
import { Router } from "express";

const router = Router();

router.get("/students", getAllstudents);
router.get("/teachers", getAllTeachers);

export default router;
