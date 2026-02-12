import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { RotatingLines, RotatingTriangles } from "react-loader-spinner";
import { Navigate } from "react-router";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
    }

    const checkLogin = async () => {
      try {
        const res = await axios.post(`${API_BASE}/api/user/check`);
        console.log("token 驗證結果:", res.data);
        setIsAuth(true);
      } catch (error) {
        console.error("token 驗證失敗", error.response);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);
  // }, [navigate]);
  if (loading) return <RotatingTriangles />;
  if (!isAuth) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
