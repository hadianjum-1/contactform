import nodemailer from "nodemailer";
import dns from "dns";

// Force Node to prefer IPv4 first when resolving hostnames.
if (dns && typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

const createTransporter = () => {
  // If RESEND_API_KEY is present, we return a mock transporter that uses Resend's HTTPS API
  if (process.env.RESEND_API_KEY) {
    console.log("[mailer] RESEND_API_KEY detected. Using Resend HTTPS API for emails.");
    return {
      sendMail: async (mailOptions) => {
        try {
          const to = Array.isArray(mailOptions.to) 
            ? mailOptions.to 
            : typeof mailOptions.to === "string"
              ? mailOptions.to.split(",").map(s => s.trim())
              : [];
          
          const cc = mailOptions.cc 
            ? (Array.isArray(mailOptions.cc) 
                ? mailOptions.cc 
                : typeof mailOptions.cc === "string"
                  ? mailOptions.cc.split(",").map(s => s.trim())
                  : [])
            : undefined;

          const bcc = mailOptions.bcc 
            ? (Array.isArray(mailOptions.bcc) 
                ? mailOptions.bcc 
                : typeof mailOptions.bcc === "string"
                  ? mailOptions.bcc.split(",").map(s => s.trim())
                  : [])
            : undefined;

          // Convert attachments to Resend API format if present
          const attachments = mailOptions.attachments
            ? mailOptions.attachments.map(att => {
                let base64Content = "";
                if (Buffer.isBuffer(att.content)) {
                  base64Content = att.content.toString("base64");
                } else if (typeof att.content === "string") {
                  base64Content = att.content;
                }
                return {
                  filename: att.filename,
                  content: base64Content,
                  content_type: att.contentType || att.content_type,
                };
              })
            : undefined;

          const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: mailOptions.from || process.env.FROM_EMAIL,
              to,
              cc,
              bcc,
              subject: mailOptions.subject,
              html: mailOptions.html,
              text: mailOptions.text,
              reply_to: mailOptions.replyTo || mailOptions.reply_to,
              attachments,
            }),
          });

          const responseData = await response.json();
          if (!response.ok) {
            throw new Error(responseData.message || `Resend API returned status ${response.status}`);
          }

          console.log("[mailer] Email sent successfully via Resend API:", responseData.id);
          return { messageId: responseData.id };
        } catch (err) {
          console.error("[mailer] Resend API failed:", err.message);
          throw err;
        }
      },
      verify: (callback) => {
        if (typeof callback === "function") {
          callback(null, true);
        }
        return Promise.resolve(true);
      }
    };
  }

  // Fallback to standard SMTP
  console.log("[mailer] No RESEND_API_KEY detected. Initializing standard SMTP transporter.");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000, // 10 seconds timeout to fail fast on blocked networks
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  return transporter;
};

export const transporter = createTransporter();

// Verify connection
if (transporter && typeof transporter.verify === "function") {
  transporter.verify((err) => {
    if (err) {
      console.warn("[mailer] SMTP Connection warning/failure (expected if ports are blocked on Render free tier):", err.message);
    } else {
      console.log("[mailer] SMTP Connection verified successfully.");
    }
  });
}