import { prismaClient } from "../db/connect.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";

const myDetails = async (req, res) => {
  const userId = req.user.userId;
  const userType = req.user.userType;

  if (!userId) {
    throw new UnauthenticatedError("please login");
  }
  let userDetails;

  if (userType === "teacher") {
    userDetails = await prisma.teacher.findUnique({
      where: { id: Number(userId) },
      include: {
        subjects: true,
      },
    });
  } else if (userType === "student") {
    userDetails = await prisma.student.findUnique({
      where: { id: Number(userId) },
      include: {
        subjects: true,
      },
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid user type.",
    });
  }

  if (!userDetails) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  res.status(200).json({
    success: true,
    message: "User details fetched successfully.",
    data: userDetails,
  });
};

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
  myDetails,
};
