const express = require("express")
const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

// All routes are protected
router.use(authMiddleware)

router.route("/").get(getTasks).post(createTask)

router.route("/:id").put(updateTask).delete(deleteTask)

module.exports = router
