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
        credentials: "include", // include cookies
      });

      if (!res.ok) console.log("Failed to fetch user");

      const data = await res.json();
      setUser(data);
    } catch (err) {
      setUser(null);
      toast.error("backend error")
      console.log(err)
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

      if (!res.ok) toast.error("Logout failed");

      setUser(null);
     
      
    } catch (err) {
      toast.error("logout failed");
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const isLoggedIn = !!user;

  return (
    <UserContext.Provider value={{ user, isLoggedIn, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export default UserProvider;
