import React, { useState } from "react";
import { useUser } from "../context/userContext";
import { toast } from "react-toastify";

const NewChat = ({ onChatStarted }) => {
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/fetch/search?search=${query}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      toast.error("Search failed");
      console.error("Search error", err);
    }
  };

  const handleStartChat = async (userId) => {
    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });
      const chat = await res.json();
      onChatStarted && onChatStarted(chat);
    } catch (err) {
      toast.error("Failed to start chat");
      console.error("Failed to start chat", err);
    }
  };

  return (
    <div className="text-white">
      <h2 className="text-xl font-bold mb-4">Start New Chat</h2>
      <input
        type="text"
        placeholder="Search users"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full px-4 py-2 mb-4 bg-gray-700 rounded"
      />

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {results.map((u) => (
          <div
            key={u._id}
            className="p-2 bg-gray-700 rounded hover:bg-green-600 cursor-pointer"
            onClick={() => handleStartChat(u._id)}
          >
            {u.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewChat;
