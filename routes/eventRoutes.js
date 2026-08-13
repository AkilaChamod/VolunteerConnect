const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { eventValidation, eventIdValidation } = require('../middleware/validation');
router.get('/dashboard', requireAuth, eventController.dashboard);
router.get('/:id', requireAuth, eventIdValidation, eventController.details);
router.post('/', requireAuth, requireRole('charity'), eventValidation, eventController.create);
module.exports = router;
