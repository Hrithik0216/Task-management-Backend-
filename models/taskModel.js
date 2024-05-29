const db = require("../db")

const createTask = async (title, description, due_date, priority) => {
    return db.query(
        "insert into tasks (title, description, due_date, priority) values ($1, $2, $3, $4)",
        [title, description, due_date, priority]
    )
}

const getAlltasks = async () => {
    return db.query("select * from tasks")
}

const getTaskById = async (id) => {
    return db.query(
        "select * from tasks where id = $1", [id])
}

const updateTask = async (fieldValues, fields) => {
    const query = `update tasks set ${fields.join(",")} where id = $${fieldValues.length}`
    const result = await db.query(query, fieldValues)
    return result.rowCount
}

const deleteTask = async (id) => {
    const result = await db.query('delete from tasks where id = $1', [id])
    return result.rowCount
}

const markTasksCompleted = async (requiredIds) => {
    const query = "update tasks set completed = true where id in (" + requiredIds.map((val, index) => "$" + (index + 1)).join(",") + ")"
    return db.query(query, requiredIds)
}

const getTasksByPriority = async () => {
    return db.query("select * from tasks order by priority asc")
}

const getTasksByCompletion = async () => {
    return db.query("select * from tasks where completed = true order by completed asc")
}

const getTasksByDueDate = async () => {
    return db.query("select * from tasks order by due_date asc")
}

module.exports = { createTask, getAlltasks, getTaskById, updateTask, deleteTask, markTasksCompleted, getTasksByPriority, getTasksByCompletion, getTasksByDueDate }