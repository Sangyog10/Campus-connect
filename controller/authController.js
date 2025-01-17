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
    throw new BadRequestError("Enter all credentials");
  }
  const emailExists = await prismaClient.teacher.findFirst({
    where: {
      email,
    },
  });
  if (emailExists) {
    throw new BadRequestError("Account already exists");
  }

  const hashedPassword = await hashPassword(password);
  const teacher = await prismaClient.teacher.create({
    data: { name, email, password: hashedPassword, phone },
  });
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "Teacher registered successfully" });
};

const loginTeacher = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Email and Password is required");
  }
  const isTeacherPresent = await prismaClient.teacher.findUnique({
    where: {
      email,
    },
  });
  if (!isTeacherPresent) {
    throw new BadRequestError("Teacher is not registered");
  }
  const isCorrectPassword = await verifyPassword(
    password,
    isTeacherPresent.password
  );

  if (!isCorrectPassword) {
    throw new UnauthenticatedError("Please provide correct credentials");
  }

  //attach cookie
  const tokenUser = { id: isTeacherPresent.id, email: isTeacherPresent.email };
  attachCookiesToResponse({ res, user: tokenUser });

  res
    .status(StatusCodes.ACCEPTED)
    .json({ success: true, message: "Student logged in successfully" });
};

/**
 * phone number will be used as default password while registering student
 */
const registerStudent = async (req, res) => {
  const { name, email, phone, year, section, faculty } = req.body;
  if (!name || !email || !phone || !year || !section || !faculty) {
    throw new BadRequestError("Enter all credentials");
  }
  const emailExists = await prismaClient.student.findFirst({
    where: {
      email,
    },
  });
  if (emailExists) {
    throw new BadRequestError("Account already exists");
  }
  const hashedPassword = await hashPassword(phone);

  const student = await prismaClient.student.create({
    data: {
      name,
      email,
      phone,
      year,
      section,
      faculty,
      password: hashedPassword,
    },
  });
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "Student registered successfully" });
};

const loginStudent = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Email and Password is required");
  }
  const isStudentPresent = await prismaClient.student.findUnique({
    where: {
      email,
    },
  });
  if (!isStudentPresent) {
    throw new BadRequestError("Student is not registered");
  }
  const isCorrectPassword = await verifyPassword(
    password,
    isStudentPresent.password
  );
  if (!isCorrectPassword) {
    throw new UnauthenticatedError("Please provide correct credentials");
  }
  //attach cookie to response
  const tokenUser = { id: isStudentPresent.id, email: isStudentPresent.email };
  attachCookiesToResponse({ res, user: tokenUser });

  res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "Student logged in successfully" });
};

export { registerStudent, registerTeacher, loginStudent, loginTeacher };
