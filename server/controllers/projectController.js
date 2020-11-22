const Project = require('./../models/projectModel');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
const url = require('url');
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config({ path: './config.env' });
}

const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  Bucket: process.env.S3_BUCKET_NAME
});
const projectImgUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    key: (req, file, callback) => {
      callback(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          '-' +
          Date.now() +
          path.extname(file.originalname)
      );
    }
  }),
  limits: { fileSize: 5000000 }, // 5MB
  fileFilter: (req, file, callback) => {
    checkFileType(file, callback);
  }
}).single('projectImage');

const checkFileType = (file, callback) => {
  const filetypes = /jpeg|jpg|png|gif/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return callback(null, true);
  } else {
    callback('Error: only images are allowed.');
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();

    return res.status(200).json({
      status: 'succes',
      projects
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'fail',
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err
    });
  }
};

exports.uploadProject = async (req, res) => {
  // if (!req.body.name || !req.body.description || !req.body.category || !req.body.technologies)
  //   return res.status(400).json({
  //     status: 'fail',
  //     message: 'Check the request body and try again!'
  //   });

  projectImgUpload(req, res, error => {
    if (error) {
      console.log('errors', error);
      res.json({ error: error });
    } else {
      // If File not found
      if (req.file === undefined) {
        console.log('Error: no file selected!');
        res.json('Error: no file selected');
      } else {
        // If success
        try {
          const imageName = req.file.key;

          const projectObj = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            technologies: req.body.technologies,
            githubLink: req.body.githubLink,
            imageName,
            uploadedBy: req.tokenUsername
          };
          Project.create(projectObj);
          // https://robertfedusbucket.s3.eu-central-1.amazonaws.com/
          return res.status(200).json({
            status: 'success',
            message: 'Project uploaded successfully!',
            imageName
          });
        } catch (err) {
          console.log(err);
          return res.status(500).json({
            status: 'fail',
            message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err
          });
        }
      }
    }
  });
};
