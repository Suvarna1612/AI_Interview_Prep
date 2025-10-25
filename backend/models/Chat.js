const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    min: 1,
    max: 10
  },
  feedback: {
    type: String
  },
  citations: [{
    chunkIndex: Number,
    documentType: String,
    snippet: String
  }]
}, {
  timestamps: true
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  messages: [messageSchema],
  resumeDocumentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  },
  jobDescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
chatSchema.index({ userId: 1, createdAt: -1 });
chatSchema.index({ sessionId: 1 });

module.exports = mongoose.model('Chat', chatSchema);