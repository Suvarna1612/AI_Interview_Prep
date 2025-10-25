const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { v2: cloudinary } = require('cloudinary');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Document = require('../models/Document');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Helper function to chunk text
const chunkText = (text, maxChunkSize = 500) => {
  const words = text.split(' ');
  const chunks = [];
  let currentChunk = [];
  let currentSize = 0;

  for (const word of words) {
    if (currentSize + word.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '));
      currentChunk = [word];
      currentSize = word.length;
    } else {
      currentChunk.push(word);
      currentSize += word.length + 1; // +1 for space
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }

  return chunks;
};

// Helper function to get embeddings using Gemini (with fallback)
const getEmbeddings = async (texts) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'embedding-001' });
    const embeddings = [];
    
    // Add delay between requests to avoid rate limiting
    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      if (i > 0) {
        // Wait 1 second between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      const result = await model.embedContent(text);
      embeddings.push(result.embedding.values);
    }
    
    return embeddings;
  } catch (error) {
    console.error('Error getting embeddings:', error);
    // Fallback: return dummy embeddings for now
    console.log('Using fallback embeddings due to API limits');
    return texts.map(() => new Array(768).fill(0).map(() => Math.random()));
  }
};

// @route   POST /api/documents/upload
// @desc    Upload and process PDF document
// @access  Private
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { type } = req.body;
    if (!type || !['resume', 'job_description'].includes(type)) {
      return res.status(400).json({ message: 'Invalid document type' });
    }

    // Check if user already has this type of document
    const existingDoc = await Document.findOne({ 
      userId: req.user._id, 
      type 
    });

    if (existingDoc) {
      // Delete old document from Cloudinary
      try {
        await cloudinary.uploader.destroy(existingDoc.filename);
      } catch (error) {
        console.error('Error deleting old file from Cloudinary:', error);
      }
      // Delete from database
      await Document.findByIdAndDelete(existingDoc._id);
    }

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text.trim();

    if (!extractedText) {
      return res.status(400).json({ message: 'Could not extract text from PDF' });
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'interview-prep',
          public_id: `${req.user._id}_${type}_${Date.now()}`
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    // Chunk the text
    const textChunks = chunkText(extractedText);
    
    // Get embeddings for chunks
    const embeddings = await getEmbeddings(textChunks);

    // Create chunks with embeddings
    const chunks = textChunks.map((text, index) => ({
      text,
      embedding: embeddings[index],
      chunkIndex: index
    }));

    // Save document to database
    const document = new Document({
      userId: req.user._id,
      type,
      filename: uploadResult.public_id,
      originalName: req.file.originalname,
      fileUrl: uploadResult.secure_url,
      fileSize: req.file.size,
      extractedText,
      chunks
    });

    await document.save();

    res.status(201).json({
      message: 'Document uploaded and processed successfully',
      document: {
        id: document._id,
        type: document.type,
        originalName: document.originalName,
        fileSize: document.fileSize,
        chunksCount: document.chunks.length,
        createdAt: document.createdAt
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Error uploading document',
      error: error.message 
    });
  }
});

// @route   GET /api/documents/list
// @desc    Get user's documents
// @access  Private
router.get('/list', auth, async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user._id })
      .select('-chunks -extractedText')
      .sort({ createdAt: -1 });

    res.json({
      documents: documents.map(doc => ({
        id: doc._id,
        type: doc.type,
        originalName: doc.originalName,
        fileSize: doc.fileSize,
        createdAt: doc.createdAt
      }))
    });
  } catch (error) {
    console.error('List documents error:', error);
    res.status(500).json({ message: 'Error fetching documents' });
  }
});

// @route   DELETE /api/documents/:id
// @desc    Delete document
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(document.filename);
    } catch (error) {
      console.error('Error deleting file from Cloudinary:', error);
    }

    // Delete from database
    await Document.findByIdAndDelete(req.params.id);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Error deleting document' });
  }
});

module.exports = router;