import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://127.0.0.1:5000";

export default function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [grades, setGrades] = useState({});
  const [course, setCourse] = useState("");
  const [grade, setGrade] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // Check connection to backend on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await axios.get(`${API_URL}/chat`, { timeout: 3000 });
        setIsConnected(true);
      } catch (error) {
        console.error("Backend connection failed:", error);
        setIsConnected(false);
        setMessages([{ bot: "⚠️ Cannot connect to backend. Make sure your Flask server is running on port 5000." }]);
      }
    };
    
    checkConnection();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { user: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    try {
      const res = await axios.post(`${API_URL}/chat`, { message: input });
      const botMessage = { bot: res.data.response };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prevMessages => [...prevMessages, { 
        bot: "Error: Unable to connect to the backend. Check console for details." 
      }]);
    }

    setInput("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await axios.post(`${API_URL}/upload-calendar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessages(prevMessages => [...prevMessages, { 
        bot: "🗓️ Calendar analyzed: " + JSON.stringify(res.data) 
      }]);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessages(prevMessages => [...prevMessages, { 
        bot: "Error analyzing calendar. Check console for details." 
      }]);
    }
  };

  const handleGradeSubmit = async () => {
    if (!course || !grade) {
      setMessages(prevMessages => [...prevMessages, { 
        bot: "Please enter both course and grade." 
      }]);
      return;
    }
    
    const updatedGrades = {...grades, [course]: grade};
    setGrades(updatedGrades);
    
    try {
      const res = await axios.post(`${API_URL}/submit-grades`, { grades: updatedGrades });
      setMessages(prevMessages => [...prevMessages, { 
        bot: "📊 " + (res.data.recommendations ? res.data.recommendations.join("\n") : JSON.stringify(res.data)) 
      }]);
    } catch (error) {
      console.error("Error submitting grades:", error);
      setMessages(prevMessages => [...prevMessages, { 
        bot: "Error submitting grades. Check console for details." 
      }]);
    }
    
    setCourse("");
    setGrade("");
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
      <div style={{ 
        padding: '5px', 
        borderBottom: '1px solid #eee', 
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0 }}>Student Assistant</h3>
        <span style={{ 
          height: '10px', 
          width: '10px', 
          backgroundColor: isConnected ? 'green' : 'red', 
          borderRadius: '50%', 
          display: 'inline-block' 
        }}></span>
      </div>
      
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        marginBottom: '10px',
        padding: '5px',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px'
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ 
            margin: '8px 0',
            padding: '8px',
            borderRadius: '10px',
            backgroundColor: msg.user ? '#e1f5fe' : '#f1f1f1',
            maxWidth: '80%',
            alignSelf: msg.user ? 'flex-end' : 'flex-start',
            marginLeft: msg.user ? 'auto' : '0'
          }}>
            <strong>{msg.user ? "You" : "Bot"}:</strong> {msg.user || msg.bot}
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex' }}>
        <input
          style={{ 
            padding: '8px', 
            flex: 1, 
            borderRadius: '5px',
            border: '1px solid #ddd'
          }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button 
          onClick={sendMessage}
          style={{
            marginLeft: '5px',
            padding: '8px 15px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
      
      <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>📤 Upload Calendar</summary>
          <div style={{ padding: '10px 0' }}>
            <input type="file" accept=".ics" onChange={handleFileUpload} />
          </div>
        </details>
        
        <details style={{ marginTop: '10px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>📚 Submit Grades</summary>
          <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'column' }}>
            <input 
              style={{ margin: '5px 0', padding: '5px' }}
              placeholder="Course" 
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            />
            <input 
              style={{ margin: '5px 0', padding: '5px' }}
              placeholder="Grade" 
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            />
            <button 
              onClick={handleGradeSubmit}
              style={{
                marginTop: '5px',
                padding: '8px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Submit Grades
            </button>
          </div>
        </details>
      </div>
    </div>
  );
}