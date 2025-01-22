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

  const existingSubject = await prismaClient.subject.findUnique({
    where: {
      subjectCode_faculty_semester_section: {
        subjectCode,
        faculty,
        semester,
        section,
      },
    },
  });

  if (existingSubject) {
    const isTeacherAssigned = await prismaClient.subject.findFirst({
      where: {
        id: existingSubject.id,
        teachers: {
          some: { id: teacherId },
        },
      },
    });

    if (isTeacherAssigned) {
      return res.status(StatusCodes.OK).json({
        success: false,
        message:
          "This subject is already assigned to the teacher for this section.",
      });
    }

    await prismaClient.subject.update({
      where: {
        subjectCode_faculty_semester_section: {
          subjectCode,
          faculty,
          semester,
          section,
        },
      },
      data: {
        teachers: {
          connect: { id: teacherId },
        },
        teacherId: teacherId,
      },
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Teacher assigned to the existing subject for this section.",
    });
  }
  const subjectName = await prismaClient.subject.findFirst({
    where: { subjectCode },
  });

  await prismaClient.subject.create({
    data: {
      name: subjectName.name,
      subjectCode,
      faculty,
      semester,
      section,
      teacherId,
      teachers: {
        connect: { id: teacherId },
      },
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

  const subjects = await prismaClient.subject.findMany({
    where: {
      teachers: {
        some: { id: parseInt(teacherId) },
      },
    },
    select: {
      id: true,
      name: true,
      faculty: true,
      semester: true,
      subjectCode: true,
      section: true,
    },
  });

  if (subjects.length === 0) {
    throw new NotFoundError("No subjects found for this teacher.");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    subjects,
  });
};
export { assignSubjectToTeacher, getAllSubjectOfTeacher };
