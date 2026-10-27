import { Router, Request, Response } from 'express';
import {
  attendanceData,
  homeworkData,
  studyNotesData,
  gradesData,
  studentsData,
  kitchenLabsData,
  AttendanceRecord,
  Homework,
  StudyNote,
  StudentGrade,
} from '../dataStore.js';

export const teacherRouter = Router();

/**
 * @swagger
 * /api/teacher/attendance:
 *   post:
 *     summary: 30-Second Rapid Daily Attendance Marking
 *     description: Submit entire class or culinary batch attendance in a single 30-second call.
 *     tags: [Teachers & Chef Instructors]
 */
teacherRouter.post('/attendance', (req: Request, res: Response) => {
  const { branchId, classOrBatch, date, records } = req.body;

  if (!branchId || !classOrBatch || !Array.isArray(records) || records.length === 0) {
    return res.status(400).json({
      error: 'Missing mandatory fields: branchId, classOrBatch, and records array are required.',
    });
  }

  const attendanceDate = date || new Date().toISOString().split('T')[0];
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;

  const createdRecords: AttendanceRecord[] = [];

  for (const item of records) {
    const student = studentsData.find((s) => s.id === item.studentId);
    const status: 'PRESENT' | 'ABSENT' | 'LATE' = item.status || 'PRESENT';

    if (status === 'PRESENT') presentCount++;
    else if (status === 'ABSENT') absentCount++;
    else if (status === 'LATE') lateCount++;

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      studentId: item.studentId,
      studentName: student ? student.name : item.studentName || 'Student',
      branchId,
      classOrBatch,
      date: attendanceDate,
      status,
      remarks: item.remarks,
    };

    attendanceData.unshift(newRecord);
    createdRecords.push(newRecord);

    // Update student's cumulative attendance percentage
    if (student) {
      const studentHistory = attendanceData.filter((a) => a.studentId === student.id);
      const totalDays = studentHistory.length;
      const attendedDays = studentHistory.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length;
      student.attendancePercent = totalDays > 0 ? Math.round((attendedDays / totalDays) * 100) : 100;
    }
  }

  res.status(201).json({
    message: 'Daily attendance marked successfully in 30 seconds!',
    date: attendanceDate,
    classOrBatch,
    summary: {
      totalMarked: records.length,
      presentCount,
      absentCount,
      lateCount,
    },
    records: createdRecords,
  });
});

/**
 * @swagger
 * /api/teacher/attendance:
 *   get:
 *     summary: Retrieve Daily Attendance Records
 *     description: Filter attendance history by date, class, or batch.
 *     tags: [Teachers & Chef Instructors]
 */
teacherRouter.get('/attendance', (req: Request, res: Response) => {
  const { date, classOrBatch, branchId } = req.query;
  let results = [...attendanceData];

  if (branchId) {
    results = results.filter((a) => a.branchId === branchId);
  }
  if (classOrBatch) {
    results = results.filter((a) => a.classOrBatch.toLowerCase().includes(String(classOrBatch).toLowerCase()));
  }
  if (date) {
    results = results.filter((a) => a.date === date);
  }

  res.json({
    total: results.length,
    attendance: results,
  });
});

/**
 * @swagger
 * /api/teacher/batches:
 *   get:
 *     summary: View Teacher Classes & Practical Kitchen Batches
 *     description: Retrieve schedule of assigned School classes and College kitchen labs.
 *     tags: [Teachers & Chef Instructors]
 */
teacherRouter.get('/batches', (_req: Request, res: Response) => {
  const schoolClasses = [
    { id: 'cls-7a', name: 'Class 7-A', subject: 'Mathematics & Science', studentsCount: 32, branchId: 'branch-sch-01' },
    { id: 'cls-8b', name: 'Class 8-B', subject: 'Social Studies & English', studentsCount: 28, branchId: 'branch-sch-01' },
  ];

  res.json({
    schoolClasses,
    collegeKitchenLabs: kitchenLabsData,
  });
});

/**
 * @swagger
 * /api/teacher/homework:
 *   post:
 *     summary: Assign Homework / Practical Tasks
 *     description: Create homework for school students or culinary assignments for hotel management students.
 *     tags: [Teachers & Chef Instructors]
 */
teacherRouter.post('/homework', (req: Request, res: Response) => {
  const { branchId, classOrBatch, subjectOrLab, title, description, dueDate, teacherName, attachments } = req.body;

  if (!branchId || !classOrBatch || !title || !dueDate) {
    return res.status(400).json({
      error: 'Missing mandatory fields: branchId, classOrBatch, title, and dueDate are required.',
    });
  }

  const newHomework: Homework = {
    id: `hw-${Date.now()}`,
    branchId,
    classOrBatch,
    subjectOrLab: subjectOrLab || 'General',
    title,
    description: description || '',
    dueDate,
    assignedDate: new Date().toISOString().split('T')[0],
    teacherName: teacherName || req.user?.name || 'Class Teacher / Chef Instructor',
    attachments: attachments || [],
  };

  homeworkData.unshift(newHomework);

  res.status(201).json({
    message: 'Homework assigned successfully!',
    homework: newHomework,
  });
});

