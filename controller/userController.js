import { prismaClient } from "../db/connect.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors/index.js";

const myDetails = async (req, res) => {
  const { userId, role: userType } = req.user;

  if (!userId) {
    throw new UnauthenticatedError("Please log in");
  }

  let userDetails;

  if (userType === "teacher") {
    userDetails = await prismaClient.teacher.findUnique({
      where: { id: userId },
    });
  } else if (userType === "student") {
    userDetails = await prismaClient.student.findUnique({
      where: { id: userId },
    });
  } else {
    throw new UnauthenticatedError("Invalid user type");
  }

  if (!userDetails) {
    throw new NotFoundError("User not found");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: userDetails,
  });
};

const getAllStudents = async (req, res) => {
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
    orderBy: {
      name: "asc",
    },
  });

  if (!students.length) {
    throw new NotFoundError("No students found in the database");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    students,
  });
};

const getAllStudentsBySection = async (req, res) => {
  const { faculty, semester, section } = req.body;

  if (!faculty || !semester || !section) {
    throw new BadRequestError("Faculty, semester, and section are required");
  }

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
    orderBy: {
      name: "asc",
    },
  });

  if (!students.length) {
    throw new NotFoundError("No students found in the specified section");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    students,
  });
};

const getAllStudentsByFaculty = async (req, res) => {
  const { faculty, semester } = req.body;

  if (!faculty || !semester) {
    throw new BadRequestError("Faculty and semester are required");
  }

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
    orderBy: {
      name: "asc",
    },
  });

  if (!students.length) {
    throw new NotFoundError("No students found in the specified faculty");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    students,
  });
};

const getAllTeachers = async (req, res) => {
  const teachers = await prismaClient.teacher.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (!teachers.length) {
    throw new NotFoundError("No teachers found in the database");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    teachers,
  });
};

export {
  getAllTeachers,
  getAllStudents,
  getAllStudentsBySection,
  getAllStudentsByFaculty,
  myDetails,
};
