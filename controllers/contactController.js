import { transporter } from "../config/mailer.js";
import { buildOwnerEmail, buildConfirmationEmail } from "../utils/emailTemplates.js";

const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024; // 10 MB

export const handleContact = async (req, res, next) => {
  try {
    const {
      name,
      email,
      company,
      website,
      phone,
      country,
      service,
      budget,
      timeline,
      businessGoals,
      projectDetails,
      attachment, // { filename, type, content (base64) } | null
    } = req.body;

    let nodemailerAttachments = [];

    // Validate optional attachment
    if (attachment && attachment.content) {
      if (!ALLOWED_MIME.has(attachment.type)) {
        return res.status(422).json({
          success: false,
          message: "Attachment must be a PDF, DOC, or DOCX file.",
        });
      }

      const byteLength = Buffer.byteLength(attachment.content, "base64");
      if (byteLength > MAX_ATTACHMENT_BYTES) {
        return res.status(422).json({
          success: false,
          message: "Attachment must be 10 MB or smaller.",
        });
      }

      nodemailerAttachments = [
        {
          filename: attachment.filename,
          content: Buffer.from(attachment.content, "base64"),
          contentType: attachment.type,
        },
      ];
    }

    const formData = {
      name,
      email,
      company,
      website,
      phone,
      country,
      service,
      budget,
      timeline,
      businessGoals,
      projectDetails,
    };

    // Email #1: To Owner with attachment if present
    const ownerMailOptions = {
      ...buildOwnerEmail(formData),
      attachments: nodemailerAttachments,
    };

    // Email #2: To Customer with specific subject requested
    const confirmationMailOptions = {
      ...buildConfirmationEmail(formData),
      subject: "Thank you for contacting NexGenByte",
    };

    // Send both emails concurrently using Hostinger SMTP Nodemailer transporter
    await Promise.all([
      transporter.sendMail(ownerMailOptions),
      transporter.sendMail(confirmationMailOptions),
    ]);

    return res.status(200).json({
      success: true,
      message: "Your inquiry has been sent successfully.",
    });
  } catch (error) {
    console.error("[contactController] Failed to send email:", error.message);
    next(
      Object.assign(new Error("Unable to send your inquiry. Please try again."), {
        statusCode: 500,
      })
    );
  }
};
