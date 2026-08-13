const express = require('express');
const router = express.Router();

const eventController = require('../controllers/eventController');

const {
  requireAuth,
  requireRole
} = require('../middleware/auth');

const {
  eventValidation,
  eventIdValidation
} = require('../middleware/validation');

// Event details
router.get(
  '/:id',
  requireAuth,
  eventIdValidation,
  eventController.details
);

// Charity creates an event
router.post(
  '/',
  requireAuth,
  requireRole('charity'),
  eventValidation,
  eventController.create
);

module.exports = router;