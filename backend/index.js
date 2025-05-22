const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const supabase = require('./supabase');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// Set default response Content-Type
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running...');
});

console.log('Supabase URL:', process.env.SUPABASE_URL);
console.log('Loaded SUPABASE_KEY:', process.env.SUPABASE_KEY ? 'Yes' : 'No');

// ==========================
//        TODO ROUTES
// ==========================

// Get all todos
app.get('/todos', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('id', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Add a new todo
app.post('/todos', async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Todo text is required' });
    }

    const { data, error } = await supabase
      .from('todos')
      .insert([{ text }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

// Update a todo by ID
app.patch('/todos/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Todo text is required' });
    }

    const { data, error } = await supabase
      .from('todos')
      .update({ text })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Todo not found' });

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Delete a todo by ID
app.delete('/todos/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// ==========================
//    SUMMARIZE TODOs ROUTE
// ==========================
app.post('/summarize', async (req, res, next) => {
  try {
    const { data: todos, error } = await supabase
      .from('todos')
      .select('text')
      .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    if (!todos || todos.length === 0) {
      return res.status(400).json({ error: 'No todos found to summarize.' });
    }

    const todosText = todos.map((todo, i) => `${i + 1}. ${todo.text}`).join('\n');
    const prompt = `Please summarize the following to-do list:\n${todosText}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
    });

    const summary = completion.choices[0].message.content.trim();
    res.json({ summary });
  } catch (err) {
    console.error('Error in /summarize:', err);
    next(err);
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
