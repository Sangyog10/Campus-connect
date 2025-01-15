import { prismaClient } from "../db/connect.js";
import { StatusCodes } from "http-status-codes";
import {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../errors/index.js";
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
  const student = await prismaClient.student.create({
    data: {
      name,
      email,
      phone,
      year,
      section,
      faculty,
      password: phone,
    },
  });
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "Student registered successfully" });
};

const loginTeacher = async (req, res) => {
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "Student logged in successfully" });
};

const loginStudent = async (req, res) => {
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "Student logged in successfully" });
};

export { registerStudent, registerTeacher, loginStudent, loginTeacher };
