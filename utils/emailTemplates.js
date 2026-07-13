/**
 * emailTemplates.js
 * Premium HTML email templates for NexGenByte inquiries.
 * Both templates are fully responsive and use inline styles
 * for maximum email-client compatibility.
 */

/* ─────────────────────────────────────────────────────────────
   Shared palette (keeps both templates visually consistent)
───────────────────────────────────────────────────────────── */
const BRAND = {
  bg: '#0a0a0a',
  surface: '#111111',
  border: '#1f1f1f',
  accent: '#a78bfa',       // violet-400
  accentDark: '#7c3aed',   // violet-600
  text: '#f5f5f5',
  muted: '#888888',
  success: '#1e8e5a',
};

/* ─────────────────────────────────────────────────────────────
   Helper — formats a label / value row inside the table
───────────────────────────────────────────────────────────── */
const row = (label, value) => `
  <tr>
    <td style="padding:12px 16px;border-bottom:1px solid ${BRAND.border};
               color:${BRAND.muted};font-size:13px;white-space:nowrap;
               font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
               vertical-align:top;width:160px;">
      ${label}
    </td>
    <td style="padding:12px 16px;border-bottom:1px solid ${BRAND.border};
               color:${BRAND.text};font-size:14px;
               font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
               vertical-align:top;">
      ${value || '<span style="color:#555">—</span>'}
    </td>
  </tr>`;

/* ─────────────────────────────────────────────────────────────
   Budget label map
───────────────────────────────────────────────────────────── */
const budgetLabel = (raw) => {
  const map = {
    'under-5k':  'Under $5,000',
    '5k-15k':    '$5,000 – $15,000',
    '15k-30k':   '$15,000 – $30,000',
    '30k-plus':  '$30,000+',
  };
  return map[raw] || raw;
};

