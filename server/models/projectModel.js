const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 1
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  technologies: {
    type: String,
    required: true
  },
  imageName: {
    type: String,
    required: true
  },
  upVotes: {
    type: Array,
    default: []
  },
  downVotes: {
    type: Array,
    default: []
  },
  githubLink: {
    type: String
  },
  uploadedBy: {
    type: String
  }
});

module.exports = mongoose.model('Project', newSchema);
