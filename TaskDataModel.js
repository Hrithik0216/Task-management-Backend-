const db = require("./db")

class Task {
    constructor(title, description, dueDate, priority, completed = false, id = null) {
        this.id = id
        this.title = title
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
        this.completed = completed
    }

    static async create(title, description, dueDate, priority) {
        const result = await db.query(
            "INSERT INTO tasks (title, description, due_date, priority) VALUES ($1, $2, $3, $4) RETURNING id",
            [title, description, dueDate, priority]
        )
        const id = result.rows[0].id
        return new Task(title, description, dueDate, priority, false, id)
    }

    async update(updates) {
        const fields = []
        const values = []

        for (const [key, value] of Object.entries(updates)) {
            fields.push(`${key} = $${fields.length + 1}`)
            values.push(value)
        }

        if (fields.length === 0) {
            return
        }

        values.push(this.id)

        const query = `UPDATE tasks SET ${fields.join(", ")} WHERE id = $${values.length}`
        await db.query(query, values)
    }

    async delete() {
        await db.query("DELETE FROM tasks WHERE id = $1", [this.id])
    }

    static async findAll() {
        const { rows } = await db.query("SELECT * FROM tasks")
        return rows.map(row => new Task(row.title, row.description, row.due_date, row.priority, row.completed, row.id))
    }

    static async findById(id) {
        const { rows } = await db.query("SELECT * FROM tasks WHERE id = $1", [id])
        if (rows.length === 0) {
            return null
        }
        const row = rows[0]
        return new Task(row.title, row.description, row.due_date, row.priority, row.completed, row.id)
    }

    static async findByPriority() {
        const { rows } = await db.query("SELECT * FROM tasks ORDER BY priority ASC")
        return rows.map(row => new Task(row.title, row.description, row.due_date, row.priority, row.completed, row.id))
    }

    static async findByCompletion() {
        const { rows } = await db.query("SELECT * FROM tasks WHERE completed = true ORDER BY completed ASC")
        return rows.map(row => new Task(row.title, row.description, row.due_date, row.priority, row.completed, row.id))
    }

    static async findByDueDate() {
        const query = "SELECT * FROM tasks ORDER BY due_date ASC"
        console.log("Query:", query) // Log the query
        const { rows } = await db.query(query)
        return rows.map(row => new Task(row.title, row.description, row.due_date, row.priority, row.completed, row.id))
    }
}

module.exports = Task