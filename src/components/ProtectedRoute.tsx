import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface PropProtectedRoute {
	children?: ReactElement;
	isAuthenticated: boolean;
	isAdmin?: boolean;
	adminRoute?: boolean;
	redirect?: string;
}

const ProtectedRoute = ({
	isAuthenticated = false,
	adminRoute = false,
	children,
	isAdmin = false,
	redirect = "/",
}: PropProtectedRoute) => {
	if (!isAuthenticated) {
		// toast.error("This Page Only Accessible For Login Users");
		return <Navigate to={redirect} />;
	}
	if (adminRoute && !isAdmin) {
		// toast.error("Admin Routes Only Accessible For Admins");
		return <Navigate to={redirect} />;
	}
	return children ? children : <Outlet />;
};

export default ProtectedRoute;
