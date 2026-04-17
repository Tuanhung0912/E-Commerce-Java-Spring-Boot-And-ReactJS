import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = ({ publicPage = false, adminOnly = false }) => {
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");
    const isSeller = user && user?.roles.includes("ROLE_SELLER");
    const location = useLocation();

    // Public pages (login, register): redirect to home if already logged in
    if (publicPage) {
        return user ? <Navigate to="/" /> : <Outlet />
    }

    // Not logged in at all → redirect to login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Admin-only routes: check admin/seller roles
    if (adminOnly) {
        if (!isAdmin && !isSeller) {
            return <Navigate to="/" replace />;
        }
        if (isSeller && !isAdmin) {
            const sellerAllowedPaths = ["/admin/orders", "/admin/products"];
            const sellerAllowed = sellerAllowedPaths.some(path => 
                location.pathname.startsWith(path)
            );
            if (!sellerAllowed) {
                return <Navigate to="/" replace />;
            }
        }
    }

    // User is logged in → allow access
    return <Outlet />;
}

export default PrivateRoute