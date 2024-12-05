const request = require('supertest');
const app = require('../server'); // Assuming server.js exports the express app

describe('Todo API', () => {
  it('should fetch todos', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.status).toBe(200);
  });

  it('should add a todo', async () => {
    const newTodo = { task: 'Learn Node.js' };
    const res = await request(app).post('/api/todos').send(newTodo);
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Todo added successfully!');
  });

  it('should delete a todo', async () => {
    const newTodo = { task: 'Delete this todo' };
    const addRes = await request(app).post('/api/todos').send(newTodo);
    const todoId = addRes.body.id; // Assuming you get the ID back

    const deleteRes = await request(app).delete(`/api/todos/${todoId}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toBe('Todo deleted successfully!');
  });
});
