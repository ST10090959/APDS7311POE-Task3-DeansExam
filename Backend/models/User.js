const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Custom ID with prefix (CUST, EMP, AD)
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'employee', 'admin'], required: true }
});

module.exports = mongoose.model('User', UserSchema);
