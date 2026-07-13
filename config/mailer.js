import nodemailer from 'nodemailer';

/**
 * Creates and verifies a reusable Nodemailer transporter using
 * Hostinger SMTP credentials from environment variables.
 */
const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true, // true for port 465 (SSL)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

export const transporter = createTransporter();

/**
 * Verify SMTP connection on startup — logs a warning if credentials are wrong
 * so the server still starts (avoiding hard crashes in CI / cold-starts).
 */
transporter.verify((error) => {
  if (error) {
    console.warn('⚠️  SMTP connection failed:', error.message);
  } else {
    console.log('✅  SMTP transporter ready — Hostinger connected');
  }
});
