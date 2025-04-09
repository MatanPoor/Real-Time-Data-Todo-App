const express = require('express');
const Task = require('../models/task');

const router = express.Router();

// Lock a task for editing
router.post('/lock-task/:id', async (req, res) => {
  const io = req.app.get('io');
  const { socketId } = req.body;

  console.log(`LOCK request received for task ${req.params.id} by socket ${socketId}`);

  if (!socketId) {
    console.log(' Missing socketId');
    return res.status(400).json({ message: 'Missing socketId' });
  }

  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      console.log(' Task not found');
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.isLocked && task.lockedBy !== socketId) {
      console.log(` Task already locked by someone else: ${task.lockedBy}`);
      return res.status(403).json({ message: 'Task is already locked by another user' });
    }

    task.isLocked = true;
    task.lockedBy = socketId;
    await task.save();

    console.log(`✅ Task ${task._id} locked by ${socketId}`);

    io.emit('taskLocked', { taskId: task._id, lockedBy: socketId });

    res.status(200).json({ message: 'Task locked', task });
  } catch (error) {
    console.error('Server error on lock-task:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Unlock a task
router.post('/unlock-task/:id', async (req, res) => {
  const io = req.app.get('io');
  const { socketId } = req.body;

  if (!socketId) {
    return res.status(400).json({ message: 'Missing socketId' });
  }

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.lockedBy !== socketId) {
      return res.status(403).json({ message: 'You are not the one who locked this task' });
    }

    task.isLocked = false;
    task.lockedBy = null;
    await task.save();

    io.emit('taskUnlocked', { taskId: task._id , lockedBy: socket.id  });

    res.status(200).json({ message: 'Task unlocked', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


//regular post
router.post('/tasks', async (req, res) => {
  const io = req.app.get('io');
  console.log('Request Body:', req.body);  

  try {
    const { title, description, priority, dueDate, completed } = req.body;

    // Check if all required fields are present
    if (!title || !description || !priority || !dueDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const task = new Task({ title, description, priority, dueDate, completed });
    await task.save();

    io.emit('taskCreated', task); // Emit task creation event

    res.status(201).json(task); // Respond with th e created task
  } catch (error) {
    console.error('Error saving task:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/tasks/:id', async (req, res) => {
  const io = req.app.get('io');

  try {
    const { title, description, completed, priority, dueDate } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, completed, priority, dueDate },
      { new: true }
    );
    io.emit('taskUpdated', task);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/tasks/:id', async (req, res) => {
  const io = req.app.get('io');

  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (deletedTask) {
      io.emit('taskDeleted', deletedTask._id.toString());
    }
    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
