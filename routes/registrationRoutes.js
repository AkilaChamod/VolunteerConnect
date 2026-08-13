const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { eventIdValidation, getValidationErrors } = require('../middleware/validation');
router.post('/:id/register', requireAuth, requireRole('student'), eventIdValidation, (req, res, next) => {
  if (getValidationErrors(req).length) { req.session.flash = { type: 'error', message: 'Invalid event ID.' }; return res.redirect('/dashboard'); }
  next();
}, registrationController.register);
module.exports = router;
