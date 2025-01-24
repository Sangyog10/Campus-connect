import { Router } from "express";
import {
  addMarks,
  updateInternlMark,
  getIndividualMarks,
  deleteInternalMarks,
  getInternalMarksAddedByTeacher,
} from "../controller/marksController.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/authenticateUser.js";

const router = Router();

router.get("/my-marks", authenticateUser, getIndividualMarks);

router.post("/add", authenticateUser, authorizeRoles("teacher"), addMarks);
router.post(
  "/details",
  authenticateUser,
  authorizeRoles("teacher"),
  getInternalMarksAddedByTeacher
);
router.put("/", authenticateUser, authorizeRoles("teacher"), updateInternlMark);
router.delete(
  "/",
  authenticateUser,
  authorizeRoles("teacher"),
  deleteInternalMarks
);

export default router;
