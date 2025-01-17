import { prismaClient } from "../db/connect.js";
import { StatusCodes } from "http-status-codes";
import {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../errors/index.js";

//endpoint to add attendence by teacher
const addAttendence = async (req, res) => {};

//endpoint to get individual attendence of student
const getAttendence = async (req, res) => {};

export { addAttendence, getAttendence };
