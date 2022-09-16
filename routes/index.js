const auth = require('./auth');
const users = require('./users');

module.exports = [].concat(auth, users);
