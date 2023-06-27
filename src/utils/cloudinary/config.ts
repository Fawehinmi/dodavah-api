import configuration from 'src/config/configuration';

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: configuration().cloudinary.name,
  api_key: configuration().cloudinary.key,
  api_secret: configuration().cloudinary.secret,
});

module.exports = { cloudinary };
