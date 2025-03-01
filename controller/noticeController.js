import { prismaClient } from "../db/connect.js";
import { StatusCodes } from "http-status-codes";
import {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../errors/index.js";

const addNotice = async (req, res) => {
  const { title, description, faculty, semester, section, subjectId } =
    req.body;
  const teacherId = req.user.userId;

  if (
    !title ||
    !description ||
    !semester ||
    !section ||
    !subjectId ||
    !faculty
  ) {
    throw new NotFoundError("All fields are required");
  }

  const subject = await prismaClient.subject.findUnique({
    where: { id: subjectId },
  });

  if (!subject) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "Subject not found",
    });
  }

  const notice = await prismaClient.notice.create({
    data: {
      title,
      description,
      faculty,
      semester,
      section: section.toUpperCase(),
      subjectId: subjectId,
      teacherId: teacherId,
    },
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Notice created successfully",
  });
};

const getNotice = async (req, res) => {
  const userId = req.user.userId;
  if (!userId) {
    throw new UnauthenticatedError("Please login");
  }

  const student = await prismaClient.student.findUnique({
    where: { id: userId },
    select: {
      id: true,
      faculty: true,
      section: true,
      semester: true,
    },
  });

  if (!student) {
    throw new NotFoundError("Student not found");
  }

  const notices = await prismaClient.notice.findMany({
    where: {
      section: student.section,
      semester: student.semester,
      faculty: student.faculty,
    },
    include: {
      subject: {
        select: {
          name: true,
        },
      },
      teacher: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedNotices = notices.map((notice) => ({
    id: notice.id,
    title: notice.title,
    description: notice.description,
    semester: notice.semester,
    section: notice.section,
    subject: notice.subject.name,
    teacher: notice.teacher.name,
  }));

  res.status(StatusCodes.OK).json({
    success: true,
    notices: formattedNotices,
  });
};

export { addNotice, getNotice };
