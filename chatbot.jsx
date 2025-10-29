import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import API from "../api";
import "./chatbot.css";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!text.trim()) return;
    const userMsg = { from: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setText("");
    setLoading(true);

    try {
      const res = await API.post("/chat", { message: text });
      const botMsg = { from: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Chat service not available." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-header">🩺 MedAssist AI</div>

      <div className="chat-body">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            className={`msg ${m.from}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bubble">{m.text}</div>
          </motion.div>
        ))}

        {loading && (
          <div className="msg bot">
            <div className="bubble typing-bubble">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask your medical question..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
