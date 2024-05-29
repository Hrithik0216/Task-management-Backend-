const taskModel = require("../models/taskModel")


const createTask = async (req, res) => {
    const { title, description, due_date, priority } = req.body

    const today = new Date()
    const due = new Date(due_date)
    if (due <= today) {
        return res.status(400).send("Due date must be in future")
    }
    if (priority < 1 || priority > 5) {
        return res.status(400).send("Priority must be between 1 and 5")
    }
    if (!title || title.trim() === "") {
        return res.status(400).send("Task title cannot be empty")
    }

    try {
        const newTaskId = await taskModel.createTask(title, description, due_date, priority)
        res.status(201).json({ id: newTaskId, message: "Inserted a new task" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


const getAlltasks = async (req, res) => {
    try {
        const { rows } = await taskModel.getAlltasks()
        if (rows.length > 0) {
            return res.status(200).send(rows)
        }
        res.status(200).send("No tasks. Add new tasks")
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getTaskById = async (req, res) => {
    const { id } = req.body
    try {
        const { rows } = await taskModel.getTaskById(id)
        if (rows.length === 0) {
            return res.status(404).send(`No task found with the id ${id}`)
        }
        res.status(200).send(rows)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const updateTask = async (req, res) => {
    const { id, title, description, due_date, priority, completed } = req.body

    let fields = []
    let fieldValues = []
    if (!id) {
        return res.status(400).send("Provide the ID")
    }
    if (title !== undefined) {
        if (!title || title.trim() === "") {
            return res.status(400).send("Task title cannot be empty")
        }
        fields.push(`title = $${fields.length + 1}`)
        fieldValues.push(title)
    }

    if (description !== undefined) {
        fields.push(`description = $${fields.length + 1}`)
        fieldValues.push(description)
    }

    if (due_date !== undefined) {
        const today = new Date()
        const due = new Date(due_date)
        if (due <= today) {
            return res.status(400).send("Due date must be in future")
        } else {
            fields.push(`due_date = $${fields.length + 1}`)
            fieldValues.push(due_date)
        }
    }

    if (priority !== undefined) {
        if (priority < 1 || priority > 5) {
            return res.status(400).send("Priority must be between 1 and 5")
        }
        fields.push(`priority = $${fields.length + 1}`)
        fieldValues.push(priority)
    }
    if (completed !== undefined) {
        fields.push(`completed = $${fields.length + 1}`)
        fieldValues.push(completed)
    }
    if (fields.length === 0) {
        return res.status(400).send("No fields to update")
    }

    fieldValues.push(id)
    // const query = `update tasks set ${fields.join(",")} where id = $${fieldValues.length}`
    try {
        const updatedRows = await taskModel.updateTask(fieldValues, fields)
        if (updatedRows === 0) {
            return res.status(404).send(`No task found with the id ${id}`)
        }
        res.status(200).send(`Updated task with id ${id} successfully`)
    } catch (error) {
        res.status(500).json({ error: error.message }) // 500 Internal Server Error
    }
}

const deleteTask = async (req, res) => {
    const { id } = req.body
    if (!id) {
        return res.status(400).send("Provide a valid task ID")
    }
    try {
        const deletedRowCount = await taskModel.deleteTask(id)
        if (deletedRowCount === 0) {
            return res.status(404).send(`No task found with id ${id}`)
        }
        res.status(200).send(`Deleted task with id ${id}`)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}




const markTasksCompleted = async (req, res) => {
    const { requiredIds } = req.body

    if (!Array.isArray(requiredIds) || requiredIds.length === 0) {
        return res.status(400).send("Provide a valid request")
    }
    try {
        await taskModel.markTasksCompleted(requiredIds)
        res.status(200).send("Marked the given tasks as completed")
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


const getTasksByPriority = async (req, res) => {
    try {
        const { rows } = await taskModel.getTasksByPriority()

        if (rows.length === 0) {
            return res.status(404).send("No tasks found")
        }

        res.status(200).json(rows)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getTasksByCompletion = async (req, res) => {
    try {
        const { rows } = await taskModel.getTasksByCompletion()

        if (rows.length === 0) {
            return res.status(404).send("No tasks found")
        }

        res.status(200).json(rows)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getTasksByDueDate = async (req, res) => {
    try {
        const { rows } = await taskModel.getTasksByDueDate()
        //In very Rare case
        if (rows.length === 0) {
            return res.status(404).send("No tasks found")
        }
        res.status(200).json(rows)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { createTask, getAlltasks, getTaskById, updateTask, deleteTask, markTasksCompleted, getTasksByPriority, getTasksByCompletion, getTasksByDueDate }