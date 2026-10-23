import dotenv from 'dotenv';
import path from 'path';

// Automatically load .env.production when NODE_ENV === 'production', otherwise .env.development
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = nodeEnv === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
dotenv.config(); // Fallback to .env

import { app } from './app.js';
import { exec } from 'child_process';

const PORT = process.env.PORT || 5000;

export const server = app.listen(PORT, () => {
  const swaggerUrl = `http://localhost:${PORT}/api-docs`;
  console.log(`=======================================================`);
  console.log(`  🚀 Trust ERP API is running at http://localhost:${PORT}`);
  console.log(`  🌐 Environment: [${process.env.NODE_ENV || 'development'}]`);
  console.log(`  🔗 Base API URL: ${process.env.API_BASE_URL || `http://localhost:${PORT}`}`);
  console.log(`  📖 Swagger UI available at: ${swaggerUrl}`);
  console.log(`  🎨 Brand Theme: Orange (#EA580C)`);
  console.log(`  🏢 Multi-Branch: School + College of Hotel Management`);
  console.log(`=======================================================`);

  // Auto-launch Swagger in user's default web browser
  if (process.env.NODE_ENV !== 'test' && !process.env.CI) {
    const startCmd =
      process.platform === 'win32'
        ? `start ${swaggerUrl}`
        : process.platform === 'darwin'
        ? `open ${swaggerUrl}`
        : `xdg-open ${swaggerUrl}`;

    exec(startCmd, (err) => {
      if (err) {
        console.log(`  ℹ Note: To view Swagger, open: ${swaggerUrl}`);
      } else {
        console.log(`  🌐 Automatically opened Swagger documentation in default browser!`);
      }
    });
  }
});
