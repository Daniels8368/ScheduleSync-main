import React, { useState } from 'react';
import axios from 'axios';
const API_URL = "http://localhost:5000";

export default function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [grades, setGrades] = useState({});

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { user: input };
    setMessages([...messages, userMessage]);

    try {
      const res = await axios.post(`${API_URL}/chat`, { message: input });
      const botMessage = { bot: res.data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { bot: "Error: Unable to connect to the backend." }]);
    }

    setInput("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_URL}/upload-calendar`, formData);
      setMessages(prev => [...prev, { bot: "🗓️ Calendar analyzed: " + JSON.stringify(res.data.events) }]);
    } catch {
      setMessages(prev => [...prev, { bot: "Error analyzing calendar." }]);
    }
  };

  const handleGradeSubmit = async () => {
    try {
      const res = await axios.post(`${API_URL}/submit-grades`, { grades });
      setMessages(prev => [...prev, { bot: "📊 " + res.data.recommendations.join("\n") }]);
    } catch {
      setMessages(prev => [...prev, { bot: "Error submitting grades." }]);
    }
  };

  const updateGrade = (course, grade) => {
    setGrades(prev => ({ ...prev, [course]: grade }));
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '320px',
      height: '500px',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '10px',
      padding: '10px',
      boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((msg, idx) => (
          <p key={idx} style={{ margin: '5px 0' }}>
            <strong>{msg.user ? "You" : "Bot"}:</strong> {msg.user || msg.bot}
          </p>
        ))}
      </div>
      <input
        style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && sendMessage()}
        placeholder="Type your message..."
      />
      <div style={{ marginTop: '10px' }}>
        <label>📤 Upload .ics:</label>
        <input type="file" accept=".ics" onChange={handleFileUpload} />
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>📚 Submit Grades:</label>
        <input placeholder="Course" onBlur={(e) => updateGrade(e.target.value, grades[e.target.value] || '')} />
        <input placeholder="Grade" onBlur={(e) => updateGrade(Object.keys(grades)[0], e.target.value)} />
        <button onClick={handleGradeSubmit}>Submit</button>
      </div>
    </div>
  );
}