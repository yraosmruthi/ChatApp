const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: Cloudinary_cloud_name,
  api_key: Cloudinary_api_key,
  api_secret: Cloudinary_api_secret,
  secure: true,
});
