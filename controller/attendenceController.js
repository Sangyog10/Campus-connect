import { prismaClient } from "../db/connect.js";
import { StatusCodes } from "http-status-codes";
import {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../errors/index.js";

const addAttendence = async (req, res) => {
  const { attendanceData, subjectId } = req.body;
  const teacherId = req.user.userId;
  if (!attendanceData || !subjectId) {
    throw new BadRequestError("Provide all credentials");
  }
  if (!teacherId) {
    throw new UnauthenticatedError("Please login");
  }
  const subjectAvailable = await prismaClient.subject.findUnique({
    where: { id: subjectId },
  });

  if (!subjectAvailable) {
    throw new NotFoundError("Subject with this id not found");
  }

  const date = new Date(Date.now());

  const attendanceRecords = await prismaClient.$transaction(
    attendanceData.map((record) => {
      if (!record.studentId || typeof record.present !== "boolean") {
        throw new BadRequestError("Invalid attendance record");
      }
      return prismaClient.attendance.create({
        data: {
          date,
          present: record.present,
          teacherId,
          subjectId,
          studentId: record.studentId,
        },
      });
    })
  );
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Attendance added successfully",
  });
};

//student route to get his/her attendence
const getAttendenceOfSubject = async (req, res) => {
  const studentId = req.user.userId;
  if (!studentId) {
    throw new UnauthenticatedError("Please login");
  }
  const student = await prismaClient.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    throw new NotFoundError("Student not found");
  }
  const attendanceRecords = await prismaClient.attendance.findMany({
    where: { studentId: studentId },
    include: {
      subject: true,
    },
  });
  const attendanceSummary = {};
  if (attendanceRecords && attendanceRecords.length > 0) {
    attendanceRecords.forEach((record) => {
      const subjectName = record.subject.name;

      if (!attendanceSummary[subjectName]) {
        attendanceSummary[subjectName] = {
          subject: subjectName,
          totalClasses: 0,
          attendedClasses: 0,
        };
      }

      attendanceSummary[subjectName].totalClasses += 1;
      if (record.present) {
        attendanceSummary[subjectName].attendedClasses += 1;
      }
    });
  }

  if (student.subjects && student.subjects.length > 0) {
    student.subjects.forEach((subject) => {
      const subjectName = subject.name;
      if (!attendanceSummary[subjectName]) {
        attendanceSummary[subjectName] = {
          subject: subjectName,
          totalClasses: 0,
          attendedClasses: 0,
        };
      }
    });
  }

  const formattedResponse = Object.values(attendanceSummary);

  const totalPresent = formattedResponse.reduce(
    (sum, subject) => sum + subject.attendedClasses,
    0
  );
  const totalDays = formattedResponse.reduce(
    (sum, subject) => sum + subject.totalClasses,
    0
  );

  res.status(200).json({
    success: true,
    message: "Attendance summary fetched successfully",
    attendanceSummary: formattedResponse,
    totalPresentClasses: totalPresent,
    totalClasses: totalDays,
  });
};

// route to get all the attendance details of the subject that a teacher teaches
const getSubjectAttendance = async (req, res) => {
  const teacherId = req.user.userId;
  const { subjectCode, section } = req.body;

  if (!teacherId) {
    throw new UnauthenticatedError("Please login.");
  }

  if (!subjectCode || !section) {
    throw new BadRequestError("Please provide subject code and section.");
  }

  const subject = await prismaClient.subject.findFirst({
    where: {
      subjectCode,
      section,
      teachers: {
        some: { id: teacherId },
      },
    },
    select: {
      id: true,
      name: true,
      faculty: true,
      semester: true,
      section: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (!subject) {
    throw new NotFoundError("The subject is not assigned to teacher");
  }

  const totalClasses = await prismaClient.attendance.groupBy({
    by: ["date", "teacherId", "subjectId"],
    where: {
      subjectId: subject.id,
      teacherId,
    },
  });

  const totalClassesConducted = totalClasses.length;

  const attendanceRecords = await prismaClient.attendance.groupBy({
    by: ["studentId"],
    where: {
      subjectId: subject.id,
      teacherId,
    },
    _count: {
      _all: true,
    },
  });

  const presentCounts = await prismaClient.attendance.groupBy({
    by: ["studentId"],
    where: {
      subjectId: subject.id,
      teacherId,
      present: true,
    },
    _count: {
      _all: true,
    },
  });

  const presentMap = presentCounts.reduce((map, record) => {
    map[record.studentId] = record._count._all;
    return map;
  }, {});

  const studentAttendance = await Promise.all(
    attendanceRecords.map(async (record) => {
      const student = await prismaClient.student.findUnique({
        where: { id: record.studentId },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      return {
        studentId: student.id,
        name: student.name,
        email: student.email,
        totalClassesAttended: presentMap[record.studentId] || 0,
        totalClassesConducted,
      };
    })
  );

  studentAttendance.sort((a, b) => a.name.localeCompare(b.name));

  res.status(StatusCodes.OK).json({
    success: true,
    subject: {
      name: subject.name,
      code: subjectCode,
      section: subject.section,
      semester: subject.semester,
      faculty: subject.faculty,
    },
    attendance: studentAttendance,
  });
};

export { addAttendence, getAttendenceOfSubject, getSubjectAttendance };
