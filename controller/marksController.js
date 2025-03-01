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
        marks: marks,
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
  const { subjectCode, section } = req.body;

  if (!teacherId) {
    throw new UnauthorizedError("Please login");
  }

  if (!subjectCode || !section) {
    throw new BadRequestError("Please provide subjectCode and section.");
  }

  const subject = await prismaClient.subject.findFirst({
    where: {
      subjectCode,
      section,
      teachers: {
        some: { id: teacherId },
      },
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (!subject) {
    throw new NotFoundError(
      "Subject with the given code and section is not assigned to this teacher."
    );
  }

  const internalMarks = await prismaClient.internalMarks.findMany({
    where: {
      teacherId,
      subjectId: subject.id,
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (internalMarks.length === 0) {
    throw new NotFoundError("No internal marks found for this subject.");
  }

  const formattedMarks = internalMarks.map((mark) => ({
    studentName: mark.student.name,
    studentEmail: mark.student.email,
    subjectName: subject.name,
    marks: mark.marks,
  }));

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Internal marks fetched successfully.",
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
