import nodemailer from 'nodemailer';
import dns from 'dns';

// Force Node to prefer IPv4 first when resolving hostnames.
// This prevents ENETUNREACH errors on networks/platforms that do not support IPv6.
if (dns && typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

let activeTransporter = null;

/**
 * Creates and verifies a reusable Nodemailer transporter.
 * Manually resolves the hostname to IPv4 first to bypass IPv6 ENETUNREACH errors.
 */
const getTransporter = async () => {
  if (activeTransporter) return activeTransporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 465;

  let targetHost = host;
  const tlsOptions = {};

  if (host) {
    try {
      const resolvedIp = await new Promise((resolve, reject) => {
        dns.lookup(host, { family: 4 }, (err, address) => {
          if (err || !address) {
            reject(err || new Error(`No IPv4 address resolved for host ${host}`));
          } else {
            resolve(address);
          }
        });
      });
      console.log(`📡 Resolved SMTP host ${host} to IPv4: ${resolvedIp}`);
      targetHost = resolvedIp;
      tlsOptions.servername = host; // Essential for verifying TLS certificates on IP connection
    } catch (error) {
      console.warn(`⚠️ Failed to resolve SMTP host ${host} to IPv4 (falling back to hostname):`, error.message);
    }
  }

  activeTransporter = nodemailer.createTransport({
    host: targetHost,
    port,
    secure: port === 465, // true for port 465 (SSL), false for 587 (TLS/STARTTLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: tlsOptions,
  });

  return activeTransporter;
};

// Export a compatible object proxying the original transporter API
export const transporter = {
  sendMail: async (mailOptions) => {
    const transport = await getTransporter();
    return transport.sendMail(mailOptions);
  },
  verify: async (callback) => {
    try {
      const transport = await getTransporter();
      transport.verify(callback);
    } catch (error) {
      callback(error);
    }
  },
};

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

