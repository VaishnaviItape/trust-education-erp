import test from 'node:test';
import assert from 'node:assert';
import { app } from '../app.js';
import { resetDataStore, branchesData } from '../dataStore.js';
import type { Server } from 'node:http';

let server: Server;
let baseUrl = '';

test.before(() => {
  return new Promise<void>((resolve) => {
    // Ephemeral port 0 prevents any port conflict
    server = app.listen(0, () => {
      const address = server.address();
      if (typeof address === 'object' && address !== null) {
        baseUrl = `http://localhost:${address.port}`;
      }
      resolve();
    });
  });
});

test.beforeEach(() => {
  resetDataStore();
});

test.after(() => {
  return new Promise<void>((resolve) => {
    if (server) {
      if (typeof server.closeAllConnections === 'function') {
        server.closeAllConnections();
      }
      server.close(() => resolve());
    } else {
      resolve();
    }
  });
});

// ============================================================================
// 1. Root & Swagger UI Tests
// ============================================================================
test('GET / returns HTML landing portal with Swagger links', async () => {
  const res = await fetch(`${baseUrl}/`);
  assert.strictEqual(res.status, 200);
  const text = await res.text();
  assert.match(text, /Trust Education ERP/);
  assert.match(text, /\/api-docs/);
});

test('GET /api-docs returns Swagger UI page', async () => {
  const res = await fetch(`${baseUrl}/api-docs/`);
  assert.ok(res.status === 200 || res.status === 301);
});

test('GET /api/docs.json returns complete OpenAPI 3.0 specification', async () => {
  const res = await fetch(`${baseUrl}/api/docs.json`);
  assert.strictEqual(res.status, 200);
  const spec = await res.json();
  assert.strictEqual(spec.openapi, '3.0.3');
  assert.strictEqual(spec.info.title, 'Zep Foundation Bhose - ERP REST API');
  assert.ok(spec.paths['/api/superadmin/overview']);
  assert.ok(spec.paths['/api/branch-admin/overview']);
  assert.ok(spec.paths['/api/teacher/attendance']);
  assert.ok(spec.paths['/api/parent/fees/pay-upi']);
  assert.ok(spec.paths['/api/student/kitchen-rosters']);
  assert.ok(spec.paths['/api/driver/route/start']);
});

// ============================================================================
// 2. Health & Public Enquiries Tests
// ============================================================================
test('GET /api/health returns ONLINE status with Trust Education brand color', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.status, 'ONLINE');
  assert.strictEqual(data.brandColor, '#EA580C');
});

test('GET /api/enquiries returns admission inquiries list', async () => {
  const res = await fetch(`${baseUrl}/api/enquiries`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data.enquiries));
  assert.ok(data.enquiries.length > 0);
});

test('POST /api/enquiries submits a prospective student enquiry', async () => {
  const payload = {
    applicantName: 'Vikram Seth',
    parentName: 'Anil Seth',
    phone: '+91 98888 11111',
    targetBranch: 'COLLEGE',
    targetClassOrCourse: 'BHM Culinary Specialization',
  };
  const res = await fetch(`${baseUrl}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  assert.strictEqual(res.status, 201);
  const data = await res.json();
  assert.strictEqual(data.enquiry.applicantName, 'Vikram Seth');
  assert.strictEqual(data.enquiry.status, 'NEW');
});

test('POST /api/enquiries handles missing optional body fields with defaults', async () => {
  const res = await fetch(`${baseUrl}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.strictEqual(res.status, 201);
  const data = await res.json();
  assert.strictEqual(data.enquiry.applicantName, 'Prospective Student');
});

test('PATCH /api/enquiries/:id updates enquiry status and counselor notes', async () => {
  // First create a new enquiry
  const createRes = await fetch(`${baseUrl}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      applicantName: 'Test Student For Update',
      phone: '+91 91111 22222',
      targetBranch: 'SCHOOL',
      targetClassOrCourse: 'STD 9 CBSE',
    }),
  });
  assert.strictEqual(createRes.status, 201);
  const created = await createRes.json();
  const enquiryId = created.enquiry.id;

  // Update status and counselor notes
  const patchRes = await fetch(`${baseUrl}/api/enquiries/${enquiryId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'CONTACTED',
      counselorNotes: 'Parent requested callback on Sunday 10am',
    }),
  });
  assert.strictEqual(patchRes.status, 200);
  const patched = await patchRes.json();
  assert.strictEqual(patched.enquiry.status, 'CONTACTED');
  assert.strictEqual(patched.enquiry.counselorNotes, 'Parent requested callback on Sunday 10am');
});