/* ─────────────────────────────────────────────────────────────
   INTERNAL OWNER EMAIL
   Recipient: hadi@nexgenbyte.com  CC: hadianjum278@gmail.com
───────────────────────────────────────────────────────────── */
export const buildOwnerEmail = (data) => {
  const {
    name, email, company, website, phone,
    country, service, budget, timeline,
    businessGoals, projectDetails,
  } = data;

  const submittedAt = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Karachi',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>New Website Inquiry — ${company}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="background:${BRAND.bg};padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0"
               style="max-width:600px;width:100%;">

          <!-- ── Header ── -->
          <tr>
            <td style="background:${BRAND.surface};border:1px solid ${BRAND.border};
                       border-radius:16px 16px 0 0;padding:40px 40px 32px;
                       text-align:center;">
              <div style="display:inline-block;background:linear-gradient(135deg,${BRAND.accentDark},${BRAND.accent});
                          border-radius:12px;padding:10px 20px;margin-bottom:24px;">
                <span style="color:#fff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                             font-weight:700;font-size:18px;letter-spacing:0.04em;">
                  NexGenByte
                </span>
              </div>
              <h1 style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                         font-size:22px;font-weight:700;color:${BRAND.text};line-height:1.3;">
                New Website Inquiry
              </h1>
              <p style="margin:8px 0 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                        font-size:14px;color:${BRAND.muted};">
                Submitted ${submittedAt} (PKT)
              </p>
            </td>
          </tr>

          <!-- ── Alert Banner ── -->
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND.accentDark}22,${BRAND.accent}11);
                       border-left:1px solid ${BRAND.border};border-right:1px solid ${BRAND.border};
                       padding:20px 40px;">
              <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                        font-size:15px;color:${BRAND.accent};font-weight:600;">
                🚀 A new lead has arrived from your website.
              </p>
              <p style="margin:4px 0 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                        font-size:13px;color:${BRAND.muted};">
                Review the details below and follow up within 24 hours.
              </p>
            </td>
          </tr>

          <!-- ── Contact Details ── -->
          <tr>
            <td style="background:${BRAND.surface};border-left:1px solid ${BRAND.border};
                       border-right:1px solid ${BRAND.border};padding:32px 40px 0;">
              <h2 style="margin:0 0 20px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                         font-size:13px;font-weight:700;color:${BRAND.muted};
                         text-transform:uppercase;letter-spacing:0.08em;">
                Contact Information
              </h2>
            </td>
          </tr>
          <tr>
            <td style="background:${BRAND.surface};border-left:1px solid ${BRAND.border};
                       border-right:1px solid ${BRAND.border};padding:0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                     style="border:1px solid ${BRAND.border};border-radius:10px;
                            border-collapse:collapse;overflow:hidden;">
                ${row('Full Name', name)}
                ${row('Email', `<a href="mailto:${email}" style="color:${BRAND.accent};text-decoration:none;">${email}</a>`)}
                ${row('Company', company)}
                ${row('Website', website ? `<a href="${website}" style="color:${BRAND.accent};text-decoration:none;">${website}</a>` : '')}
                ${row('Phone', phone)}
                ${row('Country', country)}
              </table>
            </td>
          </tr>

          <!-- ── Project Details ── -->
          <tr>
            <td style="background:${BRAND.surface};border-left:1px solid ${BRAND.border};
                       border-right:1px solid ${BRAND.border};padding:32px 40px 0;">
              <h2 style="margin:0 0 20px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                         font-size:13px;font-weight:700;color:${BRAND.muted};
                         text-transform:uppercase;letter-spacing:0.08em;">
                Project Information
              </h2>
            </td>
          </tr>
          <tr>
            <td style="background:${BRAND.surface};border-left:1px solid ${BRAND.border};
                       border-right:1px solid ${BRAND.border};padding:0 40px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                     style="border:1px solid ${BRAND.border};border-radius:10px;
                            border-collapse:collapse;overflow:hidden;">
                ${row('Service Requested', service)}
                ${row('Budget Range', budgetLabel(budget))}
                ${row('Timeline', timeline)}
              </table>
            </td>
          </tr>

          <!-- ── Business Goals ── -->
          <tr>
            <td style="background:${BRAND.surface};border-left:1px solid ${BRAND.border};
                       border-right:1px solid ${BRAND.border};padding:0 40px 24px;">
              <h2 style="margin:0 0 12px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                         font-size:13px;font-weight:700;color:${BRAND.muted};
                         text-transform:uppercase;letter-spacing:0.08em;">
                Business Goals
              </h2>
              <div style="background:${BRAND.bg};border:1px solid ${BRAND.border};
                          border-radius:10px;padding:20px;
                          font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                          font-size:14px;color:${BRAND.text};line-height:1.7;
                          white-space:pre-wrap;">
                ${businessGoals}
              </div>
            </td>
          </tr>

          <!-- ── Project Description ── -->
          <tr>
            <td style="background:${BRAND.surface};border-left:1px solid ${BRAND.border};
                       border-right:1px solid ${BRAND.border};padding:0 40px 32px;">
              <h2 style="margin:0 0 12px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                         font-size:13px;font-weight:700;color:${BRAND.muted};
                         text-transform:uppercase;letter-spacing:0.08em;">
                Project Description
              </h2>
              <div style="background:${BRAND.bg};border:1px solid ${BRAND.border};
                          border-radius:10px;padding:20px;
                          font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                          font-size:14px;color:${BRAND.text};line-height:1.7;
                          white-space:pre-wrap;">
                ${projectDetails}
              </div>
            </td>
          </tr>

          <!-- ── Footer ── -->
          <tr>
            <td style="background:${BRAND.bg};border:1px solid ${BRAND.border};
                       border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
              <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                        font-size:12px;color:${BRAND.muted};">
                This email was generated automatically by the NexGenByte contact system.<br>
                © ${new Date().getFullYear()} NexGenByte. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    from: `"NexGenByte Inquiries" <${process.env.FROM_EMAIL}>`,
    to: process.env.OWNER_EMAIL,
    cc: process.env.CC_EMAIL,
    subject: `New Website Inquiry — ${company}`,
    html,
    // Attachments are injected by the controller after file processing
  };
};

