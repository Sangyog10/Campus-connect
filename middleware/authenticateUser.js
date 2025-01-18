import { UnauthenticatedError, UnauthorizedError } from "../errors/index.js";
import { isTokenValid } from "./jwt.js";
import { prismaClient } from "../db/connect.js";

const authenticateUser = async (req, res, next) => {
  let token = req.cookies.token;

  if (!token) {
    throw new UnauthenticatedError("Authentication failed, Please login");
  }
  try {
    const payload = await isTokenValid(token);

    const studentUser = await prismaClient.student.findUnique({
      where: { email: payload.email },
    });

    //student vetiyo
    if (studentUser) {
      req.user = {
        userId: payload.id,
        email: payload.email,
        role: studentUser.role,
      };
      return next();
    }
    const teacherUser = await prismaClient.teacher.findUnique({
      where: { email: payload.email },
    });

    //teacher vetiyo
    if (teacherUser) {
      req.user = {
        userId: payload.id,
        email: payload.email,
        role: teacherUser.role,
      };
      return next();
    }

    if (!studentUser || !teacherUser) {
      throw new UnauthenticatedError("User not found");
    }
    return next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError(
        "You do not have permission to perform this action"
      );
    }
    next();
  };
};

export { authenticateUser, authorizeRoles };