test('DELETE /api/enquiries/:id removes enquiry from system', async () => {
  const createRes = await fetch(`${baseUrl}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ applicantName: 'To Be Deleted' }),
  });
  const created = await createRes.json();
  const idToDelete = created.enquiry.id;

  const deleteRes = await fetch(`${baseUrl}/api/enquiries/${idToDelete}`, {
    method: 'DELETE',
  });
  assert.strictEqual(deleteRes.status, 200);
  const delData = await deleteRes.json();
  assert.strictEqual(delData.deletedId, idToDelete);

  // Subsequent GET should return 404
  const getRes = await fetch(`${baseUrl}/api/enquiries/${idToDelete}`);
  assert.strictEqual(getRes.status, 404);
});

test('GET /api/bus/tracking returns bus route details', async () => {
  const res = await fetch(`${baseUrl}/api/bus/tracking`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.route.busNumber, 'MH-12-TR-4421');
});

test('POST /api/bus/simulate-step moves bus coordinates', async () => {
  const res = await fetch(`${baseUrl}/api/bus/simulate-step`, { method: 'POST' });
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.message, 'Bus position simulated');
  assert.ok(data.route.currentSpeed > 0);
});

test('GET /api/hotel-mgmt/overview returns culinary labs, internships, and chef toolkits', async () => {
  const res = await fetch(`${baseUrl}/api/hotel-mgmt/overview`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.ok(data.kitchenLabs.length > 0);
  assert.ok(data.internships.length > 0);
  assert.ok(data.chefKitInventory.length > 0);
});

// ============================================================================
// 3. Authentication & Role Switcher Tests
// ============================================================================
test('POST /api/auth/login authenticates Superadmin', async () => {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'SUPERADMIN' }),
  });
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.user.role, 'SUPERADMIN');
  assert.strictEqual(data.user.allowedWebLogin, true);
  assert.strictEqual(data.user.allowedMobileLogin, false);
});

test('POST /api/auth/login authenticates Branch Admins for School and College', async () => {
  const resSchool = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'BRANCH_ADMIN_SCHOOL' }),
  });
  const dataSchool = await resSchool.json();
  assert.strictEqual(dataSchool.user.branchId, 'branch-sch-01');

  const resCollege = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'BRANCH_ADMIN_COLLEGE' }),
  });
  const dataCollege = await resCollege.json();
  assert.strictEqual(dataCollege.user.branchId, 'branch-hm-01');
});

test('POST /api/auth/login authenticates Teacher, Parent, Student, and Driver', async () => {
  for (const role of ['TEACHER', 'PARENT', 'STUDENT', 'BUS_DRIVER']) {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.user.role, role);
    assert.strictEqual(data.user.allowedMobileLogin, true);
  }
});

test('POST /api/auth/login fallback for unknown role', async () => {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.user.role, 'SUPERADMIN');
});

test('GET /api/auth/me returns parsed user context from token or header', async () => {
  const res = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { Authorization: 'Bearer demo-jwt-token-for-TEACHER' },
  });
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.user.role, 'TEACHER');
});

// ============================================================================
// 4. Superadmin (Trustee / President) Tests
// ============================================================================
test('GET /api/superadmin/overview returns master visibility metrics', async () => {
  const res = await fetch(`${baseUrl}/api/superadmin/overview`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.trust.name, 'Zep Foundation Bhose');
  assert.ok(data.trust.totalCollected > 0);
  assert.ok(data.trust.totalPending > 0);
  assert.ok(data.trust.totalStudents > 0);
  assert.strictEqual(data.systemStatus.portalAccess, 'WEB_ONLY_MASTER');
});

test('GET /api/superadmin/branches provides comparative School vs College analytics', async () => {
  const res = await fetch(`${baseUrl}/api/superadmin/branches`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.branches.length, 2);
  const school = data.branches.find((b: any) => b.type === 'SCHOOL');
  const college = data.branches.find((b: any) => b.type === 'COLLEGE');
  assert.ok(school);
  assert.ok(college);
  assert.ok(school.feesCollected >= 0);
  assert.ok(college.feesCollected >= 0);
});

test('GET /api/superadmin/financial-ledger provides full audit trail with filters', async () => {
  // Global
  const resAll = await fetch(`${baseUrl}/api/superadmin/financial-ledger`);
  assert.strictEqual(resAll.status, 200);
  const dataAll = await resAll.json();
  assert.ok(dataAll.totalTransactions > 0);
  assert.ok(dataAll.totalAmount > 0);

  // Filter by UPI
  const resUpi = await fetch(`${baseUrl}/api/superadmin/financial-ledger?paymentMode=UPI`);
  assert.strictEqual(resUpi.status, 200);
  const dataUpi = await resUpi.json();
  for (const r of dataUpi.receipts) {
    assert.strictEqual(r.paymentMode, 'UPI');
  }

  // Filter by Branch
  const resBranch = await fetch(`${baseUrl}/api/superadmin/financial-ledger?branchId=branch-sch-01`);
  assert.strictEqual(resBranch.status, 200);
  const dataBranch = await resBranch.json();
  for (const r of dataBranch.receipts) {
    assert.match(r.branchName, /Modern/i);
  }
});

test('GET /api/superadmin/students searches students across all branches', async () => {
  const resAll = await fetch(`${baseUrl}/api/superadmin/students`);
  assert.strictEqual(resAll.status, 200);
  const dataAll = await resAll.json();
  assert.ok(dataAll.total >= 6);

  const resSearch = await fetch(`${baseUrl}/api/superadmin/students?search=aarav`);
  assert.strictEqual(resSearch.status, 200);
  const dataSearch = await resSearch.json();
  assert.strictEqual(dataSearch.total, 1);
  assert.strictEqual(dataSearch.students[0].name, 'Aarav Sharma');

  const resBranch = await fetch(`${baseUrl}/api/superadmin/students?branchId=branch-hm-01`);
  assert.strictEqual(resBranch.status, 200);
  const dataBranch = await resBranch.json();
  for (const s of dataBranch.students) {
    assert.strictEqual(s.branchId, 'branch-hm-01');
  }
});

// ============================================================================
// 5. Branch Admin (Strict Isolation) Tests
// ============================================================================
test('GET /api/branch-admin/overview returns isolated stats for authorized branch', async () => {
  const res = await fetch(`${baseUrl}/api/branch-admin/overview`, {
    headers: { 'X-Branch-Id': 'branch-sch-01' },
  });
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.branch.id, 'branch-sch-01');
  assert.strictEqual(data.isolationStatus, 'STRICT_BRANCH_ISOLATION_ENFORCED');
  assert.strictEqual(data.accessLevel, 'WEB_LOGIN_ONLY');
});

test('GET /api/branch-admin/overview enforces 400 when branch header/param is missing', async () => {
  const res = await fetch(`${baseUrl}/api/branch-admin/overview`);
  assert.strictEqual(res.status, 400);
  const data = await res.json();
  assert.match(data.error, /Branch identification required/);
});

test('GET /api/branch-admin/overview returns 404 for unknown branch ID', async () => {
  const res = await fetch(`${baseUrl}/api/branch-admin/overview`, {
    headers: { 'X-Branch-Id': 'branch-unknown-999' },
  });
  assert.strictEqual(res.status, 404);
});

test('STRICT ISOLATION: School Admin cannot access College branch overview (403 Forbidden)', async () => {
  const res = await fetch(`${baseUrl}/api/branch-admin/overview?branchId=branch-hm-01`, {
    headers: { 'X-Branch-Id': 'branch-sch-01' },
  });
  assert.strictEqual(res.status, 403);
  const data = await res.json();
  assert.match(data.error, /Strict branch isolation in effect/);
});

test('GET /api/branch-admin/students returns only branch-isolated students', async () => {
  const res = await fetch(`${baseUrl}/api/branch-admin/students`, {
    headers: { 'X-Branch-Id': 'branch-sch-01' },
  });
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  for (const s of data.students) {
    assert.strictEqual(s.branchId, 'branch-sch-01');
  }

  // With search filter
  const resSearch = await fetch(`${baseUrl}/api/branch-admin/students?search=ananya`, {
    headers: { 'X-Branch-Id': 'branch-sch-01' },
  });
  assert.strictEqual(resSearch.status, 200);
  const dataSearch = await resSearch.json();
  assert.strictEqual(dataSearch.total, 1);
  assert.strictEqual(dataSearch.students[0].name, 'Ananya Patel');
});

test('POST /api/branch-admin/students admits student within branch', async () => {
  const payload = {
    name: 'Kavita Iyer',
    gender: 'FEMALE',
    gradeOrSemester: 'Class 6-B',
    parentName: 'Sundar Iyer',
    parentPhone: '+91 97777 22222',
    feeTotal: 36000,
  };
  const res = await fetch(`${baseUrl}/api/branch-admin/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Branch-Id': 'branch-sch-01',
    },
    body: JSON.stringify(payload),
  });
  assert.strictEqual(res.status, 201);
  const data = await res.json();
  assert.strictEqual(data.student.name, 'Kavita Iyer');
  assert.match(data.student.admissionNo, /^SCH-2026-/);
});

test('POST /api/branch-admin/students creates College admission with specialization', async () => {
  const payload = {
    name: 'Sameer Sen',
    gender: 'MALE',
    gradeOrSemester: 'BHM Semester 1',
    hotelSpecialization: 'Bakery Arts',
  };
  const res = await fetch(`${baseUrl}/api/branch-admin/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Branch-Id': 'branch-hm-01',
    },
    body: JSON.stringify(payload),
  });
  assert.strictEqual(res.status, 201);
  const data = await res.json();
  assert.strictEqual(data.student.name, 'Sameer Sen');
  assert.match(data.student.admissionNo, /^HM-2026-/);
  assert.strictEqual(data.student.hotelSpecialization, 'Bakery Arts');
});

test('POST /api/branch-admin/students returns 400 for missing mandatory name or grade', async () => {
  const res = await fetch(`${baseUrl}/api/branch-admin/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Branch-Id': 'branch-sch-01',
    },
    body: JSON.stringify({ parentName: 'Incomplete Record' }),
  });
  assert.strictEqual(res.status, 400);
});

test('GET /api/branch-admin/fees returns isolated receipts for branch', async () => {
  const res = await fetch(`${baseUrl}/api/branch-admin/fees`, {
    headers: { 'X-Branch-Id': 'branch-sch-01' },
  });
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.branchId, 'branch-sch-01');
  assert.ok(data.totalTransactions > 0);
});

test('POST /api/branch-admin/fees/collect records fee for branch student', async () => {
  const payload = {
    studentId: 'stu-s01',
    amount: 3000,
    paymentMode: 'CASH',
  };
  const res = await fetch(`${baseUrl}/api/branch-admin/fees/collect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Branch-Id': 'branch-sch-01',
    },
    body: JSON.stringify(payload),
  });
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.receipt.studentName, 'Aarav Sharma');
  assert.strictEqual(data.receipt.amount, 3000);
  assert.strictEqual(data.studentBalance.paid, 27000);
});

test('POST /api/branch-admin/fees/collect handles errors (missing fields, 404 student, cross-branch 403)', async () => {
  // Missing fields
  const resMissing = await fetch(`${baseUrl}/api/branch-admin/fees/collect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Branch-Id': 'branch-sch-01' },
    body: JSON.stringify({}),
  });
  assert.strictEqual(resMissing.status, 400);

  // Student not found
  const resNotFound = await fetch(`${baseUrl}/api/branch-admin/fees/collect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Branch-Id': 'branch-sch-01' },
    body: JSON.stringify({ studentId: 'stu-fake', amount: 500 }),
  });
  assert.strictEqual(resNotFound.status, 404);

  // Cross-branch attempt: School admin attempts to collect fee for College student (stu-hm01)
  const resCross = await fetch(`${baseUrl}/api/branch-admin/fees/collect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Branch-Id': 'branch-sch-01' },
    body: JSON.stringify({ studentId: 'stu-hm01', amount: 500 }),
  });
  assert.strictEqual(resCross.status, 403);
  const dataCross = await resCross.json();
  assert.match(dataCross.error, /Cannot modify financials for student of another branch/);
});

