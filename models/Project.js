const mongoose = require('mongoose');

const { Schema } = mongoose;

const projectSchema = new Schema(
  {
    headline: String,
    fullName: String,
    summary: String,
    techStack: {
      type: Array,
      default: []
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true
  }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
