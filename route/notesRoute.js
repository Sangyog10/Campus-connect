import { Router } from "express";
import { addNotes, getNotes } from "../controller/notesController.js";
import { multerConfig } from "../utils/multerConfig.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/authenticateUser.js";

const router = Router();
const upload = multerConfig();

router.post(
  "/add",
  authenticateUser,
  authorizeRoles("teacher"),
  upload.single("file"),
  addNotes
);
router.get("/my-notes", authenticateUser, getNotes);

export default router;
