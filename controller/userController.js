import { prismaClient } from "../db/connect.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/index.js";

const getAllstudents = async (req, res) => {
  const students = await prismaClient.student.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      semester: true,
      section: true,
      faculty: true,
    },
  });

  if (!students) {
    throw new BadRequestError("No students found in database");
  }
  res.status(StatusCodes.OK).json({ students });
};

const getAllstudentsBySection = async (req, res) => {
  const { faculty, semester, section } = req.body;

  const students = await prismaClient.student.findMany({
    where: { faculty, semester, section },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      semester: true,
      section: true,
      faculty: true,
    },
  });

  if (!students) {
    throw new BadRequestError("No students found in database");
  }
  res.status(StatusCodes.OK).json({ students });
};

const getAllstudentsByFaculty = async (req, res) => {
  const { faculty, semester } = req.body;

  const students = await prismaClient.student.findMany({
    where: { faculty, semester },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      semester: true,
      section: true,
      faculty: true,
    },
  });

  if (!students) {
    throw new BadRequestError("No students found in database");
  }
  res.status(StatusCodes.OK).json({ students });
};

const getAllTeachers = async (req, res) => {
  const teachers = await prismaClient.teacher.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  });
  if (!teachers) {
    throw new BadRequestError("No teachers found in database");
  }
  res.status(StatusCodes.OK).json({ teachers });
};

export {
  getAllTeachers,
  getAllstudents,
  getAllstudentsBySection,
  getAllstudentsByFaculty,
};
