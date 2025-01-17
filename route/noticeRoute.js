import { Router } from "express";
import { addNotice, getNotice } from "../controller/noticeController.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = Router();

router.get("/", getNotice);
router.post("/", addNotice);

export default router;
