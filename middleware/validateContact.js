import { body, validationResult } from 'express-validator';

/* ─────────────────────────────────────────────────────────────
   Validation chain
───────────────────────────────────────────────────────────── */
export const contactValidators = [
  body('name')
    .trim()
    .escape()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters.'),

  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please enter a valid email address.'),

  body('company')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Company name is required.'),

  body('website')
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .isURL({ require_protocol: true })
    .withMessage('Please enter a valid URL (include https://).'),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .escape(),

  body('country')
    .trim()
    .escape()
    .isLength({ min: 2 })
    .withMessage('Country is required.'),

  body('service')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Please select a service.')
    .isIn(['Website Design', 'Web Application', 'E-commerce', 'Branding', 'Other'])
    .withMessage('Invalid service selected.'),

  body('budget')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Please select a budget range.')
    .isIn(['under-5k', '5k-15k', '15k-30k', '30k-plus'])
    .withMessage('Invalid budget range.'),

  body('timeline')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Timeline is required.'),

  body('businessGoals')
    .trim()
    .escape()
    .isLength({ min: 10 })
    .withMessage('Business goals must be at least 10 characters.'),

  body('projectDetails')
    .trim()
    .escape()
    .isLength({ min: 20 })
    .withMessage('Project description must be at least 20 characters.'),

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
