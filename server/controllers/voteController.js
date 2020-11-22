const Project = require('./../models/projectModel');

exports.vote = async (req, res) => {
  try {
    if (!req.body.type || !req.body.id)
      return res.status(400).json({
        status: 'fail',
        message: 'Please check the request body and try again.'
      });
    const username = req.tokenUsername;
    const project = await Project.findOne({ _id: req.body.id });
    if (
      (project.upVotes.includes(username) && req.body.type === 'up') ||
      (project.downVotes.includes(username) && req.body.type === 'down')
    ) {
      return res.status(409).json({
        status: 'fail',
        message: 'You have already voted!'
      });
    } else {
      for (const [i, vote] of project.upVotes)
        if (vote === username) {
          project.upVotes[i] = undefined;
          console.log(project.upVotes[i]);
        }

      for (vote of project.downVotes) if (vote === username) vote = '';

      if (req.body.type === 'up') project.upVotes.push(username);
      else if (req.body.type === 'down') project.downVotes.push(username);
    }

    await project.save();

    return res.status(200).json({
      status: 'success',
      message: 'Voted!'
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'fail',
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err
    });
  }
};
