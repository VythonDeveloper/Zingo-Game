import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Toaster from "../components/toaster/Toaster";

const IsNotAuthenticate = ({ children }) => {
  const { loading, user } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      return navigate(location?.state?.path || "/home");
    }
  }, [user, location?.state?.path, loading, navigate]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "90vh" }}
      >
        <div
          className="spinner-border text-warning"
        //   style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="sr-only"></span>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Toaster />
        {children}
      </div>
    );
  }
};

export default IsNotAuthenticate;
