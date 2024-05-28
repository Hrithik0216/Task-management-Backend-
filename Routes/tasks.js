const express = require("express")
const router = express.Router()
const db = require("../db")

// 1. Create a new task with a title, description, due date, and priority level.
router.post("/new-task", async (req, res) => {
    const { title, description, due_date, priority } = req.body

    const today = new Date();
    const due = new Date(due_date);
    if (due <= today) {
        return res.status(400).send("Due date must be in future")
    }
    if (priority < 1 || priority > 5) {
        return res.status(400).send("Priority must be between 1 and 5");
    }
    if (!title || title.trim() === "") {
        return res.status(400).send("Task title cannot be empty");
    }

    try {
        const data = await db.query(
            "insert into tasks (title, description, due_date, priority) values ($1, $2, $3, $4)",
            [title, description, due_date, priority]
        )
        res.status(200).send("Inserted a new task")
    } catch (e) {
        console.log(e)
        res.status(500).send("Internal server Error")
    }
})

// 2. Retrieve a list of all tasks.
router.get("/all-tasks", async (req, res) => {
    try {
        // const rows = await db.query("SELECT * FROM tasks")
        // const { rowCount } = await db.query("SELECT * FROM tasks")
        // res.status(200).json({ message: rowCount })
        const { rows } = await db.query("select * from tasks")
        res.status(200).json(rows)

    } catch (e) {
        console.error(e)
        res.status(500).send("Internal server error")
    }
})
// 3. Retrieve details of a specific task by its ID.
router.get("/get-a-task", async (req, res) => {
    const { id } = req.body
    try {
        const { rows } = await db.query(
            "select * from tasks where id = $1",
            [id])
        res.status(200).send(rows)
    } catch (e) {
        console.log(e)
        res.status(500).send("Internal server error")
    }
})

// 4. Update information about an existing task.
router.post("/update-a-task", async (req, res) => {
    const { id, title, description, due_date, priority, completed } = req.body

    let fields = []
    let fieldValues = []
    if (title !== undefined) {
        if (!title || title.trim() === "") {
            return res.status(400).send("Task title cannot be empty");
        }
        fields.push(`title = $${fields.length + 1}`)
        fieldValues.push(title)
    }

    if (description !== undefined) {
        fields.push(`description = $${fields.length + 1}`)
        fieldValues.push(description)
    }

    if (due_date !== undefined) {
        const today = new Date();
        const due = new Date(due_date);
        if (due <= today) {
            return res.status(400).send("Due date must be in future")
        } else {
            fields.push(`due_date = $${fields.length + 1}`)
            fieldValues.push(due_date)
        }
    }

    if (priority !== undefined) {
        if (priority < 1 || priority > 5) {
            return res.status(400).send("Priority must be between 1 and 5");
        }
        fields.push(`priority = $${fields.length + 1}`)
        fieldValues.push(priority)
    }
    if (completed !== undefined) {
        fields.push(`completed = $${fields.length + 1}`)
        fieldValues.push(completed)
    }
    if (fields.length === 0) {
        return res.status(200).send("No fields to update")
    }

    fieldValues.push(id)
    const query = `update tasks set ${fields.join(",")} where id = $${fieldValues.length}`

    try {
        const { rows } = await db.query(query, fieldValues)
        res.status(200).send(`Updated ${id} task Succesfully`)
    } catch (e) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
})

// 5. Delete a task.
router.delete("/delete-a-task", async (req, res) => {
    const { id } = req.body
    try {
        const data = await db.query('delete from tasks where id = $1', [id])
        res.status(200).send(`Deleted the task ${id}`)
    } catch (e) {
        console.log(e)
        res.status(200).send("Internal Server Error")
    }
})

// 6. Mark tasks as completed.
router.post("/mark-tasks-completed", async (req, res) => {
    const { requiredIds } = req.body
    if (!Array.isArray(requiredIds) || requiredIds.length === 0) {
        return res.status(400).send("Provide a valid request")
    }
    try {
        const query = "update tasks set completed = true where id in (" + requiredIds.map((val, index) => "$" + (index + 1)).join(",") + ")"
        const data = await db.query(query, requiredIds)
        res.status(200).send("Marked the given tasks as completed")
    } catch (e) {
        console.log(e)
        res.status(500).send("Internal server error")
    }
})

// 7.Filter tasks based on priority level or completion status.
router.get("/based-on-priority", async (req, res) => {
    try {
        const { rows } = await db.query("select * from tasks order by priority desc")
        res.status(200).send(rows)
    } catch (e) {
        console.log(e)
        res.status(500).send("Internal Server Error")
    }
})
router.get("/based-on-completed", async (req, res) => {

    try {
        const { rows } = await db.query("select * from tasks where completed = true order by completed asc")
        res.status(200).send(rows)
    } catch (e) {
        console.log(e)
        res.status(500).send("Internal Server Error")
    }
})

// 8.Sort tasks by due date or priority level.
router.get("/based-on-duedate", async (req, res) => {
    try {
        const { rows } = await db.query("select * from tasks order by due_date asc")
        res.status(200).send(rows)
    } catch (e) {
        console.log(e)
        res.status(500).send("Internal Server Error")
    }
})


module.exports = router
