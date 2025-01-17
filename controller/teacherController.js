import { prismaClient } from "../db/connect.js";
import { StatusCodes } from "http-status-codes";
import {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../errors/index.js";

/**
 * assigning subject that the teacher teaches
 */

const assignSubjectToTeacher = async (req, res) => {};

const getAllSubjectOfTeacher = async (req, res) => {};

export { assignSubjectToTeacher, getAllSubjectOfTeacher };
