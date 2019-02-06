const createError = require('http-errors');

module.exports.isMe = (param = 'id') => {
  return (req, res, next) => {
    const user_id = req.params[param];
    if (!req.isAuthenticated()) {
      throw createError(403);
    } else if (user_id !== req.user.id) {
      throw createError(401);
    } else {
      next();
    }
  }
}
