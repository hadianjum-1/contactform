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

    console.log(`[contactController] Received contact form submission from: ${email}`);

    let nodemailerAttachments = [];

    // Validate optional attachment
    if (attachment && attachment.content) {
      console.log(`[contactController] Validating attachment: ${attachment.filename} (${attachment.type})`);
      if (!ALLOWED_MIME.has(attachment.type)) {
        console.warn(`[contactController] Attachment validation failed: Invalid MIME type ${attachment.type}`);
        return res.status(422).json({
          success: false,
          message: "Attachment must be a PDF, DOC, or DOCX file.",
        });
      }

      const byteLength = Buffer.byteLength(attachment.content, "base64");
      if (byteLength > MAX_ATTACHMENT_BYTES) {
        console.warn(`[contactController] Attachment validation failed: Size ${byteLength} bytes exceeds 10MB limit`);
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
      console.log(`[contactController] Attachment validation passed and buffered.`);
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

    console.log("[contactController] Initiating email sending pipeline...");

    const sendOwnerMail = async () => {
      console.log("[contactController] Sending Owner notification email...");
      const result = await transporter.sendMail(ownerMailOptions);
      console.log("[contactController] Owner notification email sent successfully.");
      return result;
    };

    const sendCustomerMail = async () => {
      console.log("[contactController] Sending Customer confirmation email...");
      const result = await transporter.sendMail(confirmationMailOptions);
      console.log("[contactController] Customer confirmation email sent successfully.");
      return result;
    };

    // Send both emails concurrently
    await Promise.all([sendOwnerMail(), sendCustomerMail()]);

    console.log("[contactController] All emails sent successfully. Returning success to client.");

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
