import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/LoadingSpinner";

const endpoint = import.meta.env.VITE_API_URL;

export default function EditProfile() {
  const Navigate = useNavigate();
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNameUpdate = async () => {
    if (!newName.trim()) return toast.error("Please enter a new name");

    setLoading(true);
    try {
      const response = await fetch(
        `${endpoint}/api/edit/update-name`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
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
      }
    } catch (err) {
      toast.error("Server error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async () => {
    if (!newEmail.trim()) return toast.error("Please enter a new email");

    setLoading(true);
    try {
      const response = await fetch(
        `${endpoint}/api/edit/update-email`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
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
      }
    } catch (err) {
      toast.error("Server error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePicUpdate = async () => {
    if (!profilePic) return toast.error("Please choose a profile picture");

    setLoading(true);
    const formData = new FormData();
    formData.append("pic", profilePic);

    try {
      const response = await fetch(`${endpoint}/api/edit/update-pic`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await response.json()
      try{
      if (response.ok) {
        toast.success("Profile picture updated");
        setProfilePic(null);
        Navigate("/chat");
      } else {
        toast.error( "Failed to update picture");
      }
    } catch (err) {
      toast.error("Server error");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }catch(error){
    console.log(error)
   }
  };

  const handlePasswordUpdate = async () => {
    if (!oldPassword || !newPassword)
      return toast.error("Fill both password fields");

    setLoading(true);
    try {
      const response = await fetch(`${endpoint}/api/edit/update-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Password updated successfully");
        setOldPassword("");
        setNewPassword("");
        Navigate("/chat");
      } else {
        toast.error(result.msg || "Failed to update password");
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
      <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md text-white relative overflow-y-auto max-h-[90vh] scrollbar-hide">
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
        <div className="mb-6">
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

        {/* Profile Pic Update */}
        <div className="mb-6">
          <label className="block text-sm mb-2 text-gray-300">
            Update Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePic(e.target.files[0])}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-purple-600 file:text-white
                      hover:file:bg-purple-700"
          />
          <button
            onClick={handlePicUpdate}
            disabled={loading}
            className="mt-3 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
          >
            {loading ? "Updating..." : "Update Picture"}
          </button>
        </div>

        {/* Password Update */}
        <div className="mb-4">
          <label className="block text-sm mb-2 text-gray-300">
            Old Password
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter current password"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <label className="block text-sm mt-3 mb-2 text-gray-300">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handlePasswordUpdate}
            disabled={loading}
            className="mt-3 w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => {
              setNewName("");
              setNewEmail("");
              setOldPassword("");
              setNewPassword("");
              setProfilePic(null);
            }}
            className="w-full py-2 text-center text-sm text-gray-400 hover:text-gray-200 underline"
          >
            Reset
          </button>

          <button
            onClick={() => {
              Navigate("/chat");
            }}
            className="w-full py-2 text-center text-sm text-gray-400 hover:text-gray-200 underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
 