import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import NewGroupChat from "../components/NewGroupChat";
import NewChat from "../components/NewChat";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const endpoint = "http://localhost:3000";

const Chat = () => {
  const { user, isLoggedIn, logout, loading } = useUser();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const chatBottomRef = useRef(null);
  const socket = useRef(null);
  const selectedChatCompare = useRef(null);

  const navigate = useNavigate();

  const fetchChats = async () => {
    try {
      const res = await fetch(`${endpoint}/api/chat`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      setChats(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching chats:", error);
      setChats([]);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const res = await fetch(`${endpoint}/api/message/${selectedChat._id}`, {
        credentials: "include",
      });

      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
      socket.current.emit("join room", selectedChat._id);
    } catch (err) {
      console.error("Failed to fetch messages", err);
      toast.error("Failed to fetch messages");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(`${endpoint}/api/message`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newMessage,
          chatId: selectedChat._id,
        }),
      });

      const data = await res.json();
      socket.current.emit("new message", data.message);
      setMessages((prev) => [...prev, data.message]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Error sending message");
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare.current = selectedChat;
  })
  
  useEffect(() => {
    if (!loading && !isLoggedIn) navigate("/");
    if (!loading && isLoggedIn) fetchChats();
  }, [isLoggedIn, loading, user, navigate]);

  useEffect(() => {
    socket.current = io(endpoint);
    socket.current.emit("setup", user);
    socket.current.on("connected", () => console.log("Socket connected"));

    socket.current.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare.current ||
        selectedChatCompare.current._id !== newMessageRecieved.chat._id
      ) {
        setNotifications((prev) => [...prev, newMessageRecieved]);
      } else {
        setMessages((prev) => [...prev, newMessageRecieved]);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [user]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col relative">
      {/* Top Nav */}
      <nav className="flex justify-between items-center px-6 py-4 bg-gray-800 shadow-lg">
        <h1 className="text-3xl font-bold text-white">Talk-A-Tive</h1>

        <div className="flex items-center space-x-4 relative">
          <button className="relative text-white hover:text-blue-400 transition">
            <Bell className="w-6 h-6" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-3 bg-blue-600 px-4 py-2 rounded-full focus:outline-none hover:bg-blue-700 transition"
            >
              <img
                src={user?.pic || "/default-profile.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <span className="font-semibold">{user?.name || "Profile"}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-2 z-20">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="w-1/3 bg-gray-800 p-4 overflow-y-auto border-r border-gray-700">
          <h2 className="text-xl font-semibold mb-4 border-b border-blue-600 pb-2">
            My Chats
          </h2>

          <button
            onClick={() => setShowGroupModal(true)}
            className="w-full mb-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            + New Group Chat
          </button>

          <button
            onClick={() => setShowNewChatModal(true)}
            className="w-full mb-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            + New Chat
          </button>

          {chats.length === 0 ? (
            <p className="text-gray-400">No chats found.</p>
          ) : (
            <div className="space-y-3">
              {chats.map((chat) => {
                const otherUser = chat.users.find(
                  (u) => String(u._id) !== String(user._id)
                );
                const isActive = selectedChat?._id === chat._id;

                return (
                  <div
                    key={chat._id}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-4 rounded-lg cursor-pointer transition ${
                      isActive ? "bg-blue-700" : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    <p className="font-semibold text-white">
                      {chat.isGroupChat
                        ? chat.chatName
                        : otherUser?.name || "Unknown User"}
                    </p>
                    <p className="text-sm text-gray-300 mt-1 truncate">
                      {chat.latestMessage?.content || "No messages yet"}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Main Chat Window */}
        <div className="w-2/3 p-6 flex flex-col">
          {selectedChat ? (
            <>
              <div className="border-b border-gray-700 pb-4 mb-4">
                <h3 className="text-2xl font-bold text-white">
                  {selectedChat.isGroupChat
                    ? selectedChat.chatName
                    : selectedChat.users.find(
                        (u) => String(u._id) !== String(user._id)
                      )?.name}
                </h3>
              </div>

              <div className="flex-grow bg-gray-800 rounded-lg p-4 overflow-y-auto mb-4">
                {messages.length === 0 ? (
                  <p className="text-gray-400 text-sm italic">
                    No messages yet. Start the conversation!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`max-w-xs p-3 rounded-lg ${
                          msg.sender._id === user._id
                            ? "ml-auto bg-blue-600 text-white"
                            : "mr-auto bg-gray-700 text-white"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs text-gray-300 mt-1 text-right">
                          {msg.sender.name}
                        </p>
                      </div>
                    ))}
                    <div ref={chatBottomRef} />
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-grow px-4 py-2 rounded-l-lg bg-gray-700 text-white focus:outline-none"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg text-white"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-xl">Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for New Group Chat */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg relative w-full max-w-md mx-auto">
            <button
              onClick={() => setShowGroupModal(false)}
              className="absolute top-2 right-2 text-white text-xl hover:text-red-500"
            >
              &times;
            </button>
            <NewGroupChat
              onGroupCreated={(newGroup) => {
                setChats((prev) => [newGroup, ...prev]);
                setSelectedChat(newGroup);
                setShowGroupModal(false);
              }}
              onClose={() => setShowGroupModal(false)}
            />
          </div>
        </div>
      )}

      {/* Modal for New Chat */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg relative w-full max-w-md mx-auto">
            <button
              onClick={() => setShowNewChatModal(false)}
              className="absolute top-2 right-2 text-white text-xl hover:text-red-500"
            >
              &times;
            </button>
            <NewChat
              onChatStarted={(newChat) => {
                setChats((prev) => {
                  const exists = prev.find((c) => c._id === newChat._id);
                  if (exists) return prev;
                  return [newChat, ...prev];
                });
                setSelectedChat(newChat);
                setShowNewChatModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
