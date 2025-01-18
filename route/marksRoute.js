import { Router } from "express";
import {
  addMarks,
  updateInternlMark,
  getIndividualMarks,
  deleteInternalMarks,
} from "../controller/marksController.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/authenticateUser.js";

const router = Router();

router.post("/add", authenticateUser, authorizeRoles("teacher"), addMarks);
router.get("/my-marks", authenticateUser, getIndividualMarks);
router.put("/", authenticateUser, authorizeRoles("teacher"), updateInternlMark);
router.delete(
  "/",
  authenticateUser,
  authorizeRoles("teacher"),
  deleteInternalMarks
);

export default router;
