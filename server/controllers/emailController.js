const nodemailer = require('nodemailer');
const User = require('./../models/userModel');

const transporter = nodemailer.createTransport({
  host: 'mail.inkless.ro',
  service: 'mail.inkless.ro',
  secure: true,
  port: 465,
  starttls: {
    enable: true
  },
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

exports.sendFeedback = async (req, res) => {
  if (!req.body.receiverUsername || !req.body.message)
    return res.status(400).json({
      status: 'fail',
      message: 'Please check the request body and try again.'
    });

  try {
    const user = await User.findOne({ username: req.body.receiverUsername });
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err
    });
  }

  const text = `
    ${req.tokenUsername} left you a feedback! Here's what they said:
    ${req.body.message}
  `;

  let helperOptions = {
    from: `"Inkless" <${process.env.ADMIN_EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject: 'New feedback on your Coding Showcase Project!',
    text
  };

  transporter.sendMail(helperOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        status: 'fail',
        message: 'Internal server error.'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Email has been sent.'
    });

    // console.log(info);
  });
};
