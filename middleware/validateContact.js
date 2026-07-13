import { body, validationResult } from 'express-validator';
import sanitizeHtml from 'sanitize-html';

/* ─────────────────────────────────────────────────────────────
   sanitize-html config — strip ALL tags / attributes
───────────────────────────────────────────────────────────── */
const sanitizeOptions = { allowedTags: [], allowedAttributes: {} };

const sanitize = (value) =>
  typeof value === 'string' ? sanitizeHtml(value.trim(), sanitizeOptions) : value;

/* ─────────────────────────────────────────────────────────────
   Validation chain
───────────────────────────────────────────────────────────── */
export const contactValidators = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters.')
    .customSanitizer(sanitize),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail(),

  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company name is required.')
    .customSanitizer(sanitize),

  body('website')
    .optional({ checkFalsy: true })
    .trim()
    .isURL({ require_protocol: true })
    .withMessage('Please enter a valid URL (include https://).')
    .customSanitizer(sanitize),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .customSanitizer(sanitize),

  body('country')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Country is required.')
    .customSanitizer(sanitize),

  body('service')
    .trim()
    .notEmpty()
    .withMessage('Please select a service.')
    .isIn(['Website Design', 'Web Application', 'E-commerce', 'Branding', 'Other'])
    .withMessage('Invalid service selected.')
    .customSanitizer(sanitize),

  body('budget')
    .trim()
    .notEmpty()
    .withMessage('Please select a budget range.')
    .isIn(['under-5k', '5k-15k', '15k-30k', '30k-plus'])
    .withMessage('Invalid budget range.')
    .customSanitizer(sanitize),

  body('timeline')
    .trim()
    .notEmpty()
    .withMessage('Timeline is required.')
    .customSanitizer(sanitize),

  body('businessGoals')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Business goals must be at least 10 characters.')
    .customSanitizer(sanitize),

  body('projectDetails')
    .trim()
    .isLength({ min: 20 })
    .withMessage('Project description must be at least 20 characters.')
    .customSanitizer(sanitize),

  // attachment is validated separately in the controller (size, mimetype)
];

/* ─────────────────────────────────────────────────────────────
   Middleware: collect validation errors and respond 422
───────────────────────────────────────────────────────────── */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return res.status(422).json({
      success: false,
      message: messages[0], // return the first error to the client
      errors: messages,
    });
  }
  next();
};