// ============================================================================
// 6. Teachers / Chef Instructors Tests
// ============================================================================
test('POST /api/teacher/attendance marks daily attendance in 30 seconds', async () => {
  const payload = {
    branchId: 'branch-sch-01',
    classOrBatch: 'Class 7-A',
    date: '2026-10-22',
    records: [
      { studentId: 'stu-s01', status: 'PRESENT' },
      { studentId: 'stu-s02', status: 'PRESENT' },
      { studentId: 'stu-s03', status: 'ABSENT', remarks: 'Fever' },
    ],
  };
  const res = await fetch(`${baseUrl}/api/teacher/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  assert.strictEqual(res.status, 201);
  const data = await res.json();
  assert.strictEqual(data.summary.totalMarked, 3);
  assert.strictEqual(data.summary.presentCount, 2);
  assert.strictEqual(data.summary.absentCount, 1);
  assert.match(data.message, /in 30 seconds/i);
});

test('POST /api/teacher/attendance validates mandatory payload', async () => {
  const res = await fetch(`${baseUrl}/api/teacher/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ branchId: 'branch-sch-01' }),
  });
  assert.strictEqual(res.status, 400);
});

test('GET /api/teacher/attendance filters records by date, class, and branch', async () => {
  const res = await fetch(`${baseUrl}/api/teacher/attendance?classOrBatch=Class 7-A&branchId=branch-sch-01`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.ok(data.total >= 2);
});

test('GET /api/teacher/batches returns assigned classes and culinary labs', async () => {
  const res = await fetch(`${baseUrl}/api/teacher/batches`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.ok(data.schoolClasses.length > 0);
  assert.ok(data.collegeKitchenLabs.length > 0);
});

test('POST & GET /api/teacher/homework assigns and retrieves homework', async () => {
  const payload = {
    branchId: 'branch-sch-01',
    classOrBatch: 'Class 7-A',
    subjectOrLab: 'Science',
    title: 'Photosynthesis Plant Lab Observation',
    description: 'Document chlorophyll extraction experiment with photos.',
    dueDate: '2026-10-28',
  };
  const resPost = await fetch(`${baseUrl}/api/teacher/homework`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  assert.strictEqual(resPost.status, 201);
  const dataPost = await resPost.json();
  assert.strictEqual(dataPost.homework.title, 'Photosynthesis Plant Lab Observation');

  // Validation failure
  const resBad = await fetch(`${baseUrl}/api/teacher/homework`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.strictEqual(resBad.status, 400);

  // List homework
  const resGet = await fetch(`${baseUrl}/api/teacher/homework?branchId=branch-sch-01&classOrBatch=Class 7-A`);
  assert.strictEqual(resGet.status, 200);
  const dataGet = await resGet.json();
  assert.ok(dataGet.total > 0);
});

test('POST & GET /api/teacher/notes uploads and retrieves study notes', async () => {
  const payload = {
    branchId: 'branch-hm-01',
    title: 'Garde Manger & Cold Kitchen Fundamentals',
    subjectOrLab: 'Food Production',
    description: 'Pâtés, terrines, canapés and salad dressing ratios.',
    fileUrl: 'https://trust-erp.local/notes/garde_manger.pdf',
    tags: ['Culinary', 'Cold Kitchen'],
  };
  const resPost = await fetch(`${baseUrl}/api/teacher/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  assert.strictEqual(resPost.status, 201);

  // Validation failure
  const resBad = await fetch(`${baseUrl}/api/teacher/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.strictEqual(resBad.status, 400);

  // List notes
  const resGet = await fetch(`${baseUrl}/api/teacher/notes?branchId=branch-hm-01&subjectOrLab=Food Production`);
  assert.strictEqual(resGet.status, 200);
  const dataGet = await resGet.json();
  assert.ok(dataGet.total > 0);
});

test('POST & GET /api/teacher/marks records and retrieves student grades', async () => {
  const payload = {
    studentId: 'stu-s01',
    examOrPracticalName: 'Term 1 Science Practical',
    maxMarks: 50,
    marksObtained: 48,
    remarks: 'Flawless circuit construction',
  };
  const resPost = await fetch(`${baseUrl}/api/teacher/marks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  assert.strictEqual(resPost.status, 201);
  const dataPost = await resPost.json();
  assert.strictEqual(dataPost.grade.grade, 'A+');

  // Error handling: missing fields & 404
  const resBad = await fetch(`${baseUrl}/api/teacher/marks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.strictEqual(resBad.status, 400);

  const resNotFound = await fetch(`${baseUrl}/api/teacher/marks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId: 'stu-fake', examOrPracticalName: 'Exam', maxMarks: 100, marksObtained: 80 }),
  });
  assert.strictEqual(resNotFound.status, 404);

  // Retrieve marks
  const resGet = await fetch(`${baseUrl}/api/teacher/marks?studentId=stu-s01`);
  assert.strictEqual(resGet.status, 200);
  const dataGet = await resGet.json();
  assert.ok(dataGet.total >= 2);
});

test('POST /api/teacher/marks/batch persists batch marksheet entries and supports filtering & deletion', async () => {
  const batchPayload = {
    examOrPracticalName: 'Term-End Examination (October 2026)',
    subject: 'Mathematics & Geometry',
    classOrGrade: 'Class 10-A',
    entries: [
      {
        studentId: 'stu-s01',
        rollNo: '101',
        maxMarks: 100,
        marksObtained: 95,
        remarks: 'Outstanding analytical skills',
      },
      {
        studentId: 'stu-s02',
        rollNo: '102',
        maxMarks: 100,
        marksObtained: 78,
        remarks: 'Good progress in trigonometry',
      },
      {
        studentId: 'stu-s03',
        rollNo: '103',
        maxMarks: 100,
        marksObtained: 32,
        remarks: 'Needs remedial practice in algebra',
      },
    ],
  };

  const resBatch = await fetch(`${baseUrl}/api/teacher/marks/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(batchPayload),
  });
  assert.strictEqual(resBatch.status, 201);
  const batchRes = await resBatch.json();
  assert.strictEqual(batchRes.savedCount, 3);
  assert.strictEqual(batchRes.grades[0].grade, 'A+');
  assert.strictEqual(batchRes.grades[0].status, 'PASS');
  assert.strictEqual(batchRes.grades[2].status, 'FAIL');

  // Verify filtering by exam & subject
  const resFilter = await fetch(
    `${baseUrl}/api/teacher/marks?examOrPracticalName=${encodeURIComponent(
      'Term-End Examination (October 2026)'
    )}&subject=${encodeURIComponent('Mathematics & Geometry')}`
  );
  assert.strictEqual(resFilter.status, 200);
  const filterData = await resFilter.json();
  assert.strictEqual(filterData.total, 3);
  assert.strictEqual(filterData.grades[0].subject, 'Mathematics & Geometry');

  // Test updating marks in-place for same student/exam/subject (reusability)
  const updatePayload = {
    examOrPracticalName: 'Term-End Examination (October 2026)',
    subject: 'Mathematics & Geometry',
    classOrGrade: 'Class 10-A',
    entries: [
      {
        studentId: 'stu-s03',
        rollNo: '103',
        maxMarks: 100,
        marksObtained: 55, // Retest / re-eval passed
        remarks: 'Passed retest successfully',
      },
    ],
  };
  const resUpdate = await fetch(`${baseUrl}/api/teacher/marks/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatePayload),
  });
  assert.strictEqual(resUpdate.status, 201);

  // Check updated record
  const resVerify = await fetch(
    `${baseUrl}/api/teacher/marks?studentId=stu-s03&subject=${encodeURIComponent(
      'Mathematics & Geometry'
    )}`
  );
  const verifyData = await resVerify.json();
  assert.strictEqual(verifyData.grades[0].marksObtained, 55);
  assert.strictEqual(verifyData.grades[0].status, 'PASS');
  assert.strictEqual(verifyData.grades[0].grade, 'C');

  // Test single record DELETE
  const gradeId = verifyData.grades[0].id;
  const resDel = await fetch(`${baseUrl}/api/teacher/marks/${gradeId}`, {
    method: 'DELETE',
  });
  assert.strictEqual(resDel.status, 200);

  // Test bad batch request validation
  const badRes = await fetch(`${baseUrl}/api/teacher/marks/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entries: 'not-an-array' }),
  });
  assert.strictEqual(badRes.status, 400);
});

// ============================================================================
// 7. Parents (School Mobile) Tests
// ============================================================================
test('GET /api/parent/attendance/:studentId tracks child attendance', async () => {
  const res = await fetch(`${baseUrl}/api/parent/attendance/stu-s01`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.student.name, 'Aarav Sharma');
  assert.strictEqual(data.attendanceStats.status, 'GOOD_STANDING');

  const res404 = await fetch(`${baseUrl}/api/parent/attendance/stu-fake-99`);
  assert.strictEqual(res404.status, 404);
});

test('GET /api/parent/fees/:studentId retrieves fee ledger & pending balance', async () => {
  const res = await fetch(`${baseUrl}/api/parent/fees/stu-s01`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.financialSummary.totalAnnualFee, 36000);
  assert.strictEqual(data.financialSummary.totalPaid, 24000);
  assert.strictEqual(data.financialSummary.pendingBalance, 12000);

  const res404 = await fetch(`${baseUrl}/api/parent/fees/stu-fake-99`);
  assert.strictEqual(res404.status, 404);
});

test('POST /api/parent/fees/pay-upi processes instant UPI fee payment', async () => {
  const payload = {
    studentId: 'stu-s01',
    amount: 6000,
    upiId: 'ramesh.sharma@okaxis',
  };
  const res = await fetch(`${baseUrl}/api/parent/fees/pay-upi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  assert.strictEqual(res.status, 201);
  const data = await res.json();
  assert.strictEqual(data.paymentStatus, 'SUCCESS');
  assert.match(data.receipt.receiptNo, /^RCP-UPI-SCH-/);
  assert.strictEqual(data.updatedAccount.totalPaid, 30000);
  assert.strictEqual(data.updatedAccount.remainingPending, 6000);
});

test('POST /api/parent/fees/pay-upi handles validation and 404 student', async () => {
  const resBad = await fetch(`${baseUrl}/api/parent/fees/pay-upi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId: 'stu-s01', amount: -100 }),
  });
  assert.strictEqual(resBad.status, 400);

  const res404 = await fetch(`${baseUrl}/api/parent/fees/pay-upi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId: 'stu-fake', amount: 1000 }),
  });
  assert.strictEqual(res404.status, 404);
});

test('GET /api/parent/homework/:studentId lists homework assigned to child class', async () => {
  const res = await fetch(`${baseUrl}/api/parent/homework/stu-s01`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.studentName, 'Aarav Sharma');
  assert.ok(data.totalAssignments > 0);

  const res404 = await fetch(`${baseUrl}/api/parent/homework/stu-fake`);
  assert.strictEqual(res404.status, 404);
});

test('GET /api/parent/albums returns photo galleries', async () => {
  const res = await fetch(`${baseUrl}/api/parent/albums`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.ok(data.totalAlbums > 0);
  assert.match(data.albums[0].title, /Sports Day/i);

  const resBranch = await fetch(`${baseUrl}/api/parent/albums?branchId=branch-sch-01`);
  assert.strictEqual(resBranch.status, 200);
});

test('GET /api/parent/bus-live/:studentId returns real-time GPS tracking coordinates', async () => {
  const res = await fetch(`${baseUrl}/api/parent/bus-live/stu-s01`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.liveTracking.busNumber, 'MH-12-TR-4421');
  assert.ok(data.liveTracking.currentLatitude > 0);
  assert.ok(data.liveTracking.currentLongitude > 0);
  assert.strictEqual(data.liveTracking.isTripActive, true);

  const res404 = await fetch(`${baseUrl}/api/parent/bus-live/stu-fake`);
  assert.strictEqual(res404.status, 404);
});

// ============================================================================
// 8. Students (College of Hotel Management) Tests
// ============================================================================
test('GET /api/student/kitchen-rosters returns culinary practical schedules & toolkits', async () => {
  const res = await fetch(`${baseUrl}/api/student/kitchen-rosters`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.ok(data.totalLabs >= 3);
  assert.match(data.rosters[0].dressCode, /Chef Uniform/i);
  assert.match(data.rosters[0].mandatoryTools, /Knife Set/i);
});

test('GET /api/student/grades/:studentId returns marksheet & culinary assessment', async () => {
  const res = await fetch(`${baseUrl}/api/student/grades/stu-hm01`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.student.name, 'Kabir Verma');
  assert.ok(data.totalAssessments > 0);

  const res404 = await fetch(`${baseUrl}/api/student/grades/stu-fake`);
  assert.strictEqual(res404.status, 404);
});

test('GET /api/student/fee-receipts/:studentId returns digital fee receipts', async () => {
  const res = await fetch(`${baseUrl}/api/student/fee-receipts/stu-hm01`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.ok(data.totalReceipts > 0);

  const res404 = await fetch(`${baseUrl}/api/student/fee-receipts/stu-fake`);
  assert.strictEqual(res404.status, 404);
});

test('POST & GET /api/student/internship-logs submits and views IT shift logs', async () => {
  const payload = {
    studentId: 'stu-hm01',
    date: '2026-10-21',
    hotelBrand: 'Taj Lands End, Mumbai',
    department: 'Bakery & Pastry Kitchen',
    shiftHours: 9,
    tasksCompleted: 'Baked 150 dinner rolls, prepared choux pastry, piped éclairs.',
    chefMentor: 'Pastry Chef Antonio',
  };
  const resPost = await fetch(`${baseUrl}/api/student/internship-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  assert.strictEqual(resPost.status, 201);
  const dataPost = await resPost.json();
  assert.strictEqual(dataPost.log.department, 'Bakery & Pastry Kitchen');

  // Error handling: missing fields & 404
  const resBad = await fetch(`${baseUrl}/api/student/internship-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.strictEqual(resBad.status, 400);

  const resNotFound = await fetch(`${baseUrl}/api/student/internship-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: 'stu-fake',
      hotelBrand: 'Hotel',
      department: 'Dept',
      shiftHours: 8,
      tasksCompleted: 'Tasks',
    }),
  });
  assert.strictEqual(resNotFound.status, 404);

  // Retrieve logs
  const resGet = await fetch(`${baseUrl}/api/student/internship-logs/stu-hm01`);
  assert.strictEqual(resGet.status, 200);
  const dataGet = await resGet.json();
  assert.ok(dataGet.trainingSummary.totalHoursCompleted >= 17);

  const resGet404 = await fetch(`${baseUrl}/api/student/internship-logs/stu-fake`);
  assert.strictEqual(resGet404.status, 404);
});

