function requireAuth(req, res, next) {
  if (!req.session.user) { req.session.flash = { type: 'error', message: 'Please log in to continue.' }; return res.redirect('/'); }
  next();
}
function requireRole(role) {
  return (req, res, next) => {
    if (!req.session.user) { req.session.flash = { type: 'error', message: 'Please log in to continue.' }; return res.redirect('/'); }
    if (req.session.user.role !== role) { req.session.flash = { type: 'error', message: 'You are not authorised to perform that action.' }; return res.redirect('/dashboard'); }
    next();
  };
}
module.exports = { requireAuth, requireRole };
