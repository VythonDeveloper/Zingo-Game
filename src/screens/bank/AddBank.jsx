import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import { useFormik } from "formik";
import { bankValidation } from "../../validation/auth";
import "./bank.css";
import { dbObject } from "../../helper/constant";
import { toast } from "react-toastify";
import Toaster, { toastOptions } from "../../components/toaster/Toaster";
import { useLocation, useNavigate } from "react-router-dom";
import IsAuthenticate from "../../redirect/IsAuthenticate";
import Spinner from "../../components/spinner/Spinner";

const AddBank = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolder: "",
    upiAddress: "",
  });

  const handleAddBank = async (e) => {
    e.preventDefault();

    try {
      setLoading(true)
      const formData = new FormData();
      for (const key in values) {
        formData.append(key, values[key]);
      }
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await dbObject.post(
        "/bank-account/update.php",
        formData,
        config
      );

      if (!data.error) {
        toast.success(data.message, toastOptions);

        setTimeout(() => {
          navigate(location?.state?.from || "/home");
          setLoading(false)
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  const getBank = async () => {
    try {
      const { data } = await dbObject.get("/bank-account/fetch.php");

      if (!data.error && data?.response) {
        setValues(data.response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { value, name } = e.target;

    setValues({ ...values, [name]: value });
  };

  useEffect(() => {
    getBank();
  }, []);

  return (
  <IsAuthenticate path="/bank">
    {loading && <Spinner />}
    <div className="container" style={{paddingTop: 55, paddingBottom: 30}}>
      {/* Top Navbar */}
      <Header title={"Add Bank"} path={location?.state?.from || "/home"} />
      <Toaster />

      <div className="addbank-icon">
        <i className="bi bi-bank2"></i>
      </div>

      <form onSubmit={handleAddBank}>
        <div className="up-input-outer">
          <label htmlFor="input1">Bank Name</label>
          <input
            id="input1"
            type="text"
            placeholder="Eg., State Bank of India"
            value={values.bankName}
            name="bankName"
            onChange={handleChange}
          />
        </div>

        <div className="up-input-outer">
          <label htmlFor="input2">Account Number</label>
          <input
            id="input2"
            type="text"
            placeholder="Eg., 110283...."
            value={values.accountNumber}
            name="accountNumber"
            onChange={handleChange}
          />
        </div>

        <div className="up-input-outer">
          <label htmlFor="input3">IFSC Code</label>
          <input
            id="input3"
            type="text"
            placeholder="Eg., SBIN008.."
            value={values.ifscCode}
            name="ifscCode"
            onChange={handleChange}
          />
        </div>

        <div className="up-input-outer">
          <label htmlFor="input4">Account Holder Name</label>
          <input
            id="input4"
            type="text"
            placeholder="Eg., Your Name"
            value={values.accountHolder}
            name="accountHolder"
            onChange={handleChange}
          />
        </div>

        <div className="up-input-outer">
          <label htmlFor="input1">upiAddress Address</label>
          <input
            id="input1"
            type="text"
            placeholder="Eg., some@upiAddress"
            value={values.upiAddress}
            name="upiAddress"
            onChange={handleChange}
          />
        </div>
        <div style={{ width: "100%" }}>
          <button
            className="withdraw__btn"
            style={{ marginTop: "1.5rem", height: 55 }}
            type="submit"
          >
            Add bank account
          </button>
        </div>
      </form>
    </div>
    </IsAuthenticate>
  );
};

export default AddBank;