/* ─────────────────────────────────────────────────────────────
   VISITOR CONFIRMATION EMAIL
   Recipient: visitor's email address
───────────────────────────────────────────────────────────── */
export const buildConfirmationEmail = (data) => {
  const { name, email } = data;
  const firstName = name.split(' ')[0];

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>We've received your inquiry | NexGenByte</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="background:${BRAND.bg};padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0"
               style="max-width:600px;width:100%;">

          <!-- ── Header ── -->
          <tr>
            <td style="background:${BRAND.surface};border:1px solid ${BRAND.border};
                       border-radius:16px 16px 0 0;padding:40px 40px 32px;text-align:center;">
              <div style="display:inline-block;background:linear-gradient(135deg,${BRAND.accentDark},${BRAND.accent});
                          border-radius:12px;padding:10px 20px;margin-bottom:28px;">
                <span style="color:#fff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                             font-weight:700;font-size:18px;letter-spacing:0.04em;">
                  NexGenByte
                </span>
              </div>
              <div style="width:56px;height:56px;background:linear-gradient(135deg,${BRAND.accentDark}33,${BRAND.accent}22);
                          border:1px solid ${BRAND.border};border-radius:50%;
                          display:inline-flex;align-items:center;justify-content:center;
                          margin:0 auto 20px;display:block;line-height:56px;
                          font-size:24px;text-align:center;">
                ✅
              </div>
              <h1 style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                         font-size:24px;font-weight:700;color:${BRAND.text};line-height:1.3;">
                We've received your inquiry!
              </h1>
              <p style="margin:12px 0 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                        font-size:15px;color:${BRAND.muted};line-height:1.6;">
                Thank you for reaching out, ${firstName}. We're on it.
              </p>
            </td>
          </tr>

          <!-- ── Body ── -->
          <tr>
            <td style="background:${BRAND.surface};border-left:1px solid ${BRAND.border};
                       border-right:1px solid ${BRAND.border};padding:40px;">
              <p style="margin:0 0 20px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                        font-size:15px;color:${BRAND.text};line-height:1.8;">
                Hi <strong>${firstName}</strong>,
              </p>
              <p style="margin:0 0 20px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                        font-size:15px;color:${BRAND.muted};line-height:1.8;">
                Thank you for submitting your project inquiry to <strong style="color:${BRAND.text};">NexGenByte</strong>.
                We've successfully received all the details you've shared and our team is
                already reviewing your submission.
              </p>
              <p style="margin:0 0 32px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                        font-size:15px;color:${BRAND.muted};line-height:1.8;">
                A member of our team will reach out to you within
                <strong style="color:${BRAND.text};">24 hours</strong> to discuss next steps.
                If your project is time-sensitive, feel free to contact us directly.
              </p>

              <!-- CTA box -->
              <div style="background:${BRAND.bg};border:1px solid ${BRAND.border};
                          border-radius:12px;padding:28px 32px;text-align:center;">
                <p style="margin:0 0 8px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                          font-size:13px;font-weight:700;color:${BRAND.muted};
                          text-transform:uppercase;letter-spacing:0.08em;">
                  What happens next?
                </p>
                <div style="display:table;width:100%;margin:20px 0;">
                  <div style="display:table-row;">
                    <div style="display:table-cell;padding:8px 12px;text-align:center;
                                font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                                font-size:13px;color:${BRAND.muted};">
                      <div style="font-size:20px;margin-bottom:6px;">📋</div>
                      We review your brief
                    </div>
                    <div style="display:table-cell;padding:8px 12px;text-align:center;
                                font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                                font-size:13px;color:${BRAND.muted};">
                      <div style="font-size:20px;margin-bottom:6px;">📞</div>
                      Strategy call scheduled
                    </div>
                    <div style="display:table-cell;padding:8px 12px;text-align:center;
                                font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                                font-size:13px;color:${BRAND.muted};">
                      <div style="font-size:20px;margin-bottom:6px;">🚀</div>
                      Proposal delivered
                    </div>
                  </div>
                </div>
                <a href="https://nexgenbyte.com"
                   style="display:inline-block;margin-top:8px;
                          background:linear-gradient(135deg,${BRAND.accentDark},${BRAND.accent});
                          color:#fff;text-decoration:none;padding:12px 28px;
                          border-radius:8px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                          font-size:14px;font-weight:600;letter-spacing:0.02em;">
                  Visit NexGenByte →
                </a>
              </div>
            </td>
          </tr>

          <!-- ── Contact Row ── -->
          <tr>
            <td style="background:${BRAND.surface};border-left:1px solid ${BRAND.border};
                       border-right:1px solid ${BRAND.border};padding:0 40px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:20px;background:${BRAND.bg};border:1px solid ${BRAND.border};
                             border-radius:10px;text-align:center;">
                    <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                              font-size:13px;color:${BRAND.muted};">
                      Have a question? Reach us at
                      <a href="mailto:hadi@nexgenbyte.com"
                         style="color:${BRAND.accent};text-decoration:none;font-weight:600;">
                        hadi@nexgenbyte.com
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Footer ── -->
          <tr>
            <td style="background:${BRAND.bg};border:1px solid ${BRAND.border};
                       border-radius:0 0 16px 16px;padding:28px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                        font-size:14px;font-weight:700;color:${BRAND.text};
                        letter-spacing:0.04em;">
                NexGenByte
              </p>
              <p style="margin:0 0 12px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                        font-size:12px;color:${BRAND.muted};">
                Digital Excellence · Worldwide (Remote) · Pakistan, Peshawar
              </p>
              <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
                        font-size:11px;color:#444;">
                © ${new Date().getFullYear()} NexGenByte. All rights reserved.
                You received this email because you submitted an inquiry on
                <a href="https://nexgenbyte.com" style="color:#555;text-decoration:none;">nexgenbyte.com</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    from: `"NexGenByte" <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: `We've received your inquiry | NexGenByte`,
    html,
  };
};
