import multer from 'multer';
import path from 'path';

// Storage config for profile pictures
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/user-profiles'); 
  },
  filename(req, file, cb) {
    cb(null, `${req.user._id}${path.extname(file.originalname)}`); 
  }
});

// File type filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG or PNG images are allowed'));
  }
};

const uploadProfilePic = multer({ storage, fileFilter });

export default uploadProfilePic;
