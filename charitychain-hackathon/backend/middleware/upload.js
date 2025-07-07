const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadsDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = path.extname(file.originalname)
    const basename = path.basename(file.originalname, extension)
    cb(null, `${basename}-${uniqueSuffix}${extension}`)
  }
})

// File filter for security
const fileFilter = (req, file, cb) => {
  // Allowed file types for NGO verification documents
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false)
  }
}

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 20 // Maximum 20 files per request
  },
  fileFilter: fileFilter
})

// Middleware for handling upload errors
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum 10MB per file.' })
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Maximum 20 files per request.' })
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Unexpected file field.' })
    }
  }
  
  if (error.message.includes('File type')) {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

// Export upload middleware
const uploadMiddleware = upload

// Single file upload
const uploadSingle = (fieldName) => upload.single(fieldName)

// Multiple files upload
const uploadMultiple = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount)

// Multiple fields upload
const uploadFields = (fields) => upload.fields(fields)

// Serve uploaded files
const serveUploads = (req, res, next) => {
  const filename = req.params.filename
  const filePath = path.join(uploadsDir, filename)
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' })
  }

  // Security check - ensure file is within uploads directory
  const resolvedPath = path.resolve(filePath)
  const resolvedUploadsDir = path.resolve(uploadsDir)
  
  if (!resolvedPath.startsWith(resolvedUploadsDir)) {
    return res.status(403).json({ error: 'Access denied' })
  }

  res.sendFile(resolvedPath)
}

// Delete uploaded file
const deleteUploadedFile = (filename) => {
  try {
    const filePath = path.join(uploadsDir, filename)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return true
    }
    return false
  } catch (error) {
    console.error('Error deleting file:', error)
    return false
  }
}

// Get file info
const getFileInfo = (filename) => {
  try {
    const filePath = path.join(uploadsDir, filename)
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath)
      return {
        filename,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      }
    }
    return null
  } catch (error) {
    console.error('Error getting file info:', error)
    return null
  }
}

module.exports = {
  uploadMiddleware,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  handleUploadError,
  serveUploads,
  deleteUploadedFile,
  getFileInfo
};
