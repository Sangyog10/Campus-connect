import { prismaClient } from "../db/connect.js";
import { StatusCodes } from "http-status-codes";
import {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../errors/index.js";

const addMarks = async (req, res) => {};

const showAllMarks = async (req, res) => {};

const getIndividualMarks = async (req, res) => {};

export { addMarks, showAllMarks, getIndividualMarks };
