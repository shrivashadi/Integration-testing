const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory "database" — assignment/demo ke liye. Real project mein MongoDB/MySQL use karo.
let todos = [];
let nextId = 1;

// GET /api/todos -> sab todos list karo
app.get('/api/todos', (req, res) => {
  res.status(200).json(todos);
});

// POST /api/todos -> naya todo add karo
app.post('/api/todos', (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTodo = { id: nextId++, title: title.trim(), completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT /api/todos/:id -> todo ko complete mark karo
app.put('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todo.completed = true;
  res.status(200).json(todo);
});

// DELETE /api/todos/:id -> todo delete karo
app.delete('/api/todos/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todos.splice(index, 1);
  res.status(204).send();
});

// Helper: tests ke beech mein data reset karne ke liye
app.resetTodos = () => {
  todos = [];
  nextId = 1;
};

module.exports = app;
