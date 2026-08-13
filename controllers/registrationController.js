const eventModel = require('../models/eventModel');
const registrationModel = require('../models/registrationModel');
function register(req, res) {
  const eventId = Number(req.params.id);
  const event = eventModel.findById(eventId);
  if (!event) { req.session.flash = { type: 'error', message: 'Event not found.' }; return res.redirect('/dashboard'); }
  if (req.session.user.role !== 'student') { req.session.flash = { type: 'error', message: 'Only student accounts can register for events.' }; return res.redirect(`/events/${eventId}`); }
  if (new Date(event.event_date) <= new Date()) { req.session.flash = { type: 'error', message: 'This event is no longer available for registration.' }; return res.redirect(`/events/${eventId}`); }
  if (event.registered_count >= event.capacity) { req.session.flash = { type: 'error', message: 'This event is already full.' }; return res.redirect(`/events/${eventId}`); }
  if (registrationModel.findByStudentAndEvent(req.session.user.id, eventId)) { req.session.flash = { type: 'error', message: 'You are already registered for this event.' }; return res.redirect(`/events/${eventId}`); }
  registrationModel.createRegistration(req.session.user.id, eventId);
  req.session.flash = { type: 'success', message: 'You are now registered for this volunteer event.' };
  return res.redirect(`/events/${eventId}`);
}
module.exports = { register };
