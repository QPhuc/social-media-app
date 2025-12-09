import { Outlet } from "react-router-dom";
export default function ProtectedRoutes() {
	//   const { user } = useAuth(); // Get user from Auth Context

	// If no user is logged in → redirect to login page
	//   if (!user) {
	// return <Navigate to="/login" replace />;
	//   }

	// Otherwise → allow access to the route
	return <Outlet />;
}
