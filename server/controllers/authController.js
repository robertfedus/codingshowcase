const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./../models/userModel');

exports.register = async (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.password)
    return res.status(400).json({
      status: 'fail',
      message: 'Please check the request body and try again!'
    });

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const userObj = {
    username: req.body.username,
    email: req.body.email,
    password
  };

  try {
    const user = new User(userObj);
    await user.save();
    user.password = undefined;

    return createToken(res, user);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: 'fail',
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err
    });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).select('+password');

    const validPass = user ? await bcrypt.compare(req.body.password, user.password) : undefined;

    if (!user || !validPass) {
      return res.status(401).json({
        status: 'fail',
        message: 'Please check your username and password and try again.'
      });
    }

    user.password = undefined;
    return createToken(res, user);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: 'fail',
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err
    });
  }
};

const createToken = (res, user) => {
  return jwt.sign({ username: user.username }, process.env.JWT_SECRET, (err, token) => {
    return res.status(200).json({
      status: 'success',
      message: 'Succes!',
      data: { user, token }
    });
  });
};
