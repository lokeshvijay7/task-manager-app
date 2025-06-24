const Task = require("../models/Task")

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 })

    // Group tasks by status
    const groupedTasks = {
      "To Do": tasks.filter((task) => task.status === "To Do"),
      "In Progress": tasks.filter((task) => task.status === "In Progress"),
      Done: tasks.filter((task) => task.status === "Done"),
    }

    res.json(groupedTasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body

    const task = await Task.create({
      title,
      description,
      priority,
      userId: req.user._id,
    })

    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // Check if user owns the task
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.json(updatedTask)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // Check if user owns the task
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    await Task.findByIdAndDelete(req.params.id)

    res.json({ message: "Task removed" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
}
