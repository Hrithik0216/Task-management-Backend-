const Task = require('./TaskDataModel');

(async () => {
    // Create a new task
    //   const newTask = await Task.create("Buy groceries", "Milk, eggs, bread", new Date("2023-06-01"), 3);
    //   console.log(`Created new task with ID: ${newTask.id}`);

    // Find all tasks
    // const tasks = await Task.findAll();
    // console.log("All tasks:", tasks);

    // Find a task by ID
    const task = await Task.findById(1);
    if (task) {
        console.log("Found task:", task);
    } else {
        console.log("Task with ID 1 not found");
    }

    // Update a task
    const taskId = 40
    const updatedTask = await Task.findById(40);
    if (updatedTask) {
        await updatedTask.update({ priority: 2, completed: true });
        console.log("Task updated successfully");
    } else {
        console.log(`Task with ID ${taskId} not found`);
    }

    // Delete a task
    const taskToDelete = await Task.findById(3);
    if (taskToDelete) {
        await taskToDelete.delete();
        console.log("Task deleted successfully");
    } else {
        console.log("Task with ID 3 not found");
    }

    // Find tasks by priority
    // const tasksByPriority = await Task.findByPriority();
    // console.log("Tasks by priority:", tasksByPriority);

    // Find completed tasks
    // const completedTasks = await Task.findByCompletion();
    // console.log("Completed tasks:", completedTasks);

    // Find tasks by due date
    // const tasksByDueDate = await Task.findByDueDate();
    // console.log("Tasks by due date:", tasksByDueDate);
})();


