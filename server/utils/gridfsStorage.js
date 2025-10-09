const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer");

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => ({
    bucketName: "users-payments-uploads",
    filename: Date.now() + "-" + file.originalname,
    metadata: {
      userEmail: req.body.userEmail,
      serviceId: req.body.serviceId,
    },
  }),
});

const upload = multer({ storage });
module.exports = upload;