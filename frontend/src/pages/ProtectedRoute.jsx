import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const ProtectedRoute = ({ element, children, isAdmin = false }) => {
    const location = useLocation();
    const { isAuthenticated, loading, user } = useSelector((state) => state.user || {});

    useEffect(() => {
        if (!loading && isAuthenticated && isAdmin && user?.role !== "admin") {
            toast.error("Access denied! Admin privileges required.", { position: "bottom-center" });
        }
    }, [loading, isAuthenticated, isAdmin, user?.role]);

    // Show loading spinner while user auth state is being verified
    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-purple-50/20">
                <div className="flex flex-col items-center gap-3 text-purple-600">
                    <Loader2 size={36} className="animate-spin" />
                    <p className="text-xs font-semibold text-slate-500">Authenticating...</p>
                </div>
            </div>
        );
    }

    // Not logged in -> send to login page with return path
    if (!isAuthenticated) {
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
    }

    // Logged in but not an admin -> redirect home
    if (isAdmin && user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return element || children;
};

export default ProtectedRoute;