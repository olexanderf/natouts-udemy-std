const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'User must have a name'],
    unique: true
    // maxlenght: [20, 'A user name must have a less or equal then 20 characters'],
    // minlength: [3, 'A user name must have a more or equal then 3 characters']
  },
  email: {
    type: String,
    require: [true, 'User must have a email'],
    unique: true,
    lowercase: true,
    // validate: {
    //   validator: function (email) {
    //     return email.match(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
    //   },
    //   message: 'Email address is invalid'
    // }
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: {
    type: String
  },
  password: {
    type: String,
    require: [true, 'Please provide a password'],
    // maxlenght: [15, 'A password must have a less or equal then 10 characters'],
    minlength: [8, 'A password must have a more or equal then 8 characters']
  },
  passwordConfirm: {
    type: String,
    require: [true, 'Please confirm your password'],
    // maxlenght: [15, 'A password must have a less or equal then 10 characters'],
    minlength: [8, 'A password must have a more or equal then 8 characters'],
    validate: {
      validator: function (passwordConfirm) {
        return this.password === passwordConfirm;
      },
      message: 'Passwords don`t match'
    }
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
