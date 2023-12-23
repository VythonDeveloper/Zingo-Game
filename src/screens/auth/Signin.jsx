import React, { useContext, useEffect, useState } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { signinSchema } from "../../validation/auth";
import { AppContext } from "../../context/AppContext";
import { dbObject } from "../../helper/constant";
import IsNotAuthenticate from "../../redirect/IsNotAuthenticate";
import { toast } from "react-toastify";
import { toastOptions } from "../../components/toaster/Toaster";
import { auth, provider } from "../../firebase.config";
import { signInWithPopup } from "firebase/auth";
import Spinner from "../../components/spinner/Spinner";

const initialValues = {
  email: "",
  password: "",
};
const Signin = () => {
  const { setUser } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);

      const body = {
        email: result?.user?.email,
        uid: result?.user?.uid,
      };

      const formData = new FormData();
      for (const key in body) {
        formData.append(key, body[key]);
      }
      const config = {
        headers: {
          "Content-Type": "multipart/form-data", // Set the content type to form data
        },
      };

      const { data } = await dbObject.post(
        "/users/login-with-google.php",
        formData,
        config
      );

      if (!data.error) {
        toast.success(data.message, toastOptions);
        setUser(data.response);
      } else {
        toast.error(data.message, toastOptions);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error signing in with Google:", error);
    }
  };
  const { values, touched, errors, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: signinSchema,
      onSubmit: async () => {
        try {
          setLoading(true);
          const formData = new FormData();
          for (const key in values) {
            formData.append(key, values[key]);
          }
          const config = {
            headers: {
              "Content-Type": "multipart/form-data", // Set the content type to form data
            },
          };

          const { data } = await dbObject.post(
            "/users/login-with-email.php",
            formData,
            config
          );
          if (!data.error) {
            toast.success(data.message, toastOptions);

            setTimeout(() => {
              setUser(data.response);
              // navigate('/')
              setLoading(false);
            }, 1000);
          } else {
            toast.error(data.message, toastOptions);
            setLoading(false);
          }
        } catch (error) {
          setLoading(true);
          console.log(error);
          toast.error("Internal server error", toastOptions);
          setLoading(false);
        }
      },
    });

  return (
    <IsNotAuthenticate>
      {loading && <Spinner />}

      <div className="login-dark">
        <form onSubmit={handleSubmit} method="post" className="container">
          <h2 className="sr-only text-center">Sign In</h2>

          <div onClick={handleGoogleLogin} className="google-auth">
            <i className="bi bi-google"></i>

            <span>Sign in with Google</span>
          </div>

          <p className="mb-0 mt-4 text-center" style={{ color: "#95999d" }}>
            Or
          </p>

          <div className="form-group mt-2">
            <input
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              className="form-control"
              type="text"
              name="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && touched.email ? (
              <small style={{ color: "red" }}>{errors.email}</small>
            ) : null}
          </div>

          <div className="form-group mt-2">
            <input
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              className="form-control"
              type="password"
              name="password"
              placeholder="Password"
              value={values.password}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.password && touched.password ? (
              <small style={{ color: "red" }}>{errors.password}</small>
            ) : null}
          </div>
          <div className="form-group mt-4">
            <button className="btn btn-primary btn-block" type="submit">
              Sign In
            </button>
          </div>
          <Link to="/forgot-password" className="forgot">
            Forgot your password?
          </Link>

          <Link to={"/auth-refer"} className="signIn_SignUp">
            Don't have an account? <span>Sign Up</span>
          </Link>
        </form>
      </div>
    </IsNotAuthenticate>
  );
};

export default Signin;