test('GET /api/student/chef-kits returns kit inventory', async () => {
  const res = await fetch(`${baseUrl}/api/student/chef-kits`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.ok(data.kits.length >= 3);
});

// ============================================================================
// 9. Bus Driver Tests
// ============================================================================
test('Bus Driver Flow: Status -> Start Route -> Location -> Checkpoint -> End Route', async () => {
  // 1. Status
  const resStatus = await fetch(`${baseUrl}/api/driver/route/status`);
  assert.strictEqual(resStatus.status, 200);
  const dataStatus = await resStatus.json();
  assert.strictEqual(dataStatus.driverPortal, 'MOBILE_APP_DRIVER_CONSOLE');

  // 2. Start Route (one-tap button)
  const resStart = await fetch(`${baseUrl}/api/driver/route/start`, { method: 'POST' });
  assert.strictEqual(resStart.status, 200);
  const dataStart = await resStart.json();
  assert.strictEqual(dataStart.activeTrip, true);
  assert.match(dataStart.message, /Route trip started/i);

  // 3. Background GPS transmission
  const resGps = await fetch(`${baseUrl}/api/driver/route/location`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentLat: 18.528, currentLng: 73.865, currentSpeed: 45.0 }),
  });
  assert.strictEqual(resGps.status, 200);
  const dataGps = await resGps.json();
  assert.strictEqual(dataGps.status, 'GPS_COORDINATES_SYNCED');
  assert.strictEqual(dataGps.currentPosition.lat, 18.528);

  // GPS validation error
  const resGpsBad = await fetch(`${baseUrl}/api/driver/route/location`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.strictEqual(resGpsBad.status, 400);

  // 4. Mark Checkpoint
  const resCheck = await fetch(`${baseUrl}/api/driver/route/checkpoint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stopIndex: 2 }),
  });
  assert.strictEqual(resCheck.status, 200);
  const dataCheck = await resCheck.json();
  assert.strictEqual(dataCheck.stops[2].passed, true);

  // Checkpoint validation error
  const resCheckBad = await fetch(`${baseUrl}/api/driver/route/checkpoint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stopIndex: 999 }),
  });
  assert.strictEqual(resCheckBad.status, 400);

  // 5. End Route (one-tap button)
  const resEnd = await fetch(`${baseUrl}/api/driver/route/end`, { method: 'POST' });
  assert.strictEqual(resEnd.status, 200);
  const dataEnd = await resEnd.json();
  assert.strictEqual(dataEnd.activeTrip, false);
  assert.match(dataEnd.message, /safely completed/i);
});

