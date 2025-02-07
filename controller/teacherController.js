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
    where: { id: teacherId },
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
        some: { id: teacherId },
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

const deleteSubjectFromTeacher = async (req, res) => {
  const teacherId = req.user.userId;
  const { subjectCode, section, faculty, semester } = req.body;

  if (!teacherId) {
    throw new UnauthenticatedError("Please login");
  }

  if (!subjectCode || !section || !faculty || !semester) {
    throw new BadRequestError("Please provide all details");
  }

  const existingSubject = await prismaClient.subject.findFirst({
    where: {
      subjectCode,
      faculty,
      semester,
      section,
      teachers: {
        some: { id: teacherId },
      },
    },
    select: {
      id: true,
      teachers: true,
    },
  });

  if (!existingSubject) {
    throw new NotFoundError("Subject not assigned to this teacher.");
  }

  await prismaClient.subject.update({
    where: { id: existingSubject.id },
    data: {
      teachers: {
        disconnect: { id: teacherId },
      },
    },
  });

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Subject unassigned from the teacher successfully.",
  });
};

export {
  assignSubjectToTeacher,
  getAllSubjectOfTeacher,
  deleteSubjectFromTeacher,
};
