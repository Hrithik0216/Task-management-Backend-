const express = require('express')
const Task = require('./TaskDataModel')
const app = express()
const port = 3000

app.use(express.json())

// Create a new task
app.post('/insert-a-task', async (req, res) => {
    try {
        const { title, description, dueDate, priority } = req.body
        if (!title || !description || !dueDate || !priority) {
            return res.status(400).json({ message: 'Missing required fields' })
        }
        const newTask = await Task.create(title, description, dueDate, priority)
        res.status(201).json(newTask)
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error: error.message })
    }
})

// Get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.findAll()
        if (tasks.length > 0) {
            res.status(200).json(tasks)
        } else {
            res.status(404).json({ message: "Tasks not found" })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message })
    }
})

// Get a task by ID
app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (task) {
            res.status(200).json(task)
        } else {
            res.status(404).json({ message: `Task with ID ${req.params.id} not found` })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching task', error: error.message })
    }
})

// Update a task by ID
app.put('/update-a-task', async (req, res) => {
    try {
        const { id, ...updates } = req.body
        const task = await Task.findById(id)
        if (task) {
            await task.update(updates)
            res.status(200).json(task)
        } else {
            res.status(404).json({ message: `Task with ID ${id} not found` })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message })
    }
})


// Delete a task by ID
app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (task) {
            await task.delete()
            res.status(200).json({ message: "Deleted Successfully" })
        } else {
            res.status(404).json({ message: `Task with ID ${req.params.id} not found` })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message })
    }
})

// Get tasks by priority
app.get('/priority', async (req, res) => {
    try {
        const tasks = await Task.findByPriority()
        if (tasks.length > 0) {
            res.status(200).json(tasks)
        } else {
            res.status(404).json({ message: "Tasks not found" })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks by priority', error: error.message })
    }
})

// Get completed tasks
app.get('/completed', async (req, res) => {
    try {
        const tasks = await Task.findByCompletion()
        if (tasks.length > 0) {
            res.status(200).json(tasks)
        } else {
            res.status(404).json({ message: "Tasks not found" })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching completed tasks', error: error.message })
    }
})

// Get tasks by due date
app.get('/dueDate', async (req, res) => {
    try {
        const tasks = await Task.findByDueDate()
        if (tasks.length > 0) {
            res.status(200).json(tasks)
        } else {
            res.status(404).json({ message: "Tasks not found" })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks by due date', error: error.message })
    }
})

app.listen(port, () => {
    console.log(`Server running on the ${port}`)
})


module.exports = app;