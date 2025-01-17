import { prismaClient } from "../db/connect.js";
import { StatusCodes } from "http-status-codes";
import {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} from "../errors/index.js";

const assignSubjectToTeacher = async (req, res) => {
  const { subjectId } = req.body;
  const teacherId = req.user.userId;

  if (!subjectId) {
    throw new BadRequestError("Please provide all details");
  }
  if (!teacherId) {
    throw new UnauthenticatedError("Please login");
  }
  const teacher = await prismaClient.teacher.findUnique({
    where: { id: parseInt(teacherId) },
  });
  const subject = await prismaClient.subject.findUnique({
    where: { id: parseInt(subjectId) },
  });
  if (!teacher) {
    throw new NotFoundError("Teacher with this id not found");
  }
  if (!subject) {
    throw new NotFoundError("Subject with this id not found");
  }
  await prismaClient.teacher.update({
    where: { id: teacherId },
    data: {
      subjects: {
        connect: { id: subjectId },
      },
    },
  });
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "Subject added successfully" });
};

const getAllSubjectOfTeacher = async (req, res) => {
  const teacherId = req.user.userId;
  if (!teacherId) {
    throw new UnauthenticatedError("Please login");
  }
  const teacher = await prismaClient.teacher.findUnique({
    where: { id: parseInt(teacherId) },
    include: {
      subjects: true,
    },
  });

  if (!teacher) {
    throw new NotFoundError("No subjects found");
  }
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, subjects: teacher.subjects });
};

export { assignSubjectToTeacher, getAllSubjectOfTeacher };
