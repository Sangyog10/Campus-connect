import { prismaClient } from "../db/connect.js";
import { StatusCodes } from "http-status-codes";
import {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../errors/index.js";

const addSubject = async (req, res) => {
  const { name, faculty, semester } = req.body;
  if (!name || !faculty || !semester) {
    throw new BadRequestError("Please enter all details");
  }
  const subjects = await prismaClient.subject.create({
    data: {
      name,
      faculty,
      semester,
    },
  });
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "Added subject" });
};

const getSubjectsByFaculty = async (req, res) => {
  const { faculty, semester } = req.body;
  if (!faculty || !semester) {
    throw new BadRequestError("Faculty and semester are required");
  }
  const subjects = await prismaClient.subject.findMany({
    where: {
      faculty,
      semester: parseInt(semester),
    },
    select: {
      id: true,
      name: true,
      faculty: true,
      semester: true,
    },
  });
  if (subjects.length === 0) {
    throw new NotFoundError("No books found , please add the books");
  }
  res.status(StatusCodes.OK).json({ success: true, subjects: subjects });
};

export { addSubject, getSubjectsByFaculty };
