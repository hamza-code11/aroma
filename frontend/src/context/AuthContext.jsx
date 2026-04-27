import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async (showLoading = true) => {
    const token = localStorage.getItem("token");
    if (!token) {
      if (showLoading) setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (err) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const login = async (token) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    await checkUser(false);
  };

  const logout = async () => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        await axios.post(`${API_URL}/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser(true);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, checkUser, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};