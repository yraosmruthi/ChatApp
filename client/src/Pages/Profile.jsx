import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, logout } = useUser();
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/auth/delete", {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error( "Failed to delete account.");
        setLoading(false);
        return;
      }

      await logout();
      toast.success("account deleted successfully")
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <img
          src={user?.pic || "/default-profile.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-blue-500"
        />
        <h1 className="text-2xl font-bold mb-2">{user?.name}</h1>
        <p className="text-gray-400 mb-4">{user?.email}</p>

        <button
          onClick={() => navigate("/chat")}
          className="w-full py-2 mb-3 bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          Back to Chats
        </button>

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="w-full py-2 bg-red-600 rounded hover:bg-red-700 transition"
          >
            Delete My Account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-red-400 font-semibold">
              Are you sure you want to delete your account? This action is
              irreversible.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
