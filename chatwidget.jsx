import React, { useState, useRef, useEffect } from "react";
import API from "../api";
import "./chatwidget.css";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    if (!text.trim()) return;
    const userMsg = { from: "user", text };
    setMessages((m) => [...m, userMsg]);
    setText("");
    setLoading(true);
    try {
      const res = await API.post("/chat", { message: text });
      setMessages((m) => [...m, { from: "bot", text: res.data.reply }]);
    } catch (err) {
      setMessages((m) => [...m, { from: "bot", text: "Chat service not available." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`chat-widget ${open ? "open" : ""}`}>
      <div className="chat-toggle" onClick={() => setOpen(!open)}>
        💬
      </div>

      {open && (
        <div className="chat-panel">
          <div className="chat-header">MedAssist AI</div>
          <div className="chat-body">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.from}`}>
                <div className="bubble">{m.text}</div>
              </div>
            ))}
            {loading && <div className="msg bot"><div className="bubble">...</div></div>}
            <div ref={endRef} />
          </div>

          <div className="chat-input">
            <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask something..." />
            <button onClick={send}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
