const { body, param, validationResult } = require('express-validator');
const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be between 2 and 80 characters.'),
  body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('password').isLength({ min: 8, max: 128 }).withMessage('Password must be between 8 and 128 characters.'),
  body('role').isIn(['student', 'charity']).withMessage('Select a valid account type.')
];
const loginValidation = [
  body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('password').isLength({ min: 1, max: 128 }).withMessage('Enter your password.')
];
const eventValidation = [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters.'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters.'),
  body('location').trim().isLength({ min: 2, max: 160 }).withMessage('Location must be between 2 and 160 characters.'),
  body('eventDate').isISO8601().withMessage('Enter a valid event date and time.').custom(value => {
    if (new Date(value) <= new Date()) throw new Error('Event date must be in the future.');
    return true;
  }),
  body('capacity').isInt({ min: 1, max: 500 }).withMessage('Capacity must be between 1 and 500.')
];
const eventIdValidation = [param('id').isInt({ min: 1 }).withMessage('Invalid event ID.')];
function getValidationErrors(req) { return validationResult(req).array(); }
module.exports = { registerValidation, loginValidation, eventValidation, eventIdValidation, getValidationErrors };
