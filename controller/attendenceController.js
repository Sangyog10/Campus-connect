import { prismaClient } from "../db/connect.js";
import { StatusCodes } from "http-status-codes";
import {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../errors/index.js";

const addAttendence = async (req, res) => {
  const { date, attendanceData, subjectId } = req.body;
  const teacherId = req.user.userId;
  if (!date || !attendanceData || !subjectId) {
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

  const attendanceRecords = await Promise.all(
    attendanceData.map(async (record) => {
      return prismaClient.attendance.create({
        data: {
          date: new Date(date),
          present: record.present,
          teacherId,
          subjectId,
          studentId: record.studentId,
        },
      });
    })
  );
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Attendence addded successfully" });
};

//route to get the total attendence in each subject
const getAttendenceOfSubject = async (req, res) => {
  const studentId = req.user.userId;
  if (!studentId) {
    throw new UnauthenticatedError("Please login");
  }
  const student = await prismaClient.student.findUnique({
    where: { id: parseInt(studentId) },
  });

  if (!student) {
    throw new NotFoundError("Student not found");
  }
  const attendanceRecords = await prismaClient.attendance.findMany({
    where: { studentId: parseInt(studentId) },
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

export { addAttendence, getAttendenceOfSubject };
