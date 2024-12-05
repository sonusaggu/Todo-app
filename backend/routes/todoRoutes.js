import express from 'express';
import { getTodos, addTodo, deleteTodo } from '../controllers/todoController.js';

const router = express.Router();

router.get('/', getTodos);
router.post('/', addTodo);
router.delete('/:id', deleteTodo);

export default router;  // Correct way to export
