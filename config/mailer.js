import nodemailer from 'nodemailer';
import dns from 'dns';

// Force Node to prefer IPv4 first when resolving hostnames.
// This prevents ENETUNREACH errors on networks/platforms that do not support IPv6.
if (dns && typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

/**
 * Creates and verifies a reusable Nodemailer transporter using
 * Hostinger SMTP credentials from environment variables.
 */
const createTransporter = () => {
  const port = Number(process.env.SMTP_PORT) || 465;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465, // true for port 465 (SSL), false for 587 (TLS/STARTTLS)
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

