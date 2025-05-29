const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  sector: {
    type: String,
    required: true,
    enum: [
      'Énergie renouvelable – Énergie solaire',
      'Énergie renouvelable – Énergie éolienne',
      'Agriculture',
      'Tourisme',
      'Technologie',
      'Santé',
      'Éducation',
      'Artisanat',
      'Industrie',
      'Patrimoine'
    ]
  },
  location: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true,
    enum: ['Ouarzazate', 'Errachidia', 'Midelt', 'Tinghir', 'Zagora']
  },
  budget: {
    type: Number,
    required: true // Budget in millions Dhs
  },
  revenue: {
    type: Number,
    default: 0 // Expected revenue in millions Dhs
  },
  jobs: {
    type: Number,
    default: 0 // Number of jobs created
  },
  profitability: {
    type: Number,
    default: 0 // Profitability ratio
  },
  goal: {
    type: String,
    default: ''
  },
  technology: {
    type: String,
    default: ''
  },
  impact: {
    type: String,
    default: ''
  },
  incentives: {
    type: String,
    default: ''
  },
  partners: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: '' // Store image path/URL
  },
  publishTime: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  views: {
    type: Number,
    default: 0
  },
  porteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: [
      'traditional-crafts',
      'renewable-energy',
      'education',
      'health',
      'tourism',
      'heritage',
      'agriculture',
      'technology',
      'industry'
    ]
  }
}, {
  timestamps: true
});

// Index for search functionality
projectSchema.index({
  title: 'text',
  description: 'text',
  sector: 'text',
  location: 'text'
});

// Virtual for formatted budget
projectSchema.virtual('formattedBudget').get(function() {
  return `${this.budget} M Dhs`;
});

// Method to increment views
projectSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

module.exports = mongoose.model('Project', projectSchema);