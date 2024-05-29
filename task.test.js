const request = require('supertest');
const app = require('./server2');
const Task = require('./TaskDataModel');


// Test to post a task
describe('Task Routes', () => {
  describe('POST /insert-a-task', () => {
    it('should return 201 and create a new task', async () => {
      const taskData = {
        title: 'Task 1',
        description: 'Description 1',
        dueDate: '2024-06-15',
        priority: 3,
      };

      const response = await request(app)
        .post('/insert-a-task')
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', 'Task 1');
      expect(response.body).toHaveProperty('description', 'Description 1');
      expect(response.body).toHaveProperty('dueDate', '2024-06-15');
      expect(response.body).toHaveProperty('priority', 3);
      expect(response.body).toHaveProperty('completed', false);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 400 if due date is not in the future', async () => {
      const taskData = {
        title: 'Task 1',
        description: 'Description 1',
        dueDate: '2022-06-15',
        priority: 3,
      };

      const response = await request(app)
        .post('/insert-a-task')
        .send(taskData);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Error creating task');
    });

    it('should return 400 if priority is not between 1 and 5', async () => {
      const taskData = {
        title: 'Task 1',
        description: 'Description 1',
        dueDate: '2024-06-15',
        priority: 6,
      };

      const response = await request(app)
        .post('/insert-a-task')
        .send(taskData);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Error creating task');
    });

    it('should return 400 if title is empty', async () => {
      const taskData = {
        title: '',
        description: 'Description 1',
        dueDate: '2024-06-15',
        priority: 3,
      };

      const response = await request(app)
        .post('/insert-a-task')
        .send(taskData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Missing required fields');
    });
  });
});


//test to update a task
describe('Task Routes', () => {
  describe('PUT /update-a-task', () => {
    it('should return 200 and the updated task when the task is found', async () => {
      const mockTask = new Task('Task 1', 'Description 1', '2024-06-15', 3, false, 1);
      jest.spyOn(Task, 'findById').mockResolvedValue(mockTask);

      const updatedTask = {
        id: 1,
        title: 'Updated Task',
        description: 'Updated Description',
        dueDate: '2024-07-01',
        priority: 2,
        completed: true,
      };

      jest.spyOn(mockTask, 'update').mockResolvedValue(updatedTask);

      const response = await request(app)
        .put('/update-a-task')
        .send(updatedTask);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedTask);

      Task.findById.mockRestore();
      mockTask.update.mockRestore();
    });

    it('should return 404 when the task is not found', async () => {
      jest.spyOn(Task, 'findById').mockResolvedValue(null);

      const updatedTask = {
        id: 2,
        title: 'Updated Task',
        description: 'Updated Description',
        dueDate: '2024-07-01',
        priority: 2,
        completed: true,
      };

      const response = await request(app)
        .put('/update-a-task')
        .send(updatedTask);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Task with ID 2 not found');

      Task.findById.mockRestore();
    });

    it('should return 500 if an error occurs', async () => {
      jest.spyOn(Task, 'findById').mockRejectedValue(new Error('Database error'));

      const updatedTask = {
        id: 3,
        title: 'Updated Task',
        description: 'Updated Description',
        dueDate: '2024-07-01',
        priority: 2,
        completed: true,
      };

      const response = await request(app)
        .put('/update-a-task')
        .send(updatedTask);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Error updating task');
      expect(response.body).toHaveProperty('error', 'Database error');

      Task.findById.mockRestore();
    });
  });
});

//test to delete a task
describe('Task Routes', () => {
  describe('DELETE /tasks/:id', () => {
    it('should return 200 and delete the task when the task is found', async () => {
      const mockTask = new Task('Task 1', 'Description 1', '2024-06-15', 3, false, 1);
      jest.spyOn(Task, 'findById').mockResolvedValue(mockTask);
      jest.spyOn(mockTask, 'delete').mockResolvedValue();

      const response = await request(app).delete('/tasks/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Deleted Successfully' });

      Task.findById.mockRestore();
      mockTask.delete.mockRestore();
    });

    it('should return 404 when the task is not found', async () => {
      jest.spyOn(Task, 'findById').mockResolvedValue(null);

      const response = await request(app).delete('/tasks/2');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Task with ID 2 not found');

      Task.findById.mockRestore();
    });

    it('should return 500 if an error occurs', async () => {
      jest.spyOn(Task, 'findById').mockResolvedValue(new Task('Task 1', 'Description 1', '2024-06-15', 3, false, 1));
      jest.spyOn(Task.prototype, 'delete').mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/tasks/3');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Error deleting task');
      expect(response.body).toHaveProperty('error', 'Database error');

      Task.findById.mockRestore();
      Task.prototype.delete.mockRestore();
    });
  });
});

//Test to get all tasks
describe('Task Routes', () => {
  describe('GET /tasks', () => {
    it('should return 200 and list of tasks when tasks are found', async () => {
      const mockTasks = [
        new Task('Task 1', 'Description 1', '2024-06-15', 3, false, 1),
        new Task('Task 2', 'Description 2', '2024-07-01', 2, true, 2),
      ];

      jest.spyOn(Task, 'findAll').mockResolvedValue(mockTasks);

      const response = await request(app).get('/tasks');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: 'Task 1',
            description: 'Description 1',
            dueDate: '2024-06-15',
            priority: 3,
            completed: false,
            id: 1,
          }),
          expect.objectContaining({
            title: 'Task 2',
            description: 'Description 2',
            dueDate: '2024-07-01',
            priority: 2,
            completed: true,
            id: 2,
          }),
        ])
      );

      Task.findAll.mockRestore();
    });

    it('should return 404 when no tasks are found', async () => {
      jest.spyOn(Task, 'findAll').mockResolvedValue([]);

      const response = await request(app).get('/tasks');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Tasks not found');

      Task.findAll.mockRestore();
    });

    it('should return 500 if an error occurs', async () => {
      jest.spyOn(Task, 'findAll').mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/tasks');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Error fetching tasks');
      expect(response.body).toHaveProperty('error', 'Database error');

      Task.findAll.mockRestore();
    });
  });
});