// ============================================================================
// 10. Backwards Compatibility & 404 Endpoint Handling
// ============================================================================
test('Existing /api/trust/overview backwards compatibility', async () => {
  const res = await fetch(`${baseUrl}/api/trust/overview`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.trust.name, 'Zep Foundation Bhose');
});

test('Existing /api/students & /api/students/admit backwards compatibility', async () => {
  const resGet = await fetch(`${baseUrl}/api/students`);
  assert.strictEqual(resGet.status, 200);

  const resPost = await fetch(`${baseUrl}/api/students/admit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      branchId: 'branch-sch-01',
      name: 'Tanvi Gokhale',
      gradeOrSemester: 'Class 8-A',
    }),
  });
  assert.strictEqual(resPost.status, 201);

  const resBad = await fetch(`${baseUrl}/api/students/admit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.strictEqual(resBad.status, 400);
});

test('Existing /api/fees/collect & /api/fees/receipts backwards compatibility', async () => {
  const resPost = await fetch(`${baseUrl}/api/fees/collect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: 'stu-s01',
      amount: 1500,
    }),
  });
  assert.strictEqual(resPost.status, 200);

  const resBad = await fetch(`${baseUrl}/api/fees/collect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.strictEqual(resBad.status, 400);

  const resNotFound = await fetch(`${baseUrl}/api/fees/collect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId: 'stu-fake', amount: 500 }),
  });
  assert.strictEqual(resNotFound.status, 404);

  const resGet = await fetch(`${baseUrl}/api/fees/receipts`);
  assert.strictEqual(resGet.status, 200);
});

test('Non-existent route returns standard 404 JSON with documentation link', async () => {
  const res = await fetch(`${baseUrl}/api/non-existent-endpoint-404`);
  assert.strictEqual(res.status, 404);
  const data = await res.json();
  assert.strictEqual(data.error, 'Endpoint not found');
  assert.strictEqual(data.documentation, '/api-docs');
});

// ============================================================================
// 11. Edge Cases & Complete Branch Coverage Tests
// ============================================================================
test('Global 500 error handler responds with JSON error message', async () => {
  const res = await fetch(`${baseUrl}/api/test-error`);
  assert.strictEqual(res.status, 500);
  const data = await res.json();
  assert.strictEqual(data.error, 'Synthetic internal server error for coverage');
});

test('branchAdmin overview handles branch with 0 students', async () => {
  branchesData.push({
    id: 'branch-new-empty',
    name: 'New Empty Campus',
    code: 'EMP-01',
    type: 'SCHOOL',
    studentCount: 0,
    annualTarget: 100,
  });
  const res = await fetch(`${baseUrl}/api/branch-admin/overview`, {
    headers: { 'X-Branch-Id': 'branch-new-empty' },
  });
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.metrics.averageAttendancePercent, 0);
});

test('authMiddleware parses various roles and headers cleanly', async () => {
  for (const role of ['BRANCH_ADMIN_COLLEGE', 'BRANCH_ADMIN_SCHOOL', 'STUDENT', 'DRIVER', 'OTHER_ROLE']) {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { 'X-User-Role': role },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.user.role, role);
  }
});

test('teacher marks auto-grades boundary checks (A, B+, B, C, D)', async () => {
  const cases = [
    { marks: 82, expected: 'A' },
    { marks: 74, expected: 'B+' },
    { marks: 65, expected: 'B' },
    { marks: 55, expected: 'C' },
    { marks: 35, expected: 'D' },
  ];
  for (const c of cases) {
    const res = await fetch(`${baseUrl}/api/teacher/marks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'stu-s01',
        examOrPracticalName: `Test ${c.marks}`,
        maxMarks: 100,
        marksObtained: c.marks,
      }),
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.grade.grade, c.expected);
  }

  // Teacher marks by branchId
  const resBranch = await fetch(`${baseUrl}/api/teacher/marks?branchId=branch-sch-01`);
  assert.strictEqual(resBranch.status, 200);
});

test('teacher attendance marking handles LATE status and date filtering', async () => {
  const resPost = await fetch(`${baseUrl}/api/teacher/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      branchId: 'branch-sch-01',
      classOrBatch: 'Class 7-A',
      date: '2026-10-21',
      records: [{ studentId: 'stu-s01', status: 'LATE' }],
    }),
  });
  assert.strictEqual(resPost.status, 201);
  const dataPost = await resPost.json();
  assert.strictEqual(dataPost.summary.lateCount, 1);

  // Retrieve with explicit date filter
  const resGet = await fetch(`${baseUrl}/api/teacher/attendance?date=2026-10-21`);
  assert.strictEqual(resGet.status, 200);
});

test('legacy students & fees endpoints handle branch filtering and college admission', async () => {
  // Legacy /api/students query filters
  const resBranch = await fetch(`${baseUrl}/api/students?branchId=branch-hm-01`);
  assert.strictEqual(resBranch.status, 200);
  const resAdm = await fetch(`${baseUrl}/api/students?search=SCH-2026`);
  assert.strictEqual(resAdm.status, 200);
  const resGrade = await fetch(`${baseUrl}/api/students?search=Class`);
  assert.strictEqual(resGrade.status, 200);

  // Legacy /api/students/admit for College
  const resAdmitCollege = await fetch(`${baseUrl}/api/students/admit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      branchId: 'branch-hm-01',
      name: 'Ritu Varma',
      gradeOrSemester: 'BHM 1st Year',
    }),
  });
  assert.strictEqual(resAdmitCollege.status, 201);
  const dataAdmit = await resAdmitCollege.json();
  assert.match(dataAdmit.student.admissionNo, /^HM-2026-/);

  // Legacy /api/fees/collect for College student
  const resFeeCollege = await fetch(`${baseUrl}/api/fees/collect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: 'stu-hm01',
      amount: 10000,
    }),
  });
  assert.strictEqual(resFeeCollege.status, 200);
  const dataFee = await resFeeCollege.json();
  assert.strictEqual(dataFee.receipt.branchName, 'Modern College Of Hotel Management And Technology Solapur');
});

// ============================================================================
// 12. Student Promotion & Academic Year Carry Forward Tests
// ============================================================================
test('POST /api/students/promote promotes single student and carries forward pending fee', async () => {
  const payload = {
    studentId: 'stu-s01',
    fromYear: '2025-2026',
    toYear: '2026-2027',
    annualNewFee: 40000,
  };
  const res = await fetch(`${baseUrl}/api/students/promote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.promotedCount, 1);
  assert.strictEqual(data.records[0].fromGrade, 'Class 7-A');
  assert.strictEqual(data.records[0].toGrade, 'Class 8-A');
  assert.strictEqual(data.records[0].pendingFeeCarriedForward, 12000);

  // Check updated student state
  const resStu = await fetch(`${baseUrl}/api/superadmin/students?search=Aarav`);
  const dataStu = await resStu.json();
  assert.strictEqual(dataStu.students[0].gradeOrSemester, 'Class 8-A');
  // Fee total = new 40,000 + 12,000 carried pending = 52,000
  assert.strictEqual(dataStu.students[0].feeTotal, 52000);
  assert.strictEqual(dataStu.students[0].feePaid, 0);
  assert.strictEqual(dataStu.students[0].feePending, 52000);
});

