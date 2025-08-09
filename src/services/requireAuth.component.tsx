import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "./auth.service";

function RequireAuth(props: { component: React.ReactNode }) {
  const { component } = props;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(
    () => {
      if (!isAuthenticated()) {
        const currentPage: string = window.location.pathname;
        const localNextPage = localStorage.getItem("nextPage");
        if (!localNextPage && currentPage !== "/login") {
          localStorage.setItem("nextPage", currentPage);
        }
        navigate("/login");
        return;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAuthenticated, navigate, location]
  );

  if (!isAuthenticated()) {
    return;
  }

  return component;
}

export default RequireAuth;
