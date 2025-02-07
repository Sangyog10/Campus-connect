import { prismaClient } from "../db/connect.js";
import { StatusCodes } from "http-status-codes";
import {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../errors/index.js";
import { attachCookiesToResponse } from "../middleware/jwt.js";
import { hashPassword, verifyPassword } from "../utils/verify.js";

const registerTeacher = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!email || !password || !name || !phone) {
    throw new BadRequestError("All fields are required");
  }

  const emailExists = await prismaClient.teacher.findUnique({
    where: { email },
  });

  if (emailExists) {
    throw new BadRequestError("Account already exists");
  }

  const hashedPassword = await hashPassword(password);

  await prismaClient.teacher.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
    },
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Teacher registered successfully",
  });
};

const loginTeacher = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and Password are required");
  }

  const teacher = await prismaClient.teacher.findUnique({
    where: { email },
  });

  if (!teacher) {
    throw new BadRequestError("Teacher is not registered");
  }

  const isPasswordValid = await verifyPassword(password, teacher.password);

  if (!isPasswordValid) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const tokenUser = { id: teacher.id, email: teacher.email };
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Teacher logged in successfully",
  });
};

const registerStudent = async (req, res) => {
  const { name, email, phone, semester, section, faculty } = req.body;

  if (!name || !email || !phone || !semester || !section || !faculty) {
    throw new BadRequestError("All fields are required");
  }

  const emailExists = await prismaClient.student.findUnique({
    where: { email },
  });

  if (emailExists) {
    throw new BadRequestError("Account already exists");
  }

  const hashedPassword = await hashPassword(phone);

  await prismaClient.student.create({
    data: {
      name,
      email,
      phone,
      semester,
      section,
      faculty,
      password: hashedPassword,
    },
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Student registered successfully",
  });
};

const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and Password are required");
  }

  const student = await prismaClient.student.findUnique({
    where: { email },
  });

  if (!student) {
    throw new BadRequestError("Student is not registered");
  }

  const isPasswordValid = await verifyPassword(password, student.password);

  if (!isPasswordValid) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const tokenUser = { id: student.id, email: student.email };
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Student logged in successfully",
  });
};

export { registerStudent, registerTeacher, loginStudent, loginTeacher };
