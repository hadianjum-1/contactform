import { transporter } from '../config/mailer.js';
import { buildOwnerEmail, buildConfirmationEmail } from '../utils/emailTemplates.js';

/* ─────────────────────────────────────────────────────────────
   Allowed attachment MIME types (mirrors frontend validation)
───────────────────────────────────────────────────────────── */
const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024; // 10 MB

/* ─────────────────────────────────────────────────────────────
   POST /api/contact
───────────────────────────────────────────────────────────── */
export const handleContact = async (req, res, next) => {
  try {
    const {
      name, email, company, website, phone,
      country, service, budget, timeline,
      businessGoals, projectDetails,
      attachment, // { filename, type, content (base64) } | null
    } = req.body;

    // ── Validate optional attachment ────────────────────────
    let nodemailerAttachments = [];

    if (attachment && attachment.content) {
      if (!ALLOWED_MIME.has(attachment.type)) {
        return res.status(422).json({
          success: false,
          message: 'Attachment must be a PDF, DOC, or DOCX file.',
        });
      }

      const byteLength = Buffer.byteLength(attachment.content, 'base64');
      if (byteLength > MAX_ATTACHMENT_BYTES) {
        return res.status(422).json({
          success: false,
          message: 'Attachment must be 10 MB or smaller.',
        });
      }

      nodemailerAttachments = [
        {
          filename: attachment.filename,
          content:  Buffer.from(attachment.content, 'base64'),
          contentType: attachment.type,
        },
      ];
    }

    // ── Build email options ─────────────────────────────────
    const formData = {
      name, email, company, website, phone,
      country, service, budget, timeline,
      businessGoals, projectDetails,
    };

    const ownerMailOptions = {
      ...buildOwnerEmail(formData),
      attachments: nodemailerAttachments,
    };

    const confirmationMailOptions = buildConfirmationEmail(formData);

    // ── Send both emails concurrently ───────────────────────
    await Promise.all([
      transporter.sendMail(ownerMailOptions),
      transporter.sendMail(confirmationMailOptions),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your inquiry has been sent successfully.',
    });

  } catch (error) {
    console.error('[contactController] Failed to send email:', error.message);

    // Pass to global error handler
    next(
      Object.assign(new Error('Unable to send your inquiry. Please try again.'), {
        statusCode: 500,
      })
    );
  }
};
