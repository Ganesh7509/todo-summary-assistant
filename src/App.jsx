import { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [list, setList] = useState([]);
  const [edit, setEdit] = useState({ id: null, isEdit: false });
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');

  const API_URL = 'http://localhost:5001';

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: 'GET',
        mode: 'cors',
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error fetching:", errorData);
        throw new Error(errorData.error || "Unknown error");
      }

      const data = await res.json();
      setList(data);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
      alert('Failed to fetch todos');
    }
    setLoading(false);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (message.trim() === '') {
      alert('Empty Fields are not allowed');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ text: message }),
      });
      const newTodo = await res.json();
      setList([...list, newTodo]);
      setMessage('');
    } catch (err) {
      alert('Failed to add todo');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
      setList(list.filter((item) => item.id !== id));
    } catch (err) {
      alert('Failed to delete todo');
    }
  };

  const startEdit = (id, text) => {
    setEdit({ id, isEdit: true });
    setMessage(text);
  };

  const updateTodo = async (e) => {
    e.preventDefault();

    if (message.trim() === '') {
      alert('Empty Fields are not allowed');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/todos/${edit.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ text: message }),
      });

      const updatedTodo = await res.json();
      console.log("Updated Todo:", updatedTodo); // debug check

      setList(
        list.map((todo) =>
          String(todo.id) === String(edit.id) ? { ...todo, text: updatedTodo.text } : todo
        )
      );

      setMessage('');
      setEdit({ id: null, isEdit: false });
    } catch (err) {
      console.error("Failed to update todo:", err);
      alert('Failed to update todo');
    }
  };

  const getSummary = () => {
    if (list.length === 0) {
      alert("No todos to summarize");
      return;
    }

    setLoading(true);

    const keywords = list
      .map((item) => item.text.toLowerCase())
      .join(" ")
      .match(/\b\w+\b/g);

    const wordCounts = {};

    keywords?.forEach((word) => {
      if (word.length > 3) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });

    const topKeywords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word);

    const dummySummary = `You have ${list.length} todos. ${
      list.length > 5
        ? "Focus on the most frequent tasks!"
        : "You're doing well managing your tasks."
    } Top priorities seem to be: ${topKeywords.join(", ") || "None"}.`;

    setTimeout(() => {
      setSummary(dummySummary);
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{padding: 30,
    maxWidth: 500,
    margin: '40px auto',
    fontFamily: 'Arial, sans-serif',
    border: '1px solid #ddd',
    borderRadius: 12,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff'
 }}>
      <h1 style={{ textAlign: 'center', color: '#4CAF50' }}>Todo Summary Assistant</h1>
      <form onSubmit={edit.isEdit ? updateTodo : addTodo}>
        <input
          type="text"
          placeholder="Enter a todo"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: '100%', padding: 12,   fontSize: 16,
          borderRadius: 6,
          border: '1px solid #ccc',
          marginBottom: 10,
          outline: 'none' }}
        />
        <button type="submit"   style={{
          width: '100%',
          padding: 12,
          backgroundColor: edit.isEdit ? '#2196F3' : '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          {edit.isEdit ? 'Update Todo' : 'Add Todo'}
        </button>
      </form>

      {loading ? (
        <p style={{ textAlign: 'center', marginTop: 20 }}>Loading todos...</p>
      ) : (
        <ul style={{ marginTop: 30,paddingLeft: 0, listStyle: 'none' }}>
          {list.map(({ id, text }) => (
            <li key={id} style={{             backgroundColor: '#f9f9f9',
            padding: '10px 15px',
            marginBottom: 10,
            borderRadius: 6,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid #eee'
 }}>
              {text}{' '}
              <button onClick={() => startEdit(id, text)}  style={{
                  marginRight: 8,
                  backgroundColor: '#FF9800',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}>Edit</button>{' '}
              <button onClick={() => deleteTodo(id)}  style={{
                  backgroundColor: '#F44336',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: 20 }}>
        <button onClick={getSummary} style={{
          width: '100%',
          padding: 12,
          backgroundColor: '#673AB7',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
>Get Summary</button>
        {summary && (
          <div style={{ marginTop: 10, padding: 10, backgroundColor: '#f0f0f0',borderRadius: 6,
          fontSize: 15,
          color: '#333' }}>
            <strong>Summary:</strong> {summary}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

