import { prismaClient } from "../db/connect.js";
import { StatusCodes } from "http-status-codes";
import {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} from "../errors/index.js";

const assignSubjectToTeacher = async (req, res) => {
  const { faculty, semester, section, subjectCode } = req.body;
  const teacherId = req.user.userId;

  if (!faculty || !semester || !section || !subjectCode) {
    throw new BadRequestError("Please provide all details");
  }
  if (!teacherId) {
    throw new UnauthenticatedError("Please login");
  }

  const teacher = await prismaClient.teacher.findUnique({
    where: { id: parseInt(teacherId) },
  });
  if (!teacher) {
    throw new NotFoundError("Teacher with the provided ID not found.");
  }

  const subject = await prismaClient.subject.findUnique({
    where: {
      subjectCode_faculty_semester: {
        subjectCode,
        faculty,
        semester,
      },
    },
  });
  if (!subject) {
    throw new NotFoundError(
      "Subject with the provided code, faculty, and semester not found."
    );
  }

  await prismaClient.subject.update({
    where: {
      subjectCode_faculty_semester: {
        subjectCode,
        faculty,
        semester,
      },
    },
    data: {
      teachers: {
        connect: { id: teacherId },
      },
      teacherId: teacherId,
      section: section,
    },
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Subject assigned to teacher successfully",
  });
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

  const subjects = teacher.subjects.map((subject) => ({
    ...subject,
    section: subject.section,
  }));
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, subjects: teacher.subjects });
};

export { assignSubjectToTeacher, getAllSubjectOfTeacher };
