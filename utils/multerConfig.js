import multer from "multer";
import path from "path";

const multerConfig = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/notes/"); // Directory to store uploaded files
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed."));
    }
  };

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, //limit to 5 mb
    fileFilter,
  });
};

export { multerConfig };
