import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    chrome.storage.local.get("messages", (result) => {
      const loadedMessages = result.messages || [];
      setMessages(loadedMessages);

      // Update badge count based on unread messages when popup opens
      const unreadCount = loadedMessages.filter((msg) => !msg.read).length;
      if (unreadCount > 0) {
        chrome.action.setBadgeText({ text: unreadCount.toString() });
        chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
      } else {
        chrome.action.setBadgeText({ text: "" });
      }
    });
  }, []);

  const markAsRead = (id) => {
    const updatedMessages = messages.map((msg) =>
      msg.id === id ? { ...msg, read: true } : msg
    );
    setMessages(updatedMessages);
    chrome.storage.local.set({ messages: updatedMessages });

    const unreadCount = updatedMessages.filter((msg) => !msg.read).length;
    if (unreadCount > 0) {
      chrome.action.setBadgeText({ text: unreadCount.toString() });
      chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
    } else {
      chrome.action.setBadgeText({ text: "" });
    }
  };

  return (
    <div className="App">
      <h1>Organization Messages</h1>
      <div className="message-list">
        {messages.length === 0 ? (
          <p>No messages available</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.priority.toLowerCase()} ${
                msg.read ? "read" : ""
              }`}
            >
              {msg.priority === "high" && (
                <div className={`exclamation ${msg.read ? "read" : ""}`}>!</div>
              )}
              <p>
                <strong>{msg.content}</strong>
              </p>
              <p>Priority: {msg.priority}</p>
              <button
                className={msg.read ? "read" : ""}
                onClick={() => !msg.read && markAsRead(msg.id)}
              >
                {msg.read ? "Read" : "Mark as Read"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
