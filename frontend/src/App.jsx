import { useState } from "react";
import ChatBot from "./components/ChatBot";
import FluidText from "./components/FluidText";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    setResponse(result.message || "File uploaded!");
  };

  return (
    <div className="app-container">
      <FluidText />
      <div className="upload-section">
        <h2 className="section-title">CSV Upload for Chatbot</h2>
        <div className="upload-controls">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="file-input"
          />
          <button onClick={handleUpload} className="upload-btn">
            Upload
          </button>
        </div>
        {response && <p className="response-text">{response}</p>}
      </div>

      <hr className="section-divider" />

      <ChatBot />
    </div>
  );
}

export default App;
  