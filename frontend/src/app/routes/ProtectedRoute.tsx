//This components functionality is to protect different routes if user has
// no permission or is not authorized

// ========= MODULES ==========
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import styles from "./styles/ProtectedRoute.module.scss";

import { useUser } from "@/lib/auth";

// ======= COMPONENTS =========
import CircularProgress from "@mui/material/CircularProgress";
import { useNotificationState } from "@/store/UI/NotificationStore";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Get response json from db - data as an object to hold user and token values
  const { data, isLoading } = useUser();
  // When getting info from db show loading indicator
  if (isLoading) {
    return (
      <div className={styles.centeredContent}>
        <CircularProgress />
      </div>
    );
  }

  // If authorization failed then redirect and show error notification
  if (!data || Cookies.get("token") !== data.token) {
    useNotificationState
      .getState()
      .setNotification(
        `This route is not allowed! Sign in or contact support for permissions.`,
        "error",
        "outlined"
      );
    return <Navigate to="/signin" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
