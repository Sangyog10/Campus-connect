import { prismaClient } from "../db/connect.js";
import { StatusCodes } from "http-status-codes";
import {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../errors/index.js";

/**
 * contains endpoints that gives the list of students and teacher
 */

const getAllstudents = async (req, res) => {
  res.send("students");
};

const getAllTeachers = async (req, res) => {
  res.send("teachers");
};

export { getAllTeachers, getAllstudents };
