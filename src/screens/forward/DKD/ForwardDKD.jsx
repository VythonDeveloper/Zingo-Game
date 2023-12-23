import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./forwardDKD.css";
import Header from "../../../components/header/Header";
import { dbObject } from "../../../helper/constant";
import Toaster, { toastOptions } from "../../../components/toaster/Toaster";
import { toast } from "react-toastify";
import IsAuthenticate from "../../../redirect/IsAuthenticate";
import Spinner from "../../../components/spinner/Spinner";

const Forward = () => {
  const location = useLocation();
  const [contactList, setContactList] = useState([]);
  const [nickname, setnickname] = useState("");
  const [email, setemail] = useState("");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showSendMoney, setShowSendMoney] = useState(false);
  const [points, setPoints] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [forwardFees, setforwardFees] = useState("0");
  const [minForward, setminForward] = useState("0");
  const [loading, setLoading] = useState(false);

  const getContactList = async () => {
    try {
      setLoading(true);
      const { data } = await dbObject("/contact-master/fetch.php");

      if (!data.error) {
        setContactList(data?.response);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getControlFields = async () => {
    try {
      setLoading(true);
      const { data } = await dbObject.get("/dus-ka-dum/control-fields.php");
      if (!data.error) {
        setforwardFees(data.response.forwardFees);
        setminForward(data?.response.minForward);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getContactList();
    getControlFields();
  }, []);

  const handleAddFrinedn = async () => {
    try {
      setLoading(true);
      const values = {
        nickname,
        email,
      };

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
        "/contact-master/add-contact.php",
        formData,
        config
      );

      if (!data.error) {
        toast.success(data.message, toastOptions);
        getContactList();
        setShowAddFriend(false);
      } else {
        toast.error(data.message, toastOptions);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSendMoney = async () => {
    try {
      setLoading(true);
      const values = {
        email: selectedEmail,
        points,
      };

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
        "/dus-ka-dum/forward.php",
        formData,
        config
      );
      if (!data.error) {
        toast.success(data.message, toastOptions);
        setShowSendMoney(false);
        setPoints("");
      } else {
        toast.warning(data.message, toastOptions);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  return (
    <IsAuthenticate path="/dus-ka-dum/forward">
      {loading && <Spinner />}
      <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
        <div className="container dkd-container" style={{ paddingTop: 55 }}>
          {/* Top Navbar */}
          <Header
            backgroundColor={"#fff"}
            title={"Forward"}
            path={location?.state?.from || "/dus-ka-dum"}
          />
          <Toaster />

          <div className="d-flex justify-content-end mb-4">
            <span
              className="text-dark mt-2"
              onClick={() =>
                navigate("/forward-history?type=dus-ka-dum", {
                  state: { from: location.pathname },
                })
              }
            >
              History
            </span>
          </div>

          {showSendMoney && (
            <div className="add-friend">
              <div
                className="modal-dialog modal-dialog-centered container"
                style={{ width: "94%", maxWidth: 400 }}
              >
                <div className="modal-content forward-modal p-3">
                  <div className="modal-header border-bottom mb-3 pb-1">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                      Send Money
                    </h1>
                    <button
                      type="button"
                      className="modal-btn-close"
                      onClick={() => setShowSendMoney(false)}
                      style={{ color: "#fff" }}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                  <p className="mb-2">
                    Note: Minimum Forwaord INR. {minForward}
                  </p>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label
                          htmlFor="exampleInputPassword1"
                          className="form-label"
                        >
                          Points
                        </label>
                        <input
                          type="number"
                          value={points}
                          className="form-control text-light"
                          id="exampleInputPassword1"
                          style={{ background: "#d3d3d33b", border: "none" }}
                          onChange={(e) => setPoints(e.target.value)}
                        />
                      </div>
                    </form>
                  </div>
                  <div>
                    <p>Forward Fee {forwardFees}%</p>
                  </div>
                  <div className="modal-footer gap-3">
                    <button
                      type="button"
                      className="close-btn"
                      onClick={() => setShowSendMoney(false)}
                    >
                      CLOSE
                    </button>
                    <button
                      type="button"
                      className="btn px-3 text-light"
                      style={{ background: "#fec007" }}
                      onClick={handleSendMoney}
                    >
                      SEND
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {contactList?.length ? (
            <div>
              {contactList.map((item, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setShowSendMoney(true);
                    setSelectedEmail(item.email);
                  }}
                  className="transaction-history-card py-0"
                >
                  <div className="info">
                    <i
                      className="bi bi-person-circle"
                      style={{ fontSize: "3rem", color: "#b3b1b1" }}
                    ></i>
                    <div>
                      <p className="m-0 text-dark">{item.nickname}</p>
                      <p className="m-0 text-dark">{item.email}</p>
                    </div>
                  </div>

                  {/* <div>
              <i
                className="bi bi-trash3-fill text-light"
                style={{ fontSize: "1.2rem" }}
              ></i>
            </div> */}
                </div>
              ))}
            </div>
          ) : (
            <div className="bank-card" style={{ backgroundColor: "#8a8a8a2b" }}>
              <div>
                <i className="bi bi-person-rolodex"></i>
              </div>
              <p>Add your first friend</p>
            </div>
          )}

          {/* Add */}
          {showAddFriend && (
            <div className="add-friend">
              <div
                className="modal-dialog modal-dialog-centered"
                style={{ width: "94%", maxWidth: 400 }}
              >
                <div className="modal-content forward-modal p-3">
                  <div className="modal-header border-bottom mb-3 pb-1">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                      Add Friend
                    </h1>
                    <button
                      type="button"
                      className="modal-btn-close"
                      onClick={() => setShowAddFriend(false)}
                      style={{ color: "#fff" }}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div>
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          value={nickname}
                          className="form-control text-light"
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          style={{ background: "#d3d3d33b", border: "none" }}
                          onChange={(e) => setnickname(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="exampleInputPassword1"
                          className="form-label"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          className="form-control text-light"
                          id="exampleInputPassword1"
                          style={{ background: "#d3d3d33b", border: "none" }}
                          onChange={(e) => setemail(e.target.value)}
                        />
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer gap-3">
                    <button
                      type="button"
                      className="close-btn"
                      onClick={() => setShowAddFriend(false)}
                    >
                      CLOSE
                    </button>
                    <button
                      type="button"
                      className="btn px-3 text-light"
                      style={{ background: "#fec007" }}
                      onClick={handleAddFrinedn}
                    >
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="floating-btn d-flex align-items-center justify-content-center rounded-circle">
            <button
              type="button"
              className="w-100 h-100 d-flex justify-content-center align-items-center"
              onClick={() => setShowAddFriend(true)}
            >
              <i className="bi bi-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </IsAuthenticate>
  );
};

export default Forward;
