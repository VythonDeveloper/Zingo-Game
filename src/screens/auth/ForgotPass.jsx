import React, { useEffect, useState } from "react";
import IsNotAuthenticate from "../../redirect/IsNotAuthenticate";
import { forgotPassSchema } from "../../validation/auth";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { dbObject } from "../../helper/constant";
import { toast } from "react-toastify";
import { toastOptions } from "../../components/toaster/Toaster";
import "./auth.css";
import axios from "axios";
import Spinner from "../../components/spinner/Spinner";

const initialValues = {
  email: "",
  newPassword: "",
  otp: "",
};

const ForgotPass = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { values, touched, errors, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: forgotPassSchema,
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
            "/users/forgot-password.php",
            formData,
            config
          );
          if (!data.error) {
            toast.success(data.message, toastOptions);

            setTimeout(() => {
              navigate("/signin");
            }, 1000);
          } else {
            toast.error(data.message, toastOptions);
          }

          setLoading(false);
        } catch (error) {
          setLoading(true);
          console.log(error);
          toast.error("Internal server error", toastOptions);
          setLoading(false);
        }
      },
    });

  useEffect(() => {
    if (seconds > 0 && otpSent) {
      const interval = setInterval(() => {
        setSeconds(seconds - 1);
      }, 1000);

      return () => clearInterval(interval);
    }

    if (seconds <= 0) {
      setOtpSent(false);
    }
  }, [seconds, otpSent]);

  const handleOTP = async () => {
    try {
      setLoading(true);
      if (!values.email) return toast.error("Email is required", toastOptions);

      const inputs = {
        email: values.email,
      };
      const formData = new FormData();
      for (const key in inputs) {
        formData.append(key, inputs[key]);
      }
      const config = {
        headers: {
          "Content-Type": "multipart/form-data", // Set the content type to form data
        },
      };
      const { data } = await axios.post(
        "https://app-apis.zingo.online/mail-sender/send-forgot-password-otp.php",
        formData,
        config
      );

      console.log(data);

      if (!data.error) {
        toast.success(data.message, toastOptions);
        setSeconds(60);
        setOtpSent(true);
      } else {
        toast.error(data.message, toastOptions);
      }

      setLoading(false);
    } catch (error) {
      setLoading(true);
      console.log(error);

      if (error?.response?.data) {
        toast.error(error?.response?.data?.error, toastOptions);
      }
      setLoading(false);
    }
  };

  return (
    <IsNotAuthenticate>
      {loading && <Spinner />}

      <div className="login-dark">
        <form onSubmit={handleSubmit} method="post" className="container">
          <h2 className="sr-only">
            Forgot <span>Password</span>
          </h2>

          <div className="form-group mt-4">
            <input
              autoComplete="off"
              className="form-control"
              type="text"
              name="email"
              placeholder="Email"
              value={values.email}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.email && touched.email ? (
              <small style={{ color: "red" }}>{errors.email}</small>
            ) : null}
          </div>

          <div className="form-group mt-2">
            <input
              autoComplete="off"
              className="form-control"
              type="password"
              name="newPassword"
              placeholder="Create Password"
              value={values.newPassword}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.newPassword && touched.newPassword ? (
              <small style={{ color: "red" }}>{errors.newPassword}</small>
            ) : null}
          </div>

          {otpSent && seconds > 0 ? (
            <div
              className="mt-2"
              style={{ fontSize: 12, marginBottom: -12, paddingLeft: 13 }}
            >
              Resend otp in <span>{seconds}</span> s
            </div>
          ) : null}
          <div className="form-group d-flex">
            <input
              autoComplete="off"
              className="form-control"
              type="text"
              name="otp"
              placeholder="OTP"
              value={values.otp}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            <button
              disabled={otpSent}
              onClick={handleOTP}
              type="button"
              className="btn btn-primary"
            >
              OTP
            </button>
          </div>
          {errors.otp && touched.otp ? (
            <small style={{ color: "red" }}>{errors.otp}</small>
          ) : null}

          <div className="form-group mt-4">
            <button className="btn btn-primary btn-block" type="submit">
              Update
            </button>
          </div>

          <Link to={"/signin"} className="signIn_SignUp">
            Remember password? <span>Sign In</span>
          </Link>
        </form>
      </div>
    </IsNotAuthenticate>
  );
};

export default ForgotPass;
