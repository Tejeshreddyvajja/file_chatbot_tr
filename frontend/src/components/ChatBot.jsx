import React, { useState } from "react";
import "./ChatBot.css";

function ChatBot() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      console.log("Response from backend:", data); // 👈 See this in browser console

      if (data && data.reply) {
        setResponse(data.reply);
      } else {
        setResponse("No response received from backend.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setResponse("Something went wrong.");
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <h2 className="chatbot-title">Ask the Chatbot</h2>
      
      <div className="chat-input-section">
        <div className="input-group">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            className="chat-input"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            className="send-btn"
            disabled={loading || !message.trim()}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-section">
          <div className="loading-spinner"></div>
          <p className="loading-text">Thinking...</p>
        </div>
      )}

      {response && (
        <div className="response-section">
          <div className="bot-response">
            <div className="bot-label">🤖 Bot:</div>
            <div className="bot-message">{response}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
