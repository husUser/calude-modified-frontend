import { Navigate, Outlet } from "react-router-dom";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

const PrivateRoute = () => {
  const auth = useAuthUser();


  // If user is not authenticated, redirect to login
  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated but not verified, redirect to verification page
  if (auth?.token && auth?.verification !== true) {
    return <Navigate to="/verifyLogIn" replace />;
  }

  return <Outlet />; // Render child routes if authentication checks pass
};

export default PrivateRoute;