test('POST /api/students/promote bulk promotion by studentIds and by branchId', async () => {
  // Bulk by studentIds
  const resBulk = await fetch(`${baseUrl}/api/students/promote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentIds: ['stu-s02', 'stu-hm01'],
      fromYear: '2025-2026',
      toYear: '2026-2027',
    }),
  });
  assert.strictEqual(resBulk.status, 200);
  const dataBulk = await resBulk.json();
  assert.strictEqual(dataBulk.promotedCount, 2);

  // Bulk by branchId
  const resBranch = await fetch(`${baseUrl}/api/students/promote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      branchId: 'branch-sch-01',
      fromYear: '2025-2026',
      toYear: '2026-2027',
    }),
  });
  assert.strictEqual(resBranch.status, 200);

  // Bulk all students across trust
  const resAll = await fetch(`${baseUrl}/api/students/promote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fromYear: '2025-2026',
      toYear: '2026-2027',
    }),
  });
  assert.strictEqual(resAll.status, 200);
});

test('POST /api/students/promote handles graduating students (Class 12 and College Semester 6)', async () => {
  // First admit a Class 12 student and Semester 6 student
  await fetch(`${baseUrl}/api/students/admit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      branchId: 'branch-sch-01',
      name: 'Graduating Senior',
      gradeOrSemester: 'Class 12-A',
    }),
  });
  const resStuList = await fetch(`${baseUrl}/api/students?search=Graduating`);
  const dataStuList = await resStuList.json();
  const seniorId = dataStuList.students[0].id;

  const resSenior = await fetch(`${baseUrl}/api/students/promote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: seniorId,
      fromYear: '2025-2026',
      toYear: '2026-2027',
    }),
  });
  assert.strictEqual(resSenior.status, 200);
  const dataSenior = await resSenior.json();
  assert.strictEqual(dataSenior.graduatedCount, 1);
  assert.strictEqual(dataSenior.records[0].status, 'GRADUATED');
  assert.match(dataSenior.records[0].toGrade, /Class 12 Graduated/i);

  // Test Semester 6 College student
  await fetch(`${baseUrl}/api/students/admit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      branchId: 'branch-hm-01',
      name: 'Final Year Chef',
      gradeOrSemester: 'B.Sc H&HA Semester 6',
    }),
  });
  const resChefList = await fetch(`${baseUrl}/api/students?search=Final Year Chef`);
  const dataChefList = await resChefList.json();
  const chefId = dataChefList.students[0].id;

  const resChef = await fetch(`${baseUrl}/api/students/promote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: chefId,
      fromYear: '2025-2026',
      toYear: '2026-2027',
    }),
  });
  assert.strictEqual(resChef.status, 200);
  const dataChef = await resChef.json();
  assert.strictEqual(dataChef.graduatedCount, 1);
  assert.match(dataChef.records[0].toGrade, /Hotel Mgmt Alumnus/i);
});

test('POST /api/students/promote error handling (missing params, 404 student, empty matches)', async () => {
  // Missing fromYear / toYear
  const resMissing = await fetch(`${baseUrl}/api/students/promote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId: 'stu-s01' }),
  });
  assert.strictEqual(resMissing.status, 400);

  // Student not found
  const resNotFound = await fetch(`${baseUrl}/api/students/promote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId: 'stu-fake', fromYear: '2025-2026', toYear: '2026-2027' }),
  });
  assert.strictEqual(resNotFound.status, 404);

  // Empty matches
  const resEmpty = await fetch(`${baseUrl}/api/students/promote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ branchId: 'branch-nonexistent', fromYear: '2025-2026', toYear: '2026-2027' }),
  });
  assert.strictEqual(resEmpty.status, 400);
});

test('GET /api/students/progression-history retrieves progression timeline', async () => {
  // By studentId
  const resStudent = await fetch(`${baseUrl}/api/students/progression-history/stu-s01`);
  assert.strictEqual(resStudent.status, 200);
  const dataStudent = await resStudent.json();
  assert.strictEqual(dataStudent.studentName, 'Aarav Sharma');
  assert.ok(dataStudent.history.length > 0);

  // 404 for unknown student
  const res404 = await fetch(`${baseUrl}/api/students/progression-history/stu-unknown-99`);
  assert.strictEqual(res404.status, 404);

  // All progression history with toYear query
  const resAll = await fetch(`${baseUrl}/api/students/progression-history?toYear=2026-2027`);
  assert.strictEqual(resAll.status, 200);
  const dataAll = await resAll.json();
  assert.ok(dataAll.total > 0);

  // With studentId query
  const resQuery = await fetch(`${baseUrl}/api/students/progression-history?studentId=stu-hm01`);
  assert.strictEqual(resQuery.status, 200);
});

test('Exam Seating Arrangement Endpoints: GET, POST, PUT, DELETE & Auto-Allocate', async () => {
  // 1. GET seating matrix summary
  const resMatrix = await fetch(`${baseUrl}/api/enterprise/exams/seating-matrix`);
  assert.strictEqual(resMatrix.status, 200);
  const dataMatrix = await resMatrix.json();
  assert.ok(dataMatrix.rooms.length >= 3);
  assert.ok(dataMatrix.totalAllocated > 0);

  // 2. GET seating list with filters
  const resList = await fetch(`${baseUrl}/api/enterprise/exams/seating?examName=Term-End%20Examination%20(October%202026)`);
  assert.strictEqual(resList.status, 200);
  const dataList = await resList.json();
  assert.ok(dataList.total > 0);
  assert.strictEqual(dataList.allocations[0].srNo, 1);
  assert.ok(dataList.allocations[0].rollNo);
  assert.ok(dataList.allocations[0].studentName);

  // 3. POST new seating allocation
  const newSeatPayload = {
    examName: 'Midterm Science Assessment 2026',
    subject: 'Organic Chemistry & Thermodynamics',
    subjectCode: 'CHEM-202',
    examDate: '2026-11-05',
    examTime: '10:00 AM - 01:00 PM',
    roomNo: 'Room 201 - Science Block',
    blockNo: 'Block 1',
    invigilatorName: 'Dr. Deshpande',
    rollNo: 'TEST-ROLL-99',
    studentName: 'Test Candidate Student',
    hallTicketNo: 'HT-TEST-999',
    benchNo: 'Bench 99-A',
    classOrGrade: 'Class 10-A',
  };
  const resPost = await fetch(`${baseUrl}/api/enterprise/exams/seating`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newSeatPayload),
  });
  assert.strictEqual(resPost.status, 201);
  const dataPost = await resPost.json();
  assert.strictEqual(dataPost.allocation.rollNo, 'TEST-ROLL-99');
  assert.strictEqual(dataPost.allocation.studentName, 'Test Candidate Student');
  const createdId = dataPost.allocation.id;

  // 4. PUT update seating allocation
  const resPut = await fetch(`${baseUrl}/api/enterprise/exams/seating/${createdId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ attendanceStatus: 'PRESENT', benchNo: 'Bench 99-B (Updated)' }),
  });
  assert.strictEqual(resPut.status, 200);
  const dataPut = await resPut.json();
  assert.strictEqual(dataPut.allocation.attendanceStatus, 'PRESENT');
  assert.strictEqual(dataPut.allocation.benchNo, 'Bench 99-B (Updated)');

  // 5. POST auto-allocate anti-cheating matrix
  const resAuto = await fetch(`${baseUrl}/api/enterprise/exams/seating/auto-allocate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      examName: 'Interleaved Board Mock Exam 2026',
      roomNo: 'Hall 104 - Junior Wing',
      class1: 'Standard 10-A',
      class2: 'B.Sc HM Semester 3',
      count: 4,
    }),
  });
  assert.strictEqual(resAuto.status, 201);
  const dataAuto = await resAuto.json();
  assert.strictEqual(dataAuto.allocations.length, 4);
  assert.strictEqual(dataAuto.allocations[0].srNo, 1);
  assert.strictEqual(dataAuto.allocations[1].srNo, 2);

  // 6. DELETE created seating allocation
  const resDel = await fetch(`${baseUrl}/api/enterprise/exams/seating/${createdId}`, {
    method: 'DELETE',
  });
  assert.strictEqual(resDel.status, 200);

  // 7. Error validation for POST without studentName
  const resErr = await fetch(`${baseUrl}/api/enterprise/exams/seating`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ examName: 'Incomplete Exam' }),
  });
  assert.strictEqual(resErr.status, 400);
});

