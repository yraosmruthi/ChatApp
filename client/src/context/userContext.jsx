import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        console.log("Failed to fetch user - not authenticated");
        setUser(null);
        return;
      }

      const data = await res.json();
      console.log("User fetched successfully:", data);
      setUser(data);
    } catch (err) {
      console.log("Error fetching user:", err);
      setUser(null);
      toast.error("Backend error");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        toast.error("Logout failed");
        return;
      }

      setUser(null);
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error("Logout failed");
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const isLoggedIn = !!user;

  return (
    <UserContext.Provider
      value={{ user, isLoggedIn, logout, loading, fetchUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export default UserProvider;
