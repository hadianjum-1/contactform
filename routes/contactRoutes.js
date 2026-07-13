import { Router } from 'express';
import { contactValidators, handleValidationErrors } from '../middleware/validateContact.js';
import { handleContact } from '../controllers/contactController.js';

const router = Router();

router.options('/', (_req, res) => {
  res.sendStatus(204);
});

/**
 * POST /api/contact
 *
 * Pipeline:
 *  1. contactValidators   — express-validator rules + sanitize-html
 *  2. handleValidationErrors — collect errors → respond 422
 *  3. handleContact        — send emails, respond 200
 */
router.post('/', contactValidators, handleValidationErrors, handleContact);

export default router;