/**
 * @swagger
 * /api/teacher/homework:
 *   get:
 *     summary: List Assigned Homework
 *     description: Retrieve assignments filtered by branch and class/batch.
 *     tags: [Teachers & Chef Instructors]
 */
teacherRouter.get('/homework', (req: Request, res: Response) => {
  const { branchId, classOrBatch } = req.query;
  let results = [...homeworkData];

  if (branchId) {
    results = results.filter((h) => h.branchId === branchId);
  }
  if (classOrBatch) {
    results = results.filter((h) => h.classOrBatch.toLowerCase().includes(String(classOrBatch).toLowerCase()));
  }

  res.json({
    total: results.length,
    homework: results,
  });
});

/**
 * @swagger
 * /api/teacher/notes:
 *   post:
 *     summary: Upload Study Notes & Kitchen Guides
 *     description: Publish study materials, revision summaries, and culinary recipe guides.
 *     tags: [Teachers & Chef Instructors]
 */
teacherRouter.post('/notes', (req: Request, res: Response) => {
  const { branchId, title, subjectOrLab, description, fileUrl, teacherName, tags } = req.body;

  if (!branchId || !title || !fileUrl) {
    return res.status(400).json({
      error: 'Missing mandatory fields: branchId, title, and fileUrl are required.',
    });
  }

  const newNote: StudyNote = {
    id: `note-${Date.now()}`,
    branchId,
    title,
    subjectOrLab: subjectOrLab || 'General',
    description: description || '',
    fileUrl,
    uploadedDate: new Date().toISOString().split('T')[0],
    teacherName: teacherName || req.user?.name || 'Faculty Member',
    tags: tags || [],
  };

  studyNotesData.unshift(newNote);

  res.status(201).json({
    message: 'Study notes / kitchen guide published successfully!',
    note: newNote,
  });
});

/**
 * @swagger
 * /api/teacher/notes:
 *   get:
 *     summary: List Study Notes & Guides
 *     description: Retrieve notes filtered by branch and subject/lab.
 *     tags: [Teachers & Chef Instructors]
 */
teacherRouter.get('/notes', (req: Request, res: Response) => {
  const { branchId, subjectOrLab } = req.query;
  let results = [...studyNotesData];

  if (branchId) {
    results = results.filter((n) => n.branchId === branchId);
  }
  if (subjectOrLab) {
    results = results.filter((n) => n.subjectOrLab.toLowerCase().includes(String(subjectOrLab).toLowerCase()));
  }

  res.json({
    total: results.length,
    notes: results,
  });
});

/**
 * @swagger
 * /api/teacher/marks:
 *   post:
 *     summary: Enter Student Marks & Culinary Grades
 *     description: Record academic examination marks or kitchen practical culinary scores.
 *     tags: [Teachers & Chef Instructors]
 */
