import React, { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import { toast } from "react-toastify";

const NewGroupChat = ({ onGroupCreated, onClose }) => {
  const { user } = useUser();
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");

  const fetchAllUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/fetch", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setAllUsers(data);
    } catch (err) {
      toast.error("Failed to fetch users");
      console.error(err);
    }
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length < 2) {
      toast.error("Enter group name and select at least 2 users");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/chat/group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: groupName,
          users: selectedUsers, // <-- send array directly, no JSON.stringify
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error( "Error creating group");
        return;
      }

      const data = await res.json();
      toast.success("Group created successfully!");
      if (onGroupCreated) onGroupCreated(data);
      if (onClose) onClose();
    } catch (err) {
      toast.error("Error creating group");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="text-white">
      <h2 className="text-xl font-bold mb-4">Create New Group</h2>
      <input
        type="text"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="w-full px-4 py-2 mb-4 bg-gray-700 rounded"
      />

      <div className="max-h-48 overflow-y-auto mb-4">
        {allUsers
          .filter((u) => u._id !== user._id)
          .map((u) => (
            <label key={u._id} className="block cursor-pointer">
              <input
                type="checkbox"
                checked={selectedUsers.includes(u._id)}
                onChange={() => handleCheckboxChange(u._id)}
                className="mr-2"
              />
              {u.name}
            </label>
          ))}
      </div>

      <button
        onClick={handleCreateGroup}
        className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        Create Group
      </button>
    </div>
  );
};

export default NewGroupChat;
