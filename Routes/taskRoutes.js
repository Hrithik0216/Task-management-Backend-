const express = require("express")
const router = express.Router()
const taskController = require("../controllers/taskController")

router.post("/new-task", taskController.createTask) //validated if not found
router.get("/all-tasks", taskController.getAlltasks) //validated if not found
router.get("/get-a-task", taskController.getTaskById) //validated if not found
router.post("/update-a-task", taskController.updateTask)
router.delete("/delete-a-task", taskController.deleteTask)//validated if not found
router.post("/mark-tasks-completed", taskController.markTasksCompleted)
router.get("/based-on-priority", taskController.getTasksByPriority)//validated if not found
router.get("/based-on-completed", taskController.getTasksByCompletion)//validated if not found
router.get("/based-on-duedate", taskController.getTasksByDueDate)//validated if not found

module.exports = router