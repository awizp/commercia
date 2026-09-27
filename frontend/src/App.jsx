import { useEffect } from "react";
import { Outlet } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

import { loadUser } from "./features/users/userSlice.js";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    // check backend for uer authentication
    const hasStoredAuth = localStorage.getItem("isAuthenticated") === "true";
    if (hasStoredAuth && !isAuthenticated) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <section>
      {/* all pages appear via routes */}
      <Outlet />

      {/* toast ui for application */}
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#1e293b",
            borderRadius: "1rem",
            border: "1px solid #f1f5f9",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            fontSize: "0.875rem",
            fontWeight: "500"
          }
        }}
      />
    </section>
  );
};

export default App;