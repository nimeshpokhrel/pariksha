const { createUploadthing } = require("uploadthing/next");

const f = createUploadthing();

const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10,
    },
  }).onUploadComplete(async ({ file }) => {
    return { uploadedBy: "Admin" };
  }),
};

module.exports = { ourFileRouter };
