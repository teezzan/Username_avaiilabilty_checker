var mongoose = require('mongoose');


var UserSchema = new mongoose.Schema({
  fullname: { type: String, default:""},
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');