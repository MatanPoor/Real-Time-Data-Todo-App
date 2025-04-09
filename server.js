const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// In-memory store to track locked tasks
let lockedTasks = {}; // This will hold task locking info in memory

// Test Route
app.post('/test', (req, res) => {
  console.log('Test Route Hit');
  res.send('Test Route Works');
});

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200', // Angular app
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

//  Handle socket connections also act as singelton
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send socket ID to the client on connect
  socket.emit('socketId', socket.id);

  //  Attempt to lock task
  socket.on('lockTask', ({ taskId, socketId }) => {
    console.log(`Attempting to lock Task ${taskId} by ${socketId}`);

    const taskLock = lockedTasks[taskId];

    if (taskLock && taskLock.locked) {
      console.log(`Task ${taskId} is already locked by ${taskLock.lockedBy}`);

      //  Inform the client who failed to lock it
      socket.emit('taskLockError', {
        taskId,
        lockedBy: taskLock.lockedBy,
        message: 'Task is already locked by another user.'
      });
    } else {
      //  Lock the task
      lockedTasks[taskId] = { locked: true, lockedBy: socketId };
      console.log(`Task ${taskId} locked by ${socketId}`);

      //  Inform all clients about the new lock
      io.emit('taskLocked', { taskId, lockedBy: socketId });
    }
  });

  //  Attempt to unlock task
  socket.on('unlockTask', ({ taskId, socketId }) => {
    console.log(`Attempting to unlock Task ${taskId} by ${socketId}`);

    const taskLock = lockedTasks[taskId];

    if (taskLock && taskLock.lockedBy === socketId) {
      //  Unlock only if the same client locked it
      lockedTasks[taskId].locked = false;
      lockedTasks[taskId].lockedBy = null;
      console.log(`Task ${taskId} unlocked by ${socketId}`);

      io.emit('taskUnlocked', { taskId, unlockedBy: socketId });
    } else {
      console.log(`Task ${taskId} could not be unlocked by ${socketId}`);


      socket.emit('taskUnlockError', {
        taskId,
        message: 'Task is not locked by you.'
      });
    }
  });

  //  Update task (after edit)
  socket.on('updateTask', ({ taskId, updatedTask }) => {
    console.log(`Updating Task ${taskId}`);

    // TODO: Update the task in your DB here if needed

    // Unlock the task after update
    lockedTasks[taskId] = { locked: false, lockedBy: null };

    // Emit unlock and update events
    io.emit('taskUnlocked', { taskId, unlockedBy: null });
    io.emit('taskUpdated', updatedTask);
  });
});

// Make io accessible to routes
app.set('io', io);

// Routes
const taskRoutes = require('./routes/taskRoutes');
app.use(taskRoutes);

// MongoDB connection also act as singelton
mongoose.connect('mongodb://localhost:27017/todoApp')
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch(err => console.error(err));
