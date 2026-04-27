import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const UserProtectedRoute = () => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return null; // Wait for auth check

    if (!user) {
        // user ko login par bhejo aur current location save kar lo taake login ke baad wapis yahin aaye
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default UserProtectedRoute;