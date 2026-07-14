import nodemailer from "nodemailer";

const getTransporterConfig = (port) => {
  return {
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port: port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Shorter timeouts so that failover/timeout response is handled quickly
    connectionTimeout: 8000, // 8 seconds
    greetingTimeout: 8000,
    socketTimeout: 8000,
    tls: {
      // Permissive TLS options to bypass potential local cert/DNS resolution issues
      rejectUnauthorized: false,
    },
  };
};

const defaultPort = Number(process.env.SMTP_PORT) || 465;
console.log(`[mailer] Initializing primary transporter on port ${defaultPort}...`);

let currentTransporter = nodemailer.createTransport(getTransporterConfig(defaultPort));

export const transporter = {
  sendMail: async (mailOptions) => {
    console.log(`[mailer] sendMail invoked. Attempting delivery via port ${defaultPort}...`);
    try {
      const result = await currentTransporter.sendMail(mailOptions);
      console.log(`[mailer] Delivery succeeded via port ${defaultPort}.`);
      return result;
    } catch (err) {
      console.error(`[mailer] Delivery failed on port ${defaultPort}:`, err.message);

      // If the default port is 465, try fallback to 587
      if (defaultPort === 465) {
        console.warn(`[mailer] Port 465 timed out or failed. Retrying delivery via Port 587 with STARTTLS...`);
        try {
          const fallbackTransporter = nodemailer.createTransport(getTransporterConfig(587));
          const result = await fallbackTransporter.sendMail(mailOptions);
          console.log(`[mailer] Delivery succeeded via fallback port 587.`);
          return result;
        } catch (fallbackErr) {
          console.error(`[mailer] Fallback delivery failed on port 587:`, fallbackErr.message);
          throw fallbackErr;
        }
      }
      throw err;
    }
  },
  verify: (callback) => {
    console.log(`[mailer] verify invoked. Verifying SMTP server connection on default port ${defaultPort}...`);
    currentTransporter.verify((err, success) => {
      if (err) {
        console.error(`[mailer] SMTP connection verification failed on default port ${defaultPort}:`, err.message);
        
        if (defaultPort === 465) {
          console.warn(`[mailer] Primary port 465 verification failed. Attempting verification on fallback port 587...`);
          const fallbackTransporter = nodemailer.createTransport(getTransporterConfig(587));
          fallbackTransporter.verify((fallbackErr, fallbackSuccess) => {
            if (fallbackErr) {
              console.error(`[mailer] Fallback verification also failed on port 587:`, fallbackErr.message);
              if (typeof callback === "function") callback(fallbackErr);
            } else {
              console.log(`[mailer] Fallback verification succeeded on port 587.`);
              currentTransporter = fallbackTransporter; // Switch transporter to the working fallback
              if (typeof callback === "function") callback(null, fallbackSuccess);
            }
          });
        } else {
          if (typeof callback === "function") callback(err);
        }
      } else {
        console.log(`[mailer] SMTP connection verified successfully on port ${defaultPort}.`);
        if (typeof callback === "function") callback(null, success);
      }
    });
  }
};

// Perform connection verification check on startup
transporter.verify((err) => {
  if (err) {
    console.error("[mailer] Startup connection verification failed:", err.message);
  } else {
    console.log("[mailer] Startup connection verification succeeded.");
  }
});