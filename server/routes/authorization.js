const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config({ path: './config.env' });
}

exports.protected = async (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');

    const token = bearer[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) throw new Error();
    });

    const decodedToken = jwt.decode(token);

    try {
      const user = await User.findOne({ username: decodedToken.username });

      if (!user)
        return res.status(401).json({
          status: 'fail',
          message: 'Invalid bearer token'
        });
      else {
        req.tokenUsername = decodedToken.username;
        return next();
      }
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        status: 'fail',
        message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err
      });
    }
  } else {
    return res.status(403).json({
      status: 'fail',
      message: 'Invalid bearer token'
    });
  }
};
