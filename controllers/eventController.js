const eventModel = require('../models/eventModel');
const registrationModel = require('../models/registrationModel');
const { getValidationErrors } = require('../middleware/validation');
function dashboard(req, res) {
  if (req.session.user.role === 'charity') return res.render('dashboard', { mode: 'charity', events: eventModel.listByCharity(req.session.user.id), errors: [], values: {} });
  return res.render('dashboard', { mode: 'student', events: eventModel.listUpcoming(), errors: [], values: {} });
}
function create(req, res) {
  const errors = getValidationErrors(req);
  const values = { title: req.body.title, description: req.body.description, location: req.body.location, eventDate: req.body.eventDate, capacity: req.body.capacity };
  if (errors.length) return res.status(400).render('dashboard', { mode: 'charity', events: eventModel.listByCharity(req.session.user.id), errors, values });
  const event = eventModel.createEvent({ charityId: req.session.user.id, title: req.body.title.trim(), description: req.body.description.trim(), location: req.body.location.trim(), eventDate: new Date(req.body.eventDate).toISOString(), capacity: Number(req.body.capacity) });
  req.session.flash = { type: 'success', message: 'Volunteer event created successfully.' };
  return res.redirect(`/events/${event.id}`);
}
function details(req, res) {
  const event = eventModel.findById(Number(req.params.id));
  if (!event) return res.status(404).render('event', { event: null, registered: false, registrants: [], errors: [{ msg: 'Event not found.' }] });
  const registered = req.session.user?.role === 'student' ? Boolean(registrationModel.findByStudentAndEvent(req.session.user.id, event.id)) : false;
  const registrants = req.session.user?.role === 'charity' && req.session.user.id === event.charity_id ? eventModel.listRegistrants(event.id) : [];
  return res.render('event', { event, registered, registrants, errors: [] });
}
module.exports = { dashboard, create, details };
