// OpenAPI 3.0 Specification for Trust Education ERP API

export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Zep Foundation Bhose - ERP REST API',
    version: '1.0.0',
    description: `
### Integrated Education ERP System
Serving **Modern Public School And Junior College Bhose** & **Modern College Of Hotel Management And Technology Solapur**.

#### 🎯 Role-Based Architecture:
1. **Superadmin (Trustee / President)**: Web only. Master consolidated visibility over both School & College (total fees collected, pending balances, total student strength).
2. **Branch Admin (Principal / Director / Accountant)**: Web only. Strictly isolated to their branch (School Admin cannot view College ledgers/students; College Admin cannot view School data).
3. **Teachers / Chef Instructors**: Web & Mobile. Mark daily attendance in 30 seconds, give homework, upload study notes & recipe cards, and enter marks.
4. **Parents (School)**: Mobile App. Track student attendance, pay fees via UPI with instant receipts, see homework, view school photo albums, and track the school bus live.
5. **Students (College of Hotel Management)**: Mobile App & Web. Practical kitchen rosters (BTK, Bakery, Restaurant), exam grades, fee receipts, and industrial training (IT) internship shift logs.
6. **Bus Driver**: Mobile App. Simple one-tap buttons ("Start Route" / "End Route") and continuous background GPS coordinate transmission.
    `,
    contact: {
      name: 'Zep Foundation Bhose IT Cell',
      email: 'erp-support@zepfoundationbhose.org',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local ERP Development Server',
    },
  ],
  tags: [
    {
      name: 'Superadmin (Trustee / President)',
      description: 'Web login only. Master visibility across School & College, total collection, pending fees & strength.',
    },
    {
      name: 'Branch Admin (Isolated)',
      description: 'Web login only. Strict branch isolation (School Admin cannot view College financial ledgers or students).',
    },
    {
      name: 'Teachers & Chef Instructors',
      description: 'Web & Mobile. 30-second rapid attendance, assign homework, upload study notes & enter marks.',
    },
    {
      name: 'Parents (School)',
      description: 'Mobile App. Child attendance, instant UPI fee payments, homework, photo albums, and live school bus tracking.',
    },
    {
      name: 'Students (College HM)',
      description: 'Mobile App & Web. Kitchen rosters, culinary grades, fee receipts, and industrial training internship logs.',
    },
    {
      name: 'Bus Driver',
      description: 'Mobile App. One-tap "Start Route" / "End Route" and background GPS coordinate streaming.',
    },
    {
      name: 'Authentication & Health',
      description: 'Role-based authentication, user profile, diagnostic health checks, and admission enquiries.',
    },
  ],
  paths: {
    // 1. Health & Auth
    '/api/health': {
      get: {
        tags: ['Authentication & Health'],
        summary: 'System Health Check',
        responses: {
          200: {
            description: 'API is operational',
            content: { 'application/json': { example: { status: 'ONLINE', version: '1.0.0', brandColor: '#EA580C' } } },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Authentication & Health'],
        summary: 'User Login & Role Switcher',
        description: 'Authenticates user and returns role-scoped JWT token and access permissions.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  role: {
                    type: 'string',
                    enum: [
                      'SUPERADMIN',
                      'BRANCH_ADMIN_SCHOOL',
                      'BRANCH_ADMIN_COLLEGE',
                      'TEACHER',
                      'PARENT',
                      'STUDENT',
                      'BUS_DRIVER',
                    ],
                    example: 'SUPERADMIN',
                  },
                  password: { type: 'string', example: 'demo123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Authentication successful with role-scoped token' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Authentication & Health'],
        summary: 'Current User Profile & Permissions',
        responses: {
          200: { description: 'Current authenticated context' },
        },
      },
    },
    '/api/enquiries': {
      get: {
        tags: ['Authentication & Health'],
        summary: 'List Admission Inquiries',
        responses: { 200: { description: 'Admission enquiries list' } },
      },
      post: {
        tags: ['Authentication & Health'],
        summary: 'Submit Admission Inquiry',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                applicantName: 'Tanya Sengupta',
                parentName: 'Debabrata Sengupta',
                phone: '+91 98112 33445',
                targetBranch: 'COLLEGE',
                targetClassOrCourse: 'B.Sc in Hospitality & Hotel Administration',
              },
            },
          },
        },
        responses: { 201: { description: 'Enquiry submitted' } },
      },
    },

    // 2. Superadmin
    '/api/superadmin/overview': {
      get: {
        tags: ['Superadmin (Trustee / President)'],
        summary: 'Consolidated Trust Statistics',
        description: 'Master view over School and College: Total fees collected, pending balance, and total strength.',
        responses: {
          200: {
            description: 'Consolidated Trust figures',
            content: {
              'application/json': {
                example: {
                  trust: {
                    name: 'Zep Foundation Bhose',
                    totalStudents: 300,
                    totalRevenue: 5400000,
                    totalCollected: 4120000,
                    totalPending: 1280000,
                    activeBranches: 2,
                    collectionEfficiencyPercent: 76,
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/superadmin/branches': {
      get: {
        tags: ['Superadmin (Trustee / President)'],
        summary: 'Comparative Multi-Branch Breakdown',
        description: 'Side-by-side performance comparison of School vs Hotel Management College.',
        responses: { 200: { description: 'Branch metrics breakdown' } },
      },
    },
    '/api/superadmin/financial-ledger': {
      get: {
        tags: ['Superadmin (Trustee / President)'],
        summary: 'Master Financial Audit Ledger',
        description: 'Complete transaction history across all institutions with payment mode filters.',
        parameters: [
          { name: 'paymentMode', in: 'query', schema: { type: 'string', enum: ['UPI', 'CASH', 'NETBANKING', 'CHEQUE'] } },
          { name: 'branchId', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Consolidated financial ledger' } },
      },
    },
    '/api/superadmin/students': {
      get: {
        tags: ['Superadmin (Trustee / President)'],
        summary: 'Global Student Directory',
        description: 'Search all students across School and College.',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'branchId', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Global student directory' } },
      },
    },
    '/api/students/promote': {
      post: {
        tags: ['Superadmin (Trustee / President)', 'Branch Admin (Isolated)'],
        summary: 'Annual Student Promotion & Carry Forward',
        description: 'Promote students to next academic year/grade (e.g. 1st Std to 2nd Std, Semester 1 to Semester 2) and carry forward pending fee dues.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                studentId: 'stu-s01',
                fromYear: '2025-2026',
                toYear: '2026-2027',
                annualNewFee: 38000,
              },
            },
          },
        },
        responses: {
          200: { description: 'Students promoted and carry forward completed successfully' },
          400: { description: 'Missing mandatory fromYear/toYear or no matching students' },
          404: { description: 'Student not found' },
        },
      },
    },
    '/api/students/progression-history/{studentId}': {
      get: {
        tags: ['Superadmin (Trustee / President)', 'Branch Admin (Isolated)'],
        summary: 'View Student Academic Progression History',
        description: 'Timeline of academic standards passed and pending balances carried forward.',
        parameters: [
          { name: 'studentId', in: 'path', required: true, schema: { type: 'string', example: 'stu-s01' } },
        ],
        responses: {
          200: { description: 'Progression audit trail' },
          404: { description: 'Student not found' },
        },
      },
    },
    '/api/students/progression-history': {
      get: {
        tags: ['Superadmin (Trustee / President)'],
        summary: 'List All Academic Progression Records',
        parameters: [
          { name: 'toYear', in: 'query', schema: { type: 'string', example: '2026-2027' } },
        ],
        responses: {
          200: { description: 'All progression events' },
        },
      },
    },

    // 3. Branch Admin
    '/api/branch-admin/overview': {
      get: {
        tags: ['Branch Admin (Isolated)'],
        summary: 'Branch-Isolated Summary',
        description: 'Metrics strictly isolated to authorized branch (returns 403 on cross-branch attempt).',
        parameters: [
          { name: 'X-Branch-Id', in: 'header', required: false, schema: { type: 'string', example: 'branch-sch-01' } },
          { name: 'branchId', in: 'query', required: false, schema: { type: 'string', example: 'branch-sch-01' } },
        ],
        responses: {
          200: { description: 'Branch metrics' },
          403: { description: 'Access Denied: Strict branch isolation in effect' },
        },
      },
    },
    '/api/branch-admin/students': {
      get: {
        tags: ['Branch Admin (Isolated)'],
        summary: 'Branch-Isolated Student Roster',
        parameters: [
          { name: 'X-Branch-Id', in: 'header', schema: { type: 'string' } },
          { name: 'branchId', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Students list' },
          403: { description: 'Cross-branch access forbidden' },
        },
      },
      post: {
        tags: ['Branch Admin (Isolated)'],
        summary: 'Admit Student in Branch',
        parameters: [{ name: 'X-Branch-Id', in: 'header', schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                branchId: 'branch-sch-01',
                name: 'Diya Joshi',
                gender: 'FEMALE',
                gradeOrSemester: 'Class 5-A',
                parentName: 'Nitin Joshi',
                parentPhone: '+91 98980 11223',
                feeTotal: 36000,
              },
            },
          },
        },
        responses: {
          201: { description: 'Student admitted' },
          403: { description: 'Branch mismatch' },
        },
      },
    },
    '/api/branch-admin/fees': {
      get: {
        tags: ['Branch Admin (Isolated)'],
        summary: 'Branch-Isolated Fee Receipts',
        description: 'School Admin cannot view College receipts; College Admin cannot view School receipts.',
        parameters: [
          { name: 'X-Branch-Id', in: 'header', schema: { type: 'string' } },
          { name: 'branchId', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Branch fee receipts' },
          403: { description: 'Cross-branch access forbidden' },
        },
      },
    },
    '/api/branch-admin/fees/collect': {
      post: {
        tags: ['Branch Admin (Isolated)'],
        summary: 'Collect Branch Student Fee',
        parameters: [{ name: 'X-Branch-Id', in: 'header', schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                branchId: 'branch-sch-01',
                studentId: 'stu-s01',
                amount: 6000,
                paymentMode: 'UPI',
              },
            },
          },
        },
        responses: {
          200: { description: 'Fee collected and receipt generated' },
          403: { description: 'Cannot modify financials for another branch student' },
        },
      },
    },

    // 4. Teachers
    '/api/teacher/attendance': {
      post: {
        tags: ['Teachers & Chef Instructors'],
        summary: '30-Second Rapid Daily Attendance Marking',
        description: 'Submit entire class or kitchen batch attendance in a single 30-second call.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                branchId: 'branch-sch-01',
                classOrBatch: 'Class 7-A',
                date: '2026-10-21',
                records: [
                  { studentId: 'stu-s01', status: 'PRESENT' },
                  { studentId: 'stu-s02', status: 'PRESENT' },
                  { studentId: 'stu-s03', status: 'ABSENT', remarks: 'Medical leave' },
                ],
              },
            },
          },
        },
        responses: { 201: { description: 'Attendance marked in 30 seconds' } },
      },
      get: {
        tags: ['Teachers & Chef Instructors'],
        summary: 'Get Attendance Records',
        parameters: [
          { name: 'classOrBatch', in: 'query', schema: { type: 'string' } },
          { name: 'date', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Attendance records list' } },
      },
    },
    '/api/teacher/batches': {
      get: {
        tags: ['Teachers & Chef Instructors'],
        summary: 'Assigned Classes & Kitchen Practical Batches',
        responses: { 200: { description: 'Classes and labs schedule' } },
      },
    },
    '/api/teacher/homework': {
      post: {
        tags: ['Teachers & Chef Instructors'],
        summary: 'Assign Homework or Practical Assignment',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                branchId: 'branch-sch-01',
                classOrBatch: 'Class 7-A',
                subjectOrLab: 'Mathematics',
                title: 'Linear Equations & Graphing',
                description: 'Solve exercises 3.2 on graph sheet.',
                dueDate: '2026-10-25',
              },
            },
          },
        },
        responses: { 201: { description: 'Homework assigned' } },
      },
      get: {
        tags: ['Teachers & Chef Instructors'],
        summary: 'List Assigned Homework',
        responses: { 200: { description: 'Homework list' } },
      },
    },
    '/api/teacher/notes': {
      post: {
        tags: ['Teachers & Chef Instructors'],
        summary: 'Upload Study Notes or Kitchen Guide',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                branchId: 'branch-hm-01',
                title: 'Mastering Hollandaise & Béarnaise Emulsions',
                subjectOrLab: 'Food Production',
                description: 'Temperature control, egg yolk coagulation points, and clarification techniques.',
                fileUrl: 'https://trust-erp.local/materials/hollandaise_mastery.pdf',
                tags: ['Sauces', 'Culinary Arts'],
              },
            },
          },
        },
        responses: { 201: { description: 'Note uploaded' } },
      },
      get: {
        tags: ['Teachers & Chef Instructors'],
        summary: 'List Notes & Guides',
        responses: { 200: { description: 'Notes list' } },
      },
    },
    '/api/teacher/marks': {
      post: {
        tags: ['Teachers & Chef Instructors'],
        summary: 'Enter Marks & Culinary Evaluation',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                studentId: 'stu-s01',
                examOrPracticalName: 'Unit Test 2 - Mathematics',
                maxMarks: 50,
                marksObtained: 46,
                remarks: 'Excellent geometry proofs',
              },
            },
          },
        },
        responses: { 201: { description: 'Marks entered' } },
      },
      get: {
        tags: ['Teachers & Chef Instructors'],
        summary: 'View Student Marks',
        responses: { 200: { description: 'Marks list' } },
      },
    },

    // 5. Parents
    '/api/parent/attendance/{studentId}': {
      get: {
        tags: ['Parents (School)'],
        summary: 'Track Child Attendance',
        parameters: [{ name: 'studentId', in: 'path', required: true, schema: { type: 'string', example: 'stu-s01' } }],
        responses: { 200: { description: 'Child attendance statistics' } },
      },
    },
    '/api/parent/fees/{studentId}': {
      get: {
        tags: ['Parents (School)'],
        summary: 'View Child Fee Balance & Receipts',
        parameters: [{ name: 'studentId', in: 'path', required: true, schema: { type: 'string', example: 'stu-s01' } }],
        responses: { 200: { description: 'Child fee breakdown' } },
      },
    },
    '/api/parent/fees/pay-upi': {
      post: {
        tags: ['Parents (School)'],
        summary: 'Pay School Fees via UPI',
        description: 'Instant UPI payment with dynamic receipt generation.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                studentId: 'stu-s01',
                amount: 5000,
                upiId: 'parent@okaxis',
              },
            },
          },
        },
        responses: { 201: { description: 'Payment successful, receipt issued' } },
      },
    },
    '/api/parent/homework/{studentId}': {
      get: {
        tags: ['Parents (School)'],
        summary: 'See Child Homework',
        parameters: [{ name: 'studentId', in: 'path', required: true, schema: { type: 'string', example: 'stu-s01' } }],
        responses: { 200: { description: 'Child homework list' } },
      },
    },
    '/api/parent/albums': {
      get: {
        tags: ['Parents (School)'],
        summary: 'View School Photo Albums',
        responses: { 200: { description: 'Photo albums gallery' } },
      },
    },
    '/api/parent/bus-live/{studentId}': {
      get: {
        tags: ['Parents (School)'],
        summary: 'Live School Bus GPS Tracking',
        parameters: [{ name: 'studentId', in: 'path', required: true, schema: { type: 'string', example: 'stu-s01' } }],
        responses: { 200: { description: 'Real-time bus tracking coordinates and ETA' } },
      },
    },

    // 6. Students
    '/api/student/kitchen-rosters': {
      get: {
        tags: ['Students (College HM)'],
        summary: 'Practical Kitchen Rosters',
        description: 'View schedules for BTK, Bakery, and Mock Restaurant.',
        responses: { 200: { description: 'Kitchen practical rosters' } },
      },
    },
    '/api/student/grades/{studentId}': {
      get: {
        tags: ['Students (College HM)'],
        summary: 'Exam Grades & Culinary Practical Scores',
        parameters: [{ name: 'studentId', in: 'path', required: true, schema: { type: 'string', example: 'stu-hm01' } }],
        responses: { 200: { description: 'Semester marksheet' } },
      },
    },
    '/api/student/fee-receipts/{studentId}': {
      get: {
        tags: ['Students (College HM)'],
        summary: 'College Fee Receipts',
        parameters: [{ name: 'studentId', in: 'path', required: true, schema: { type: 'string', example: 'stu-hm01' } }],
        responses: { 200: { description: 'Digital fee receipts' } },
      },
    },
    '/api/student/internship-logs/{studentId}': {
      get: {
        tags: ['Students (College HM)'],
        summary: 'Industrial Training (IT) Internship Logs',
        parameters: [{ name: 'studentId', in: 'path', required: true, schema: { type: 'string', example: 'stu-hm01' } }],
        responses: { 200: { description: 'Internship shifts summary' } },
      },
    },
    '/api/student/internship-logs': {
      post: {
        tags: ['Students (College HM)'],
        summary: 'Submit Daily Internship Shift Log',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                studentId: 'stu-hm01',
                date: '2026-10-21',
                hotelBrand: 'Taj Lands End, Mumbai',
                department: 'Food Production (Banquet Prep)',
                shiftHours: 8,
                tasksCompleted: 'Prepared marinades, trimmed lamb racks, and assembled antipasti platters.',
                chefMentor: 'Sous Chef Vikramaditya',
              },
            },
          },
        },
        responses: { 201: { description: 'Internship log recorded' } },
      },
    },
    '/api/student/chef-kits': {
      get: {
        tags: ['Students (College HM)'],
        summary: 'Issued Chef Kit & Knife Inventory',
        responses: { 200: { description: 'Toolkits status' } },
      },
    },

    // 7. Bus Driver
    '/api/driver/route/status': {
      get: {
        tags: ['Bus Driver'],
        summary: 'Active Route Status & Stops',
        responses: { 200: { description: 'Bus route details' } },
      },
    },
    '/api/driver/route/start': {
      post: {
        tags: ['Bus Driver'],
        summary: 'One-Tap Button: "Start Route"',
        description: 'Initiates active route trip and GPS broadcast.',
        responses: { 200: { description: 'Trip started' } },
      },
    },
    '/api/driver/route/end': {
      post: {
        tags: ['Bus Driver'],
        summary: 'One-Tap Button: "End Route"',
        description: 'Completes trip when bus reaches campus.',
        responses: { 200: { description: 'Trip ended' } },
      },
    },
    '/api/driver/route/location': {
      post: {
        tags: ['Bus Driver'],
        summary: 'Transmit Background GPS Coordinates',
        description: 'Streams latitude, longitude, and speed from mobile device.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: {
                currentLat: 18.5255,
                currentLng: 73.861,
                currentSpeed: 42.0,
              },
            },
          },
        },
        responses: { 200: { description: 'Location updated' } },
      },
    },
    '/api/driver/route/checkpoint': {
      post: {
        tags: ['Bus Driver'],
        summary: 'Mark Stop Checkpoint Passed',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              example: { stopIndex: 2 },
            },
          },
        },
        responses: { 200: { description: 'Checkpoint marked' } },
      },
    },
  },
};

// Custom theme CSS for Swagger UI matching Orange (#EA580C)
export const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { background-color: #EA580C; border-bottom: 3px solid #C2410C; }
    .swagger-ui .topbar .download-url-wrapper { display: none; }
    .swagger-ui .info h2 { color: #EA580C; }
    .swagger-ui .btn.authorize { background-color: #EA580C; border-color: #EA580C; color: white; }
    .swagger-ui .btn.authorize svg { fill: white; }
    .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #EA580C; }
    .swagger-ui .opblock.opblock-post .opblock-summary-method { background: #16A34A; }
    .swagger-ui .opblock.opblock-delete .opblock-summary-method { background: #DC2626; }
    .swagger-ui .opblock.opblock-put .opblock-summary-method { background: #2563EB; }
  `,
  customSiteTitle: 'Trust ERP - Swagger API Documentation',
};