test('Certificates & LC Details: Generate, Update Progress & Conduct, and Verify Endpoint', async () => {
  // 1. Generate LC with Progress and Conduct
  const genRes = await fetch(`${baseUrl}/api/enterprise/certificates/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: 'stu-s01',
      studentName: 'Aarav Sharma',
      certificateType: 'TRANSFER_LEAVING',
      progress: 'Outstanding',
      conduct: 'Exemplary',
      reasonForLeaving: 'Higher Studies Transfer',
      leavingDate: '2026-06-15',
    }),
  });
  assert.strictEqual(genRes.status, 201);
  const genData = await genRes.json();
  assert.strictEqual(genData.certificate.progress, 'Outstanding');
  assert.strictEqual(genData.certificate.conduct, 'Exemplary');
  const certId = genData.certificate.id;

  // 2. PATCH certificate progress and conduct
  const patchRes = await fetch(`${baseUrl}/api/enterprise/certificates/${certId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      progress: 'Excellent',
      conduct: 'Very Good',
      remarks: 'Special Distinction Awardee',
    }),
  });
  assert.strictEqual(patchRes.status, 200);
  const patchData = await patchRes.json();
  assert.strictEqual(patchData.certificate.progress, 'Excellent');
  assert.strictEqual(patchData.certificate.conduct, 'Very Good');

  // 3. GET /verify/doc/:id checks public HTML includes Progress and Conduct
  const verifyRes = await fetch(`${baseUrl}/verify/doc/${certId}`);
  assert.strictEqual(verifyRes.status, 200);
  const verifyHtml = await verifyRes.text();
  assert.ok(verifyHtml.includes('Progress in Studies:'));
  assert.ok(verifyHtml.includes('Excellent'));
  assert.ok(verifyHtml.includes('Conduct &amp; Moral Character:') || verifyHtml.includes('Conduct & Moral Character:'));
  assert.ok(verifyHtml.includes('Very Good'));

  // 4. DELETE certificate
  const delRes = await fetch(`${baseUrl}/api/enterprise/certificates/${certId}`, {
    method: 'DELETE',
  });
  assert.strictEqual(delRes.status, 200);
});

test('Classroom & Class Teacher Allocation Endpoints: GET, POST, PUT, DELETE with Conflict Detection & Filtering', async () => {
  // 1. GET all classroom allocations and verify initial counts
  const resGet = await fetch(`${baseUrl}/api/enterprise/classrooms/allocations`);
  assert.strictEqual(resGet.status, 200);
  const dataGet = await resGet.json();
  assert.ok(dataGet.total >= 6);
  assert.ok(dataGet.summary.assignedCount >= 4);
  assert.ok(dataGet.summary.vacantCount >= 1);
  assert.ok(dataGet.summary.totalStudents > 0);

  // 2. Filter by branchScope
  const resSchool = await fetch(`${baseUrl}/api/enterprise/classrooms/allocations?branchScope=SCHOOL`);
  assert.strictEqual(resSchool.status, 200);
  const schoolData = await resSchool.json();
  assert.ok(schoolData.allocations.every((a: any) => a.branchScope === 'SCHOOL'));

  // 3. Search filter by teacher name
  const resSearch = await fetch(`${baseUrl}/api/enterprise/classrooms/allocations?search=Rajendra`);
  assert.strictEqual(resSearch.status, 200);
  const searchData = await resSearch.json();
  assert.strictEqual(searchData.total, 1);
  assert.strictEqual(searchData.allocations[0].teacherName, 'Rajendra Patil');

  // 4. POST assign a new class teacher to a classroom
  const payload = {
    classroomId: 'rm-sch-301',
    classroomName: 'Room 301 (Senior Secondary Block)',
    roomCode: 'SCH-301',
    wing: 'South Wing',
    floor: '3rd Floor',
    capacity: 50,
    classOrGrade: 'Class 12-A',
    division: 'A',
    enrolledStudentsCount: 44,
    teacherId: 'tch-sch-02', // Already assigned to Class 7-A
    teacherName: 'Rajendra Patil',
    teacherDesignation: 'Trained Graduate Teacher (TGT Secondary)',
    specializationSubject: 'History & Political Science',
    branchScope: 'SCHOOL',
    academicYear: '2026-2027',
  };

  const resPost = await fetch(`${baseUrl}/api/enterprise/classrooms/allocations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  assert.strictEqual(resPost.status, 201);
  const dataPost = await resPost.json();
  assert.ok(dataPost.allocation.id);
  assert.strictEqual(dataPost.allocation.classOrGrade, 'Class 12-A');
  assert.strictEqual(dataPost.allocation.status, 'ACTIVE');
  // Conflict warning should trigger because Rajendra Patil was already in Room 101
  assert.ok(dataPost.conflictWarning);
  const createdId = dataPost.allocation.id;

  // 5. PUT update allocation (reassign teacher)
  const resPut = await fetch(`${baseUrl}/api/enterprise/classrooms/allocations/${createdId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      teacherId: 'tch-sch-05',
      teacherName: 'Vikram Shinde',
      specializationSubject: 'Physical Education & Athletics',
      remarks: 'Reassigned as class mentor for final academic quarter.',
    }),
  });
  assert.strictEqual(resPut.status, 200);
  const dataPut = await resPut.json();
  assert.strictEqual(dataPut.allocation.teacherName, 'Vikram Shinde');

  // 6. DELETE allocation
  const resDel = await fetch(`${baseUrl}/api/enterprise/classrooms/allocations/${createdId}`, {
    method: 'DELETE',
  });
  assert.strictEqual(resDel.status, 200);

  // 7. Validation error for missing mandatory fields
  const resErr = await fetch(`${baseUrl}/api/enterprise/classrooms/allocations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ remarks: 'Empty payload' }),
  });
  assert.strictEqual(resErr.status, 400);
});

test('Multi-Lingual Question Bank & Question Paper Endpoints: Mathematics, Marathi, Hindi, & English', async () => {
  // 1. GET question bank & verify multi-language coverage
  const resGet = await fetch(`${baseUrl}/api/enterprise/question-bank`);
  assert.strictEqual(resGet.status, 200);
  const dataGet = await resGet.json();
  assert.ok(dataGet.total >= 10);
  assert.ok(dataGet.summary.countsByLanguage.MARATHI >= 4);
  assert.ok(dataGet.summary.countsByLanguage.HINDI >= 4);
  assert.ok(dataGet.summary.countsByType.NUMERICAL_MATH >= 3);

  // 2. Filter by Marathi language
  const resMar = await fetch(`${baseUrl}/api/enterprise/question-bank?language=MARATHI`);
  assert.strictEqual(resMar.status, 200);
  const marData = await resMar.json();
  assert.ok(marData.questions.every((q: any) => q.language === 'MARATHI'));
  assert.ok(marData.questions.some((q: any) => q.questionText.includes('प्रयोग') || q.questionText.includes('म्हणी')));

  // 3. Filter by Hindi language
  const resHin = await fetch(`${baseUrl}/api/enterprise/question-bank?language=HINDI`);
  assert.strictEqual(resHin.status, 200);
  const hinData = await resHin.json();
  assert.ok(hinData.questions.every((q: any) => q.language === 'HINDI'));
  assert.ok(hinData.questions.some((q: any) => q.questionText.includes('संधि') || q.questionText.includes('कबीर')));

  // 4. POST add a new Mathematics question with quadratic formula
  const newQPayload = {
    subject: 'Mathematics & Analytical Geometry',
    subjectCode: 'MATH-10',
    gradeOrClass: 'Class 10-A',
    branchScope: 'SCHOOL',
    chapterTopic: 'Arithmetic Progression (अंकगणिती श्रेढी)',
    language: 'BILINGUAL_EN_MR',
    questionType: 'NUMERICAL_MATH',
    marks: 4,
    difficulty: 'MEDIUM',
    questionText: 'Find the 20th term (t₂₀) and sum of first 20 terms (S₂₀) for the Arithmetic Progression: 3, 7, 11, 15... using formulae: t_n = a + (n - 1)d and S_n = (n/2)[2a + (n - 1)d].',
    formulaUsed: 't_n = a + (n - 1)d, S_n = (n/2)[2a + (n - 1)d]',
    correctAnswer: 't₂₀ = 79, S₂₀ = 820',
    tags: ['ArithmeticProgression', 'Formulas', 'Class10'],
  };

  const resPostQ = await fetch(`${baseUrl}/api/enterprise/question-bank`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newQPayload),
  });
  assert.strictEqual(resPostQ.status, 201);
  const postQData = await resPostQ.json();
  assert.ok(postQData.question.id);
  assert.strictEqual(postQData.question.marks, 4);
  const createdQId = postQData.question.id;

  // 5. GET question papers list
  const resPapers = await fetch(`${baseUrl}/api/enterprise/question-papers`);
  assert.strictEqual(resPapers.status, 200);
  const papersData = await resPapers.json();
  assert.ok(papersData.total >= 4);

  // 6. POST generate an assembled question paper
  const paperPayload = {
    title: 'Unit Test 2026 - Mathematics & Marathi Grammar',
    paperCode: 'QP-TEST-2026',
    subject: 'Mathematics & Analytical Geometry',
    gradeOrClass: 'Class 10-A',
    language: 'BILINGUAL',
    maxMarks: 50,
    timeAllowedMinutes: 90,
    questionIds: [createdQId, 'qb-math-01', 'qb-mar-01'],
    generalInstructions: [
      'All questions are compulsory.',
      'उजवीकडील अंक पूर्ण गुण दर्शवितात.',
    ],
  };

  const resPostPaper = await fetch(`${baseUrl}/api/enterprise/question-papers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paperPayload),
  });
  assert.strictEqual(resPostPaper.status, 201);
  const createdPaper = await resPostPaper.json();
  assert.ok(createdPaper.questionPaper.id);
  assert.strictEqual(createdPaper.questionPaper.maxMarks, 50);
  const paperId = createdPaper.questionPaper.id;

  // 7. GET single question paper by ID
  const resSinglePaper = await fetch(`${baseUrl}/api/enterprise/question-papers/${paperId}`);
  assert.strictEqual(resSinglePaper.status, 200);
  const singlePaperData = await resSinglePaper.json();
  assert.strictEqual(singlePaperData.questionPaper.title, 'Unit Test 2026 - Mathematics & Marathi Grammar');

  // 8. DELETE created question and question paper
  const resDelPaper = await fetch(`${baseUrl}/api/enterprise/question-papers/${paperId}`, {
    method: 'DELETE',
  });
  assert.strictEqual(resDelPaper.status, 200);

  const resDelQ = await fetch(`${baseUrl}/api/enterprise/question-bank/${createdQId}`, {
    method: 'DELETE',
  });
  assert.strictEqual(resDelQ.status, 200);
});

