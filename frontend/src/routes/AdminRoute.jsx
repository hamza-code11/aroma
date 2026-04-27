import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = () => {
    const { user, loading } = useContext(AuthContext);

    // Jab tak auth check ho raha hai, tab tak kuch mat dikhao (ya spinner dikhao)
    if (loading) return null; 

    // Agar user login nahi hai ya uska role 'admin' nahi hai
    if (!user || user.role !== "admin") {
        return <Navigate to="/login" replace />;
    }

    // Agar admin hai, to nested routes (Outlet) dikhao
    return <Outlet />;
};

export default AdminRoute;