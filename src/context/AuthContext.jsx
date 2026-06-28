import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      setToken(savedToken);

      try {
        const res = await axios.get(
          "https://supermarket-api-w79n.onrender.com/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          },
        );

        setUser(res.data);
      } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        "https://supermarket-api-w79n.onrender.com/api/auth/me",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setUser(res.data);
    } catch (err) {
      console.log("Auth check failed:", setUser(null));
    } finally {
      setLoading(false);
    }
  };

  const login = (token, user) => {
    localStorage.setItem("token", token);
    setToken(token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
