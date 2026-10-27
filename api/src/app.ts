import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument, swaggerUiOptions } from './swagger.js';
import { apiRouter } from './routes/apiRoutes.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import { idempotencyMiddleware } from './middleware/idempotencyMiddleware.js';
import { issuedCertificatesData } from './enterpriseStore.js';

export const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(idempotencyMiddleware);

// Request logger (only active in non-test mode)
if (process.env.NODE_ENV !== 'test') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
  });
}

// Authentication & context middleware
app.use(authMiddleware);

// Public Certificate Verification Endpoint (Matches QR code on printed certificates)
app.get('/verify/doc/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const cert = issuedCertificatesData.find(
    (c) => c.id === id || c.certificateSerialNo.toLowerCase() === id.toLowerCase()
  );

  if (!cert) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Certificate Verification Failed</title><style>body{font-family:sans-serif;background:#FFF1F2;color:#9F1239;text-align:center;padding:50px;}.box{background:white;max-width:500px;margin:auto;padding:30px;border-radius:12px;border:2px solid #FDA4AF;}</style></head>
        <body>
          <div class="box">
            <h2>⚠️ Invalid Certificate Record</h2>
            <p>No digitally signed certificate matching identifier <strong>${id}</strong> was found in TrustEdu records.</p>
          </div>
        </body>
      </html>
    `);
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Trust Certificate Verification - ${cert.certificateSerialNo}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #F8FAFC; color: #1E293B; padding: 40px 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; border: 2px solid #EA580C; box-shadow: 0 10px 25px rgba(234, 88, 12, 0.1); overflow: hidden; }
          .header { background: #EA580C; color: white; padding: 24px; text-align: center; }
          .body { padding: 30px; }
          .badge { display: inline-flex; align-items: center; background: #DCFCE7; color: #166534; font-weight: bold; font-size: 13px; padding: 6px 14px; border-radius: 9999px; border: 1px solid #86EFAC; margin-bottom: 20px; }
          .row { display: flex; justify-content: space-between; border-bottom: 1px solid #E2E8F0; padding: 10px 0; font-size: 14px; }
          .row strong { color: #64748B; }
          .sig-box { background: #F1F5F9; border-radius: 8px; padding: 12px; font-family: monospace; font-size: 11px; word-break: break-all; margin-top: 20px; color: #334155; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin:0 0 6px 0;">Zep Foundation Bhose</h2>
            <div style="font-size:13px;opacity:0.9;">Public Credential Verification Portal</div>
          </div>
          <div class="body">
            <div style="text-align:center;">
              <div class="badge">✔ DIGITALLY VERIFIED CREDENTIAL</div>
              ${cert.isDuplicate ? '<div style="margin-top:-10px;margin-bottom:15px;"><span style="background:#FEE2E2;color:#991B1B;font-weight:bold;font-size:11px;padding:4px 10px;border-radius:9999px;border:1px solid #FCA5A5;">⚠️ OFFICIAL DUPLICATE COPY</span></div>' : ''}
            </div>
            <div class="row"><strong>Serial No:</strong> <span style="font-family:monospace;font-weight:bold;color:#EA580C;">${cert.certificateSerialNo}</span></div>
            <div class="row"><strong>Certificate Type:</strong> <span>${cert.certificateType} CERTIFICATE</span></div>
            <div class="row"><strong>Student Name:</strong> <span style="font-weight:bold;color:#0F172A;">${cert.studentName}</span></div>
            ${cert.grNumber ? `<div class="row"><strong>General Register (GR) No:</strong> <span style="font-family:monospace;font-weight:bold;">${cert.grNumber}</span></div>` : ''}
            ${cert.motherName ? `<div class="row"><strong>Mother's Name:</strong> <span>${cert.motherName}</span></div>` : ''}
            ${cert.dob ? `<div class="row"><strong>Date of Birth:</strong> <span>${cert.dob} ${cert.dobWords ? `(${cert.dobWords})` : ''}</span></div>` : ''}
            <div class="row"><strong>Institution:</strong> <span>${cert.branchName}</span></div>
            <div class="row"><strong>Course / Grade:</strong> <span>${cert.gradeOrCourse}</span></div>
            <div class="row"><strong>Academic Year:</strong> <span>${cert.academicYear}</span></div>
            ${cert.progress ? `<div class="row"><strong>Progress in Studies:</strong> <span style="font-weight:bold;color:#0F172A;">${cert.progress}</span></div>` : ''}
            ${cert.conduct ? `<div class="row"><strong>Conduct & Moral Character:</strong> <span style="font-weight:bold;color:#0F172A;">${cert.conduct}</span></div>` : ''}
            ${cert.leavingDate ? `<div class="row"><strong>Date of Leaving:</strong> <span>${cert.leavingDate}</span></div>` : ''}
            ${cert.reasonForLeaving ? `<div class="row"><strong>Reason for Leaving:</strong> <span>${cert.reasonForLeaving}</span></div>` : ''}
            ${cert.purpose ? `<div class="row"><strong>Certified Purpose:</strong> <span>${cert.purpose}</span></div>` : ''}
            <div class="row"><strong>Issued Date:</strong> <span>${cert.issueDate}</span></div>
            <div class="row"><strong>Authorized Signer:</strong> <span>${cert.issuedBy}</span></div>
            ${cert.remarks ? `<div class="row"><strong>Official Remarks:</strong> <span>${cert.remarks}</span></div>` : ''}
            <div class="sig-box">
              <strong>Cryptographic SHA-256 Hash:</strong><br/>
              ${cert.digitalSignatureHash}
            </div>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Mount Interactive Swagger UI and JSON Spec
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));
app.get('/api/docs.json', (_req: Request, res: Response) => {
  res.json(swaggerDocument);
});