test('Parent-Teacher Meeting (PTM) & Notification Dispatch Endpoints: GET, POST, RSVP, Notify, Attendance & PUT', async () => {
  // 1. GET /api/enterprise/parent-meetings
  const resList = await fetch(`${baseUrl}/api/enterprise/parent-meetings`);
  assert.strictEqual(resList.status, 200);
  const dataList = await resList.json();
  assert.ok(dataList.total >= 2);
  assert.ok(dataList.metrics);
  assert.ok(dataList.metrics.totalMeetings >= 2);

  // 2. Filter by branchScope and targetClass
  const resFiltered = await fetch(`${baseUrl}/api/enterprise/parent-meetings?branchScope=SCHOOL&targetClass=Class%2010-A`);
  assert.strictEqual(resFiltered.status, 200);
  const dataFiltered = await resFiltered.json();
  assert.ok(dataFiltered.meetings.length >= 1);
  assert.strictEqual(dataFiltered.meetings[0].branchScope, 'SCHOOL');

  // 3. GET single meeting by ID
  const resSingle = await fetch(`${baseUrl}/api/enterprise/parent-meetings/ptm-sch-01`);
  assert.strictEqual(resSingle.status, 200);
  const dataSingle = await resSingle.json();
  assert.strictEqual(dataSingle.meeting.id, 'ptm-sch-01');
  assert.ok(dataSingle.meeting.agenda.length > 0);
  assert.ok(dataSingle.meeting.notificationDispatch.dispatched);

  // 4. POST /api/enterprise/parent-meetings (Schedule new meeting)
  const newMeetingPayload = {
    title: 'Semester 2 Culinary Arts Progress & Hospitality Career Consultation',
    branchScope: 'COLLEGE',
    meetingType: 'ACADEMIC_REVIEW',
    targetAudienceType: 'SPECIFIC_CLASSES',
    targetClasses: ['B.Sc in Hospitality Studies - Semester 4'],
    meetingMode: 'HYBRID',
    date: '2026-11-05',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    venue: 'Executive Boardroom & Training Kitchen',
    onlineMeetingUrl: 'https://meet.google.com/test-ptm-col',
    teacherInCharge: 'Chef Anand Deshpande',
    teacherPhone: '+91 98221 44556',
    agenda: ['Kitchen practical assessment review', 'French terminology mastery', 'Attendance records'],
    notes: 'Chef uniforms required for live mock session.',
    channels: ['IN_APP', 'WHATSAPP', 'SMS'],
  };

  const resCreate = await fetch(`${baseUrl}/api/enterprise/parent-meetings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newMeetingPayload),
  });
  assert.strictEqual(resCreate.status, 201);
  const dataCreate = await resCreate.json();
  assert.ok(dataCreate.meeting.id);
  assert.strictEqual(dataCreate.meeting.status, 'SCHEDULED');
  assert.strictEqual(dataCreate.meeting.notificationDispatch.dispatched, true);
  const createdMeetingId = dataCreate.meeting.id;

  // 5. POST RSVP from parent
  const rsvpPayload = {
    studentId: 'stu-hm01',
    parentName: 'Milind Kulkarni',
    status: 'ATTENDING',
    parentRemarks: 'Looking forward to meeting Chef Anand.',
  };
  const resRsvp = await fetch(`${baseUrl}/api/enterprise/parent-meetings/${createdMeetingId}/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rsvpPayload),
  });
  assert.strictEqual(resRsvp.status, 200);
  const dataRsvp = await resRsvp.json();
  assert.strictEqual(dataRsvp.rsvp.status, 'ATTENDING');
  assert.strictEqual(dataRsvp.meetingSummary.totalAttending, 1);

  // 6. POST Notify reminder blast
  const resNotify = await fetch(`${baseUrl}/api/enterprise/parent-meetings/${createdMeetingId}/notify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reminderType: '1_DAY_BEFORE', channels: ['WHATSAPP', 'SMS'] }),
  });
  assert.strictEqual(resNotify.status, 200);
  const dataNotify = await resNotify.json();
  assert.ok(dataNotify.notificationDispatch.dispatched);

  // 7. POST Attendance mark
  const resAtt = await fetch(`${baseUrl}/api/enterprise/parent-meetings/${createdMeetingId}/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId: 'stu-hm01', attended: true, teacherRemarks: 'Parent attended and reviewed kitchen log.' }),
  });
  assert.strictEqual(resAtt.status, 200);
  const dataAtt = await resAtt.json();
  assert.strictEqual(dataAtt.rsvp.attended, true);

  // 8. PUT /api/enterprise/parent-meetings/:id (Update minutes & status)
  const resUpdate = await fetch(`${baseUrl}/api/enterprise/parent-meetings/${createdMeetingId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'COMPLETED',
      minutesOfMeeting: 'Meeting successfully concluded with 100% participation of invited parents.',
    }),
  });
  assert.strictEqual(resUpdate.status, 200);
  const dataUpdate = await resUpdate.json();
  assert.strictEqual(dataUpdate.meeting.status, 'COMPLETED');
  assert.ok(dataUpdate.meeting.minutesOfMeeting);

  // 9. DELETE /api/enterprise/parent-meetings/:id
  const resDelete = await fetch(`${baseUrl}/api/enterprise/parent-meetings/${createdMeetingId}`, {
    method: 'DELETE',
  });
  assert.strictEqual(resDelete.status, 200);
});




