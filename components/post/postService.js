const cloudinary = require('cloudinary').v2;

exports.uploadStreamToCloudinary = ({ buffer, projectId }) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          width: 450,
          height: 310,
          public_id: `${process.env.CLOUDINARY_IMAGE_DIRECTORY}/${projectId}`,
          secure: true
        },
        (err, result) => {
          if (err) return reject(err);
          return resolve(result);
        }
      )
      .end(buffer);
  });
};