//test to get task by id
describe('Task Routes', () => {
  describe('GET /tasks/:id', () => {
    it('should return 200 and the task when the task is found', async () => {
      const mockTask = new Task('Task 1', 'Description 1', '2024-06-15', 3, false, 1);
      jest.spyOn(Task, 'findById').mockResolvedValue(mockTask);

      const response = await request(app).get('/tasks/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        title: 'Task 1',
        description: 'Description 1',
        dueDate: '2024-06-15',
        priority: 3,
        completed: false,
        id: 1,
      });

      Task.findById.mockRestore();
    });

    it('should return 404 when the task is not found', async () => {
      jest.spyOn(Task, 'findById').mockResolvedValue(null);

      const response = await request(app).get('/tasks/2');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Task with ID 2 not found');

      Task.findById.mockRestore();
    });

    it('should return 500 if an error occurs', async () => {
      jest.spyOn(Task, 'findById').mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/tasks/3');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Error fetching task');
      expect(response.body).toHaveProperty('error', 'Database error');

      Task.findById.mockRestore();
    });
  });
});

//Test code for finding by priority
describe('Task Routes', () => {
  describe('GET /priority', () => {
    it('should return 200 and list of tasks sorted by priority when tasks are found', async () => {
      const mockTasks = [
        new Task('Task 1', 'Description 1', '2024-06-15', 1, false, 1),
        new Task('Task 2', 'Description 2', '2024-07-01', 3, true, 2),
        new Task('Task 3', 'Description 3', '2024-08-01', 2, false, 3),
      ];

      jest.spyOn(Task, 'findByPriority').mockResolvedValue(mockTasks);

      const response = await request(app).get('/priority');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: 'Task 1',
            description: 'Description 1',
            dueDate: '2024-06-15',
            priority: 1,
            completed: false,
            id: 1,
          }),
          expect.objectContaining({
            title: 'Task 3',
            description: 'Description 3',
            dueDate: '2024-08-01',
            priority: 2,
            completed: false,
            id: 3,
          }),
          expect.objectContaining({
            title: 'Task 2',
            description: 'Description 2',
            dueDate: '2024-07-01',
            priority: 3,
            completed: true,
            id: 2,
          }),
        ])
      );

      Task.findByPriority.mockRestore();
    });

    it('should return 404 when no tasks are found', async () => {
      jest.spyOn(Task, 'findByPriority').mockResolvedValue([]);

      const response = await request(app).get('/priority');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Tasks not found');

      Task.findByPriority.mockRestore();
    });

    it('should return 500 if an error occurs', async () => {
      jest.spyOn(Task, 'findByPriority').mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/priority');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Error fetching tasks by priority');
      expect(response.body).toHaveProperty('error', 'Database error');

      Task.findByPriority.mockRestore();
    });
  });
});


//test code for finding by completion
describe('Task Routes', () => {
  describe('GET /completed', () => {
    let mockRows;
    let mockQuery;

    beforeEach(() => {
      // Mock the db.query method
      mockRows = [
        { title: 'Task 1', description: 'Description 1', due_date: '2023-06-01', priority: 'high', completed: true, id: 1 },
        { title: 'Task 2', description: 'Description 2', due_date: '2023-06-02', priority: 'low', completed: true, id: 2 },
      ];
      mockQuery = jest.fn().mockResolvedValue({ rows: mockRows });
      const db = require('./db');
      db.query = mockQuery;
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should return completed tasks', async () => {
      const response = await request(app).get('/completed');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { title: 'Task 1', description: 'Description 1', dueDate: '2023-06-01', priority: 'high', completed: true, id: 1 },
        { title: 'Task 2', description: 'Description 2', dueDate: '2023-06-02', priority: 'low', completed: true, id: 2 },
      ]);
    });


    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Something went wrong';
      mockQuery.mockRejectedValue(new Error(errorMessage));

      const response = await request(app).get('/completed');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error fetching completed tasks', error: errorMessage });
    });
  })
})


// test for completion tasks
describe('Task Routes', () => {
  describe('GET /dueDate', () => {
    let mockRows;
    let mockQuery;

    beforeEach(() => {
      // Mock the db.query method
      mockRows = [
        { title: 'Task 1', description: 'Description 1', due_date: '2023-06-01', priority: 'high', completed: false, id: 1 },
        { title: 'Task 2', description: 'Description 2', due_date: '2023-06-02', priority: 'low', completed: true, id: 2 },
        { title: 'Task 3', description: 'Description 3', due_date: '2023-06-03', priority: 'medium', completed: false, id: 3 },
      ];
      mockQuery = jest.fn().mockResolvedValue({ rows: mockRows });
      const db = require('./db'); // Assuming your database connection is exported from './db.js'
      db.query = mockQuery;
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should return tasks ordered by due date', async () => {
      const response = await request(app).get('/dueDate');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { title: 'Task 1', description: 'Description 1', dueDate: '2023-06-01', priority: 'high', completed: false, id: 1 },
        { title: 'Task 2', description: 'Description 2', dueDate: '2023-06-02', priority: 'low', completed: true, id: 2 },
        { title: 'Task 3', description: 'Description 3', dueDate: '2023-06-03', priority: 'medium', completed: false, id: 3 },
      ]);
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Something went wrong';
      mockQuery.mockRejectedValue(new Error(errorMessage));

      const response = await request(app).get('/dueDate');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error fetching tasks by due date', error: errorMessage });
    });
  });

})