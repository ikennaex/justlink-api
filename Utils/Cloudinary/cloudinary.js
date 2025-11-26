const streamifier = require("streamifier");
const sharp = require("sharp"); // Add this
const cloudinary = require("../../Config/cloudinary");

const uploadToCloudinary = async (fileBuffer, folder = "uploads") => {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Resize and compress the image buffer before upload
      const resizedBuffer = await sharp(fileBuffer)
        .resize({ width: 1200 }) // reduce width (adjust as needed)
        .jpeg({ quality: 80 }) // compress quality to 80%
        .toBuffer();

      // 2. Create Cloudinary upload stream
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      // 3. Pipe the resized buffer instead of original
      streamifier.createReadStream(resizedBuffer).pipe(uploadStream);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = uploadToCloudinary;
