const express = require('express');
const cors = require('cors');
const projectRouter = require('./routes/projectRoutes');
const authRouter = require('./routes/authRoutes');
const voteRouter = require('./routes/voteRoutes');
const emailRouter = require('./routes/emailRoutes');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/v1/project', projectRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/vote', voteRouter);
app.use('/api/v1/email', emailRouter);

module.exports = app;
