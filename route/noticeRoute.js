import { Router } from "express";
import { addNotice, getNotice } from "../controller/noticeController.js";
const router = Router();

router.get("/", getNotice);
router.post("/", addNotice);

export default router;
