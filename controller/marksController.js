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
        studentId: Number(studentId),
        subjectId: Number(subjectId),
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
        teacherId: Number(teacherId),
        subjectId: Number(subjectId),
        studentId: Number(studentId),
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
    where: { id: Number(studentId) },
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

const updateInternlMark = async (req, res) => {};

const deleteInternalMarks = async (req, res) => {};

export { addMarks, updateInternlMark, getIndividualMarks, deleteInternalMarks };
