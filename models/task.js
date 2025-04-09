const mongoose = require('mongoose');

// Define the task schema
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, 
    },
    description: {
      type: String,
      required: true,  
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low',  
    },
    dueDate: {
      type: Date,
      default: null, 
    },
    completed: {
      type: Boolean,
      default: false,  
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
