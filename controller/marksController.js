import { prismaClient } from "../db/connect.js";
import { StatusCodes } from "http-status-codes";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../errors/index.js";

const addMarks = async (req, res) => {
  const { marksData, subjectId } = req.body;
  const teacherId = req.user.userId;

  if (!teacherId) {
    throw new UnauthorizedError("Please login");
  }

  if (!marksData || !subjectId) {
    throw new BadRequestError(
      "Please provide all fields (marksData and subjectId)"
    );
  }

  const createdMarks = [];

  for (const { studentId, marks } of marksData) {
    const existingMarks = await prismaClient.internalMarks.findFirst({
      where: {
        studentId,
        subjectId,
      },
    });

    if (existingMarks) {
      throw new BadRequestError(
        `Marks for studentId ${studentId} and subjectId ${subjectId} already exist.`
      );
    }

    const newMarks = await prismaClient.internalMarks.create({
      data: {
        marks: Number(marks),
        teacherId,
        subjectId,
        studentId,
      },
    });
    createdMarks.push(newMarks);
  }

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Internal marks added successfully",
  });
};

const getIndividualMarks = async (req, res) => {
  const studentId = req.user.userId;
  if (!studentId) {
    throw new UnauthorizedError("Please login");
  }
  const student = await prismaClient.student.findUnique({
    where: { id: studentId },
    include: {
      internalMarks: {
        include: {
          subject: true,
        },
      },
    },
  });

  if (!student) {
    throw new NotFoundError("Student not found");
  }

  const marksSummary = student.internalMarks.map((mark) => ({
    subject: mark.subject.name,
    marks: mark.marks,
  }));

  res.status(StatusCodes.OK).json({
    success: true,
    data: marksSummary,
  });
};

const getInternalMarksAddedByTeacher = async (req, res) => {
  const teacherId = req.user.userId;

  if (!teacherId) {
    throw new UnauthorizedError("Please login");
  }

  const subjectsTaught = await prismaClient.subject.findMany({
    where: {
      teachers: {
        some: { id: teacherId },
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (subjectsTaught.length === 0) {
    throw new NotFoundError("No subjects assigned to this teacher.");
  }

  const subjectIds = subjectsTaught.map((subject) => subject.id);

  const internalMarks = await prismaClient.internalMarks.findMany({
    where: {
      teacherId,
      subjectId: {
        in: subjectIds,
      },
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      subject: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const formattedMarks = internalMarks.map((mark) => ({
    studentName: mark.student.name,
    studentEmail: mark.student.email,
    subjectName: mark.subject.name,
    marks: mark.marks,
  }));

  res.status(StatusCodes.OK).json({
    success: true,
    data: formattedMarks,
  });
};

const updateInternlMark = async (req, res) => {};

const deleteInternalMarks = async (req, res) => {};

export {
  addMarks,
  updateInternlMark,
  getIndividualMarks,
  deleteInternalMarks,
  getInternalMarksAddedByTeacher,
};
