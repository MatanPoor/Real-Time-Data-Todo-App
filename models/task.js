const mongoose = require('mongoose');

// Define the task schema
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Title is required
    },
    description: {
      type: String,
      required: true,  // Description is required
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low',  // Default to 'Low' if no value is provided
    },
    dueDate: {
      type: Date,
      default: null,  // Default to null if no date is provided
    },
    completed: {
      type: Boolean,
      default: false,  // Default to false if no value is provided
    },
    isLocked: {
      type: Boolean,
      default: false
    },
    lockedBy: {
      type: String, // Store socket ID or user ID
      default: null
    }
  },
  {
    timestamps: true,  // Automatically add createdAt and updatedAt fields
  }
);

// Export the task model
module.exports = mongoose.model('Task', taskSchema);
