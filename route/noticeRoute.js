import { Router } from "express";
import { addNotice, getNotice } from "../controller/noticeController.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/authenticateUser.js";

const router = Router();

router.post("/add", authenticateUser, authorizeRoles("teacher"), addNotice);
router.get("/my-notice", authenticateUser, getNotice);

export default router;
