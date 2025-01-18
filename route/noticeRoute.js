import { Router } from "express";
import { addNotice, getNotice } from "../controller/noticeController.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/authenticateUser.js";

const router = Router();

router.get("/", getNotice);
router.post("/", authorizeRoles("teacher"), addNotice);

export default router;
