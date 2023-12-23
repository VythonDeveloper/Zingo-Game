import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import Toaster from "../components/toaster/Toaster";

const IsAuthenticate = ({ children, path }) => {
  const { loading, user } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate("/signin", { state: { path } });
  }, [user]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "90vh" }}
      >
        <div
          className="spinner-border text-warning"
          // style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="sr-only"></span>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Toaster /> {children}
      </div>
    );
  }
};

export default IsAuthenticate;
