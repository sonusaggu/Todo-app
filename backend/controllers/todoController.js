import { ScanCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '../server.js';  // Add the .js extension here


// Get all todos
export const getTodos = async (req, res) => {
  const params = {
    TableName: process.env.TODOS_TABLE_NAME || 'Todos',
  };

  try {
    const data = await docClient.send(new ScanCommand(params));
    res.status(200).json(data.Items);
  } catch (err) {
    console.error('Unable to fetch todos:', err);
    res.status(500).json({ error: 'Failed to fetch todos.' });
  }
};

// Add a new todo
export const addTodo = async (req, res) => {
  const { task } = req.body;
  const params = {
    TableName: process.env.TODOS_TABLE_NAME || 'Todos',
    Item: {
      id: Date.now().toString(),
      task,
      completed: false,
    },
  };

  try {
    await docClient.send(new PutCommand(params));
    res.status(201).json({ message: 'Todo added successfully!' });
  } catch (err) {
    console.error('Unable to add todo:', err);
    res.status(500).json({ error: 'Failed to add todo.' });
  }
};

// Delete a todo by ID
export const deleteTodo = async (req, res) => {
  const { id } = req.params;
  const params = {
    TableName: process.env.TODOS_TABLE_NAME || 'Todos',
    Key: {
      id,
    },
  };

  try {
    await docClient.send(new DeleteCommand(params));
    res.status(200).json({ message: 'Todo deleted successfully!' });
  } catch (err) {
    console.error('Unable to delete todo:', err);
    res.status(500).json({ error: 'Failed to delete todo.' });
  }
};
