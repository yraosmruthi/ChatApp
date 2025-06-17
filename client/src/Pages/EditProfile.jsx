import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function EditProfile() {
  const Navigate = useNavigate()
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNameUpdate = async () => {
    if (!newName.trim()) {
      return toast.error("Please enter a new name");
      
    }
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/edit/update-name",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ newName: newName.trim() }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Name updated successfully");
        setNewName("");
        Navigate("/chat");
      } else {
        toast.error(result.msg || "Failed to update name");
        Navigate("/chat");
      }
    } catch (err) {
      toast.error("Server error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async () => {
    if (!newEmail.trim()) {
      return toast.error("Please enter a new email");
    }
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/edit/update-email",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ newEmail: newEmail.trim() }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Email updated successfully");
        setNewEmail("");
        Navigate("/chat");
      } else {
        toast.error(result.msg || "Failed to update email");
        Navigate("/chat");
      }
    } catch (err) {
      toast.error("Server error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md text-white relative">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">
          Edit Profile
        </h2>

        {/* Name Update */}
        <div className="mb-6">
          <label className="block text-sm mb-2 text-gray-300">New Name</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new name"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleNameUpdate}
            disabled={loading}
            className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            {loading ? "Updating..." : "Update Name"}
          </button>
        </div>

        {/* Email Update */}
        <div className="mb-4">
          <label className="block text-sm mb-2 text-gray-300">New Email</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter new email"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleEmailUpdate}
            disabled={loading}
            className="mt-3 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            {loading ? "Updating..." : "Update Email"}
          </button>
        </div>

        {/* Optional Cancel Button */}

        <div className="flex gap-60">
          <button
            onClick={() => {
              setNewName("");
              setNewEmail("");
            }}
            className="mt-2 text-center text-sm text-gray-400 hover:text-gray-200 underline w-full"
          >
            Reset
          </button>

          <button
            onClick={() => {
             setNewName("");
             setNewEmail("");
             Navigate("/chat");
            }}
            className="mt-2 text-center text-sm text-gray-400 hover:text-gray-200 underline w-full"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}