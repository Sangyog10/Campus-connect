import { prismaClient } from "../db/connect.js";
import { StatusCodes } from "http-status-codes";
import {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../errors/index.js";

const addSubject = async (req, res) => {
  const { name, subjectCode, faculty, semester, section } = req.body;

  if (!subjectCode || !faculty || !semester || !name) {
    throw new BadRequestError("Please enter all details");
  }

  const isSubjectAdded = await prismaClient.subject.findFirst({
    where: {
      subjectCode,
      faculty,
      semester,
      section,
    },
  });

  if (isSubjectAdded) {
    throw new BadRequestError(
      "This subject has already been added to this section"
    );
  }

  const subject = await prismaClient.subject.create({
    data: {
      name,
      subjectCode,
      faculty,
      semester,
      section,
    },
  });

  res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "Added subject", data: subject });
};

/**
 * To fix:
 * Gives duplicate value of subject(assigned to section)
 * eg: EMX(AB secton) and EMX(CD section)
 */
const getSubjectsByFaculty = async (req, res) => {
  const { faculty, semester } = req.body;

  if (!faculty || !semester) {
    throw new BadRequestError("Faculty and semester are required");
  }

  const subjects = await prismaClient.subject.findMany({
    where: {
      faculty,
      semester,
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
    throw new NotFoundError("No subjects found, please add the subjects");
  }

  res.status(StatusCodes.OK).json({ success: true, subjects });
};

export { addSubject, getSubjectsByFaculty };