// Diagnostic error handler check endpoint
app.get('/api/test-error', (_req: Request, _res: Response, next: NextFunction) => {
  next(new Error('Synthetic internal server error for coverage'));
});

// Mount Main API Router
app.use('/api', apiRouter);

// Root Welcome & Swagger Launch Portal
app.get('/', (_req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Trust Education ERP - API Console & Swagger</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #FFF7ED; color: #1F2937; padding: 40px 20px; text-align: center; margin: 0; }
          .card { background: white; max-width: 720px; margin: 0 auto; padding: 40px; border-radius: 20px; box-shadow: 0 12px 30px rgba(234, 88, 12, 0.12); border: 2px solid #FDBA74; }
          h1 { color: #EA580C; margin-top: 0; font-size: 28px; }
          .badge { display: inline-block; background: #EA580C; color: white; padding: 6px 16px; border-radius: 9999px; font-weight: 700; font-size: 13px; margin-bottom: 20px; letter-spacing: 0.5px; }
          .hero-btn { display: inline-block; background: #EA580C; color: white; font-weight: bold; font-size: 16px; padding: 14px 28px; border-radius: 12px; text-decoration: none; margin: 24px 0 16px 0; transition: background 0.2s; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3); }
          .hero-btn:hover { background: #C2410C; }
          .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; text-align: left; margin-top: 24px; }
          .role-card { background: #FFEDD5; padding: 14px 16px; border-radius: 10px; border-left: 4px solid #EA580C; font-size: 13px; }
          .role-card strong { color: #9A3412; display: block; margin-bottom: 4px; }
          a { color: #EA580C; font-weight: 600; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">API STATUS: ONLINE & READY</div>
          <h1>Trust Education ERP - Standard REST API</h1>
          <p style="color: #4B5563; font-size: 15px;">Serving <strong>Saraswati International Public School</strong> & <strong>Imperial Institute of Hotel Management</strong></p>
          
          <a href="/api-docs" class="hero-btn">🚀 Open Interactive Swagger Documentation (/api-docs)</a>
          
          <div style="font-size: 13px; color: #6B7280;">
            Download OpenAPI Specification: <a href="/api/docs.json">/api/docs.json</a>
          </div>

          <hr style="border: 0; border-top: 1px solid #FED7AA; margin: 28px 0;" />

          <h3 style="margin-bottom: 8px; color: #374151;">Role-Based API Specifications Available in Swagger:</h3>
          <div class="grid">
            <div class="role-card">
              <strong>👑 Superadmin (Trustee / President)</strong>
              Web login. Master multi-branch visibility, total collection & pending balances.
            </div>
            <div class="role-card">
              <strong>🏢 Branch Admin (Principal / Accountant)</strong>
              Web login. Strict branch isolation (School cannot see College ledgers).
            </div>
            <div class="role-card">
              <strong>👨‍🏫 Teachers & Chef Instructors</strong>
              Web & Mobile. 30-sec attendance, homework, study notes & grading.
            </div>
            <div class="role-card">
              <strong>👨‍👩‍👧 Parents (School)</strong>
              Mobile App. Track attendance, instant UPI fees, homework & live bus GPS.
            </div>
            <div class="role-card">
              <strong>🍳 Students (Hotel Management)</strong>
              Mobile & Web. Kitchen rosters, culinary marks, fee receipts & IT logs.
            </div>
            <div class="role-card">
              <strong>🚌 Bus Driver</strong>
              Mobile App. One-tap "Start/End Route", background GPS streaming.
            </div>
          </div>
        </div>
      </body>
    </html>
  `);
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint not found',
    requestedUrl: req.originalUrl,
    method: req.method,
    documentation: '/api-docs',
  });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({
    error: err.message || 'Internal Server Error',
  });
});
