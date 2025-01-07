const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const multer = require('multer');

// AWS S3 Configuration
const s3Client = new S3Client({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to generate a signed URL for accessing objects
async function getObjectURL(bucketName, key) {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    const url = await getSignedUrl(s3Client, command); // URL expires in 1 hour
    return url;
  } catch (error) {
    console.error('Error generating signed URL:', error.message);
    throw error;
  }
}

// Multer configuration for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = {
  s3Client,
  getObjectURL,
  upload,
};
