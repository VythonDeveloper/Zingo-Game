import React, { useState } from "react";
import "./auth.css";
import IsNotAuthenticate from "../../redirect/IsNotAuthenticate";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { referSchema } from "../../validation/auth";
import { useFormik } from "formik";
import { dbObject } from "../../helper/constant";
import { toast } from "react-toastify";
import Toaster, { toastOptions } from "../../components/toaster/Toaster";
import Spinner from "../../components/spinner/Spinner";

const Refer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [loading, setLoading] = useState(false)

  // Access the specific parameter you need
  const referCode = queryParams.get("refercode");

  const initialValues = {
    referrerCode: referCode || "",
  };

  const { values, touched, errors, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: referSchema,
      onSubmit: async () => {
        try {
          setLoading(true)
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
            "/users/validate-referrer-code.php",
            formData,
            config
          );

          if (!data.error) {
            toast.success(data.message, toastOptions);
            navigate("/signup?redirect=true", {
              state: { referrerCode: values.referrerCode },
            });
          } else {
            toast.error(data.message, toastOptions);
          }

          setLoading(false)
        } catch (error) {
          console.log(error);
          setLoading(false)
        }
      },
    });

  return (
    <IsNotAuthenticate>
      {
        loading && <Spinner />
      }
      <Toaster />
      <div className="login-dark">
        <form onSubmit={handleSubmit} method="post" className="container">
          <h2 className="sr-only">Refer Code</h2>

          <div className="form-group mt-2">
            <input
              autoComplete="off"
              className="form-control"
              type="text"
              name="referrerCode"
              placeholder="Referal Code"
              value={values.referrerCode}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.referrerCode && touched.referrerCode ? (
              <small style={{ color: "red" }}>{errors.referrerCode}</small>
            ) : null}
          </div>
          <div className="form-group mt-4">
            <button className="btn btn-primary btn-block" type="submit">
              Continue
            </button>
          </div>
        </form>
      </div>
    </IsNotAuthenticate>
  );
};

export default Refer;
