const crypto = require('crypto');
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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    require: [true, 'Please provide a password'],
    // maxlenght: [15, 'A password must have a less or equal then 10 characters'],
    minlength: [8, 'A password must have a more or equal then 8 characters'],
    select: false
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
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  // cancel persisting passwordConfirm in DB
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    return JWTTimestamp < parseInt(this.passwordChangedAt.getTime() / 1000, 10);
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
