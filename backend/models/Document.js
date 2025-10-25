const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number],
    required: true
  },
  chunkIndex: {
    type: Number,
    required: true
  }
});

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['resume', 'job_description'],
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  chunks: [chunkSchema],
  extractedText: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
documentSchema.index({ userId: 1, type: 1 });
documentSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Document', documentSchema);