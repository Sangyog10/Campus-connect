import { prismaClient } from "../db/connect.js";
import { StatusCodes } from "http-status-codes";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../errors/index.js";

const addNotes = async (req, res) => {
  const { title, faculty, semester, section, subjectId } = req.body;
  const teacherId = req.user.userId;
  const file = req.file; //file from frontend

  if (!teacherId) {
    throw new UnauthorizedError("Please login");
  }
  if (!title || !semester || !section || !subjectId || !file || !faculty) {
    throw new BadRequestError("All fields are required");
  }

  const newNote = await prismaClient.notes.create({
    data: {
      title,
      file: file.path,
      semester,
      faculty,
      section,
      subjectId,
      teacherId,
    },
  });
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Note added successfully.",
  });
};

const getNotes = async (req, res) => {
  const studentId = req.user.userId;
  if (!studentId) {
    throw new UnauthorizedError("Please login");
  }
  const student = await prismaClient.student.findUnique({
    where: { id: studentId },
    select: {
      faculty: true,
      semester: true,
      section: true,
    },
  });

  if (!student) {
    throw new NotFoundError("Student not found");
  }

  const { semester, section, faculty } = student;

  const notes = await prismaClient.notes.findMany({
    where: {
      semester,
      section,
      faculty,
    },
    include: {
      subject: {
        select: { name: true },
      },
      teacher: {
        select: { name: true },
      },
    },
  });

  if (notes.length === 0) {
    return res.status(404).json({
      success: true,
      message: "No notes found for your semester and section.",
      data: [],
    });
  }

  const formattedNotes = notes.map((note) => ({
    id: note.id,
    title: note.title,
    fileUrl: note.file,
    subjectName: note.subject.name,
    teacherName: note.teacher.name,
    semester: note.semester,
    section: note.section,
  }));

  res.status(200).json({
    success: true,
    notes: formattedNotes,
  });
};

export { addNotes, getNotes };