teacherRouter.post('/marks', (req: Request, res: Response) => {
  const { studentId, examOrPracticalName, maxMarks, marksObtained, remarks, grade, subject, rollNo, classOrGrade } = req.body;

  if (!studentId || !examOrPracticalName || maxMarks === undefined || marksObtained === undefined) {
    return res.status(400).json({
      error: 'Missing mandatory fields: studentId, examOrPracticalName, maxMarks, and marksObtained are required.',
    });
  }

  const student = studentsData.find((s) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found.' });
  }

  const max = Number(maxMarks);
  const obtained = Number(marksObtained);
  const percent = max > 0 ? (obtained / max) * 100 : 0;

  // Auto-compute grade if not supplied
  const computedGrade =
    grade ||
    (percent >= 90
      ? 'A+'
      : percent >= 80
      ? 'A'
      : percent >= 70
      ? 'B+'
      : percent >= 60
      ? 'B'
      : percent >= 50
      ? 'C'
      : percent >= 35
      ? 'D'
      : 'F');

  const status = percent >= 35 ? 'PASS' : 'FAIL';

  // Check for existing grade record for this student + exam + subject for seamless reuse/update
  const existingIdx = gradesData.findIndex(
    (g) => g.studentId === student.id &&
           g.examOrPracticalName === examOrPracticalName &&
           (!subject || g.subject === subject)
  );

  const newGrade: StudentGrade = {
    id: existingIdx >= 0 ? gradesData[existingIdx].id : `grd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    studentId: student.id,
    studentName: student.name,
    rollNo: rollNo || student.rollNo,
    branchId: student.branchId,
    classOrGrade: classOrGrade || student.gradeOrSemester,
    examOrPracticalName,
    subject: subject || 'General',
    maxMarks: max,
    marksObtained: obtained,
    percentage: Number(percent.toFixed(1)),
    grade: computedGrade,
    status,
    remarks: remarks || (status === 'PASS' ? 'Good performance' : 'Needs improvement'),
    date: new Date().toISOString().split('T')[0],
  };

  if (existingIdx >= 0) {
    gradesData[existingIdx] = newGrade;
  } else {
    gradesData.unshift(newGrade);
  }

  res.status(201).json({
    message: 'Marks recorded successfully!',
    grade: newGrade,
  });
});

/**
 * @swagger
 * /api/teacher/marks/batch:
 *   post:
 *     summary: Bulk Marksheet Submission by Teacher
 *     description: Submit marks for an entire class roster in a single reusable marksheet operation.
 *     tags: [Teachers & Chef Instructors]
 */
teacherRouter.post('/marks/batch', (req: Request, res: Response) => {
  const { examOrPracticalName, subject, classOrGrade, maxMarks, passingMarks } = req.body;
  const records = req.body.records || req.body.entries;

  if (!examOrPracticalName || !records || !Array.isArray(records)) {
    return res.status(400).json({
      error: 'Missing mandatory fields: examOrPracticalName and records (or entries) array are required.',
    });
  }

  const savedGrades: StudentGrade[] = [];
  const max = Number(maxMarks) || 100;
  const pass = Number(passingMarks) || max * 0.35;

  for (const item of records) {
    if (!item.studentId || item.marksObtained === undefined || item.marksObtained === '') continue;

    const student = studentsData.find((s) => s.id === item.studentId);
    const studentName = item.studentName || student?.name || 'Student';
    const branchId = item.branchId || student?.branchId || 'branch-sch-01';
    const rollNo = item.rollNo || student?.rollNo || '';
    const classGrade = item.classOrGrade || student?.gradeOrSemester || classOrGrade || '';
    const obtained = Number(item.marksObtained);
    const percent = max > 0 ? (obtained / max) * 100 : 0;

    const computedGrade =
      item.grade ||
      (percent >= 90
        ? 'A+'
        : percent >= 80
        ? 'A'
        : percent >= 70
        ? 'B+'
        : percent >= 60
        ? 'B'
        : percent >= 50
        ? 'C'
        : percent >= 35
        ? 'D'
        : 'F');

    const status = obtained >= pass ? 'PASS' : 'FAIL';

    const existingIdx = gradesData.findIndex(
      (g) => g.studentId === item.studentId &&
             g.examOrPracticalName === examOrPracticalName &&
             (!subject || g.subject === subject)
    );

    const gradeRecord: StudentGrade = {
      id: existingIdx >= 0 ? gradesData[existingIdx].id : `grd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      studentId: item.studentId,
      studentName,
      rollNo,
      branchId,
      classOrGrade: classGrade,
      examOrPracticalName,
      subject: subject || item.subject || 'General',
      maxMarks: max,
      marksObtained: obtained,
      percentage: Number(percent.toFixed(1)),
      grade: computedGrade,
      status,
      remarks: item.remarks || (status === 'PASS' ? 'Good performance' : 'Needs improvement'),
      date: item.date || new Date().toISOString().split('T')[0],
    };

    if (existingIdx >= 0) {
      gradesData[existingIdx] = gradeRecord;
    } else {
      gradesData.unshift(gradeRecord);
    }
    savedGrades.push(gradeRecord);
  }

  res.status(201).json({
    message: `Marksheet for ${subject || examOrPracticalName} saved successfully! ${savedGrades.length} records processed.`,
    totalSaved: savedGrades.length,
    savedCount: savedGrades.length,
    grades: savedGrades,
  });
});

/**
 * @swagger
 * /api/teacher/marks:
 *   get:
 *     summary: View Student Marks & Evaluations
 *     description: Retrieve recorded marks filtered by studentId, branchId, exam, subject, or class.
 *     tags: [Teachers & Chef Instructors]
 */
teacherRouter.get('/marks', (req: Request, res: Response) => {
  const { studentId, branchId, examOrPracticalName, subject, classOrGrade } = req.query;
  let results = [...gradesData];

  if (studentId) {
    results = results.filter((g) => g.studentId === studentId);
  }
  if (branchId) {
    results = results.filter((g) => g.branchId === branchId);
  }
  if (examOrPracticalName) {
    results = results.filter((g) => g.examOrPracticalName.toLowerCase().includes(String(examOrPracticalName).toLowerCase()));
  }
  if (subject) {
    results = results.filter((g) => g.subject?.toLowerCase().includes(String(subject).toLowerCase()));
  }
  if (classOrGrade) {
    results = results.filter((g) => g.classOrGrade?.toLowerCase().includes(String(classOrGrade).toLowerCase()));
  }

  res.json({
    total: results.length,
    grades: results,
  });
});

/**
 * @swagger
 * /api/teacher/marks/{id}:
 *   delete:
 *     summary: Delete a Mark Record
 *     tags: [Teachers & Chef Instructors]
 */
teacherRouter.delete('/marks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = gradesData.findIndex((g) => g.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Mark record not found.' });
  }
  const [deleted] = gradesData.splice(index, 1);
  res.json({ message: 'Mark record deleted successfully', grade: deleted });
});
