import React, { useEffect, useState } from "react";
import "./game.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../../components";
import IsAuthenticate from "../../redirect/IsAuthenticate";
import { database } from "../../firebase.config";
import { onValue, ref } from "firebase/database";
import { dbObject } from "../../helper/constant";
import Keyboard from "../../components/keyboard/Keyboard";
import { Rupee } from "../../assets/svg/CustomSVG";
import { toast } from "react-toastify";
import Toaster, { toastOptions } from "../../components/toaster/Toaster";
import Spinner from "../../components/spinner/Spinner";

const FastParity = () => {
  const navigate = useNavigate();
  const firstCardList = ["A", "B", "C", "D"];
  const [activeBtn2, setActiveBtn2] = useState("OtherPlayers");
  const [timer, setTimer] = useState("0:00");
  const [period, setPeroid] = useState("000000000000");
  const [winWallet, setWinWallet] = useState("0.00");
  const [playWallet, setPlayWallet] = useState("0.00");
  const [amount, setAmount] = useState("");
  const [coin, setCoin] = useState();
  const [color, setColor] = useState();
  const [alphabet, setAlphabet] = useState();
  const [showModal, setShowModal] = useState(false);
  const [timeinSec, setTimeinSec] = useState(0);
  const [myOrder, setMyOrder] = useState([]);
  const [resultHistory, setResultHistory] = useState([]);
  const [platformFees, setplatformFees] = useState();
  const [loading, setLoading] = useState(false);

  const [maxCoinBid, setmaxCoinBid] = useState("1");

  const location = useLocation();

  function secondsToTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  useEffect(() => {
    setLoading(true);
    const powerxRef = ref(database, "power-x/timer");

    try {
      onValue(powerxRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const key = Object.keys(data)[0];
          const { time, period } = data[key];
          setPeroid(period);
          setTimer(secondsToTime(time));
          setTimeinSec(time);
        }
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (timeinSec === 0) {
      getWallet();
      getResultHistory();
      getMyOrder();
    }
  }, [timeinSec]);

  const getWallet = async () => {
    try {
      setLoading(true);
      const { data } = await dbObject("/power-x/fetch-wallet.php");
      if (!data.error) {
        setWinWallet(data?.response.winWallet);
        setPlayWallet(data?.response.playWallet);
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
      const { data } = await dbObject.get("/power-x/control-fields.php");

      if (!data.error) {
        setmaxCoinBid(data.response.maxCoinBid);
        setplatformFees(data.response.platformFees);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(true);
    }
  };

  useEffect(() => {
    getWallet();
    getMyOrder();
    getResultHistory();
    getControlFields();
  }, []);

  const placeBit = async () => {
    setLoading(true);
    if (timeinSec >= 11) {
      try {
        const values = {
          period,
          coin,
          color,
          alphabet,
          points: amount,
        };

        if (!amount)
          return toast.error("Minimum 1 Rupee is required", toastOptions);

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
          "/power-x/place-bid.php",
          formData,
          config
        );
        if (!data.error) {
          toast.success(data.message, toastOptions);
          setAmount("");
          getWallet();
          getMyOrder();
          setShowModal(false);
        } else {
          toast.warning(data.message, toastOptions);
          setShowModal(false);
        }
         setLoading(false)
      } catch (error) {
        console.log(error);
        setLoading(false)
      }
    } else {
      toast.warning("You can place bit after in next period");
      setLoading(false)
    }
  };

  const getMyOrder = async () => {
    try {
      setLoading(true);
      const { data } = await dbObject.get("/power-x/my-orders.php");
      if (!data.error) {
        setMyOrder(data.response);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getResultHistory = async () => {
    try {
      setLoading(true);
      const { data } = await dbObject.get(
        "/power-x/result-history.php?limit=10"
      );

      if (!data.error) {
        setResultHistory(data.response);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <IsAuthenticate path="/power-x">
      {loading && <Spinner />}
      <div className="container" style={{ paddingTop: 55 }}>
        <Header title={"Power X"} />
        <Toaster />

        {showModal && (
          <div className="start-box">
            <div className="start-box-content container">
              <div className="modal-header p-2 mb-3 border-bottom">
                <button
                  onClick={() => setShowModal(false)}
                  className="ms-auto close-btn"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <h2 className="game-name">
                {coin ? "Coin - " : alphabet ? "Alphabet - " : "Color - "}{" "}
                {coin || alphabet || color}
              </h2>

              <div className="contract-point">
                <p>Contract Amount</p>

                <div
                  className="withdrawal__input__field justify-content-start px-3"
                  style={{ backgroundColor: "#e5e5e5" }}
                >
                  <div className="withdrawal__input__field__icon justify-content-start text-dark ">
                    <Rupee />
                  </div>

                  <div
                    className="input pe-3"
                    style={{ fontWeight: "700", fontSize: "1.5rem" }}
                  >
                    {amount}
                  </div>
                </div>
              </div>

              <div className="withdrawal__input__notes d-flex justify-content-between">
                <p className="mb-0 mt-2 text-light">
                  Service charge {platformFees}%
                </p>
                <p className="mb-0 mt-2 text-light">
                  Delivery{" "}
                  {(
                    Number(amount) -
                    (Number(platformFees) / 100) * Number(amount)
                  ).toFixed(2)}
                </p>
              </div>

              <Keyboard
                func={placeBit}
                title={"Start"}
                amount={amount}
                setAmount={setAmount}
              />
            </div>
          </div>
        )}

        <div>
          {/* Wallet */}
          <div className="wallet-container d-flex justify-content-between align-items-center gap-2 my-2">
            <div className="parity-top flex-column align-items-center w-100 p-2 ">
              <p className="mb-1">Win Wallet</p>
              <p style={{ fontSize: "1.5rem", fontWeight: "500" }}>
                ₹{winWallet}
              </p>

              <button
                className="btn text-white rounded-pill w-100 fw-medium"
                style={{
                  backgroundColor: "#fc940d",
                  fontSize: 13,
                }}
                onClick={() =>
                  navigate("/withdraw", { state: { from: location.pathname } })
                }
              >
                Withdraw
              </button>

              <button
                className="btn text-white rounded-pill w-100 fw-medium mt-2"
                style={{
                  backgroundColor: "#00c282",
                  fontSize: 13,
                }}
                onClick={() =>
                  navigate("/transfer", { state: { from: location.pathname } })
                }
              >
                Transfer
              </button>
            </div>

            <div className="parity-top flex-column align-items-center w-100 p-2">
              <p className="mb-1">Play Wallet</p>
              <p style={{ fontSize: "1.5rem", fontWeight: "500" }}>
                ₹{playWallet}
              </p>

              <button
                className="btn text-white rounded-pill w-100 fw-medium"
                style={{
                  backgroundColor: "#fc940d",
                  fontSize: 13,
                }}
                onClick={() =>
                  navigate("/power-x/recharge", {
                    state: { from: location.pathname },
                  })
                }
              >
                Recharge
              </button>

              <button
                className="btn text-white rounded-pill w-100 fw-medium mt-2"
                style={{
                  backgroundColor: "#00c282",
                  fontSize: 13,
                }}
                onClick={() =>
                  navigate("/power-x/forward", {
                    state: { from: location.pathname },
                  })
                }
              >
                Forward
              </button>
            </div>
          </div>

          <div className="parity-top mt-2 px-4 py-2">
            <div className="parity-period">
              <p>5 Minute</p>
              <p>{period}</p>
            </div>

            <div className="parity-count">
              <p className="m-0 mt-1">Count Down</p>
              <div className="parity-count-box p-2 ">
                <p className="m-0">{timer}</p>
              </div>
            </div>
          </div>

          <div className="power-x p-2 mt-2 position-relative">
            {timeinSec < 11 ? (
              <div
                className="countdown"
                style={{
                  position: "absolute",
                  backgroundColor: "#040404b3",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  zIndex: "90",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <section class="wrapper">
                  <div class="top">{timeinSec}</div>
                  <div class="wapper-bottom">{timeinSec}</div>
                </section>
              </div>
            ) : null}
            <p className="mb-1 w-50" style={{ fontSize: 12 }}>
              Maximum bid for Gold and Silver is ₹{maxCoinBid}{" "}
            </p>
            <div className="game-coins position-relative">
              <div
                className="d-flex flex-column gold-coin"
                onClick={() => {
                  setCoin("Gold");
                  setColor("");
                  setAlphabet("");
                  setShowModal(true);
                }}
              >
                <p className="mb-0 pt-3 text-center">GOLD</p>
                <p className="border-top w-75 text-center mx-auto">2X</p>
              </div>

              <div
                className="d-flex flex-column justify-content-center align-items-center silver-coin"
                onClick={() => {
                  setCoin("Silver");
                  setColor("");
                  setAlphabet("");
                  setShowModal(true);
                }}
              >
                <p className="mb-0 pt-3 text-center">SILVER</p>

                <p className="border-top  w-75 text-center mx-auto">2X</p>
              </div>
            </div>

            <div className="prity-colors position-relative">
              <div
                // data-bs-toggle="modal"
                // data-bs-target="#exampleModal"
                className="p-3"
                style={{ backgroundColor: "#d72e2a" }}
                onClick={() => {
                  setCoin("");
                  setColor("Red");
                  setAlphabet("");
                  setShowModal(true);
                }}
              >
                <p className="m-0">Red</p>
                <p className="m-0 border-top w-75 text-center">2X</p>
              </div>

              <div
                // data-bs-toggle="modal"
                // data-bs-target="#exampleModal"
                style={{ backgroundColor: "#388e3d" }}
                onClick={() => {
                  setCoin("");
                  setColor("Green");
                  setAlphabet("");
                  setShowModal(true);
                }}
              >
                <p className="m-0">green</p>
                <p className="m-0 border-top w-75 text-center">3X</p>
              </div>

              <div
                // data-bs-toggle="modal"
                // data-bs-target="#exampleModal"
                style={{ backgroundColor: "#1976d3" }}
                onClick={() => {
                  setCoin("");
                  setColor("Blue");
                  setAlphabet("");
                  setShowModal(true);
                }}
              >
                <p className="m-0">Blue</p>
                <p className="m-0 border-top w-75 text-center">4X</p>
              </div>
            </div>

            <div className="paritynum-btns position-relative">
              {firstCardList.map((item, i) => (
                <div
                  onClick={() => {
                    setCoin("");
                    setColor("");
                    setAlphabet(item);
                    setShowModal(true);
                  }}
                  className="border rounded"
                  key={i}
                >
                  <p className="m-0">{item}</p>
                  <p className="m-0 border-top w-50 text-center">{2 + i}X</p>
                </div>
              ))}
            </div>

            <div className="single-entry">
              <p className="mb-0">Single</p>
              <p className="mb-0">Entry</p>
              <p className="mb-0">Option</p>
            </div>
          </div>

          <div className="gameDetails-btn-group mt-3">
            <button
              onClick={() => setActiveBtn2("OtherPlayers")}
              className={`${
                activeBtn2 === "OtherPlayers" ? "gameDetails-activeBtn" : ""
              }`}
            >
              Result History
            </button>

            <button
              onClick={() => setActiveBtn2("MyOrder")}
              className={`${
                activeBtn2 === "MyOrder" ? "gameDetails-activeBtn" : ""
              }`}
            >
              My Orders
            </button>
          </div>

          {activeBtn2 === "OtherPlayers" ? (
            <div>
              <table style={{ width: "100%", marginTop: "1rem" }}>
                <thead>
                  <tr className="parity-myorder-header parity-myorder row">
                    <td className="col-5">Period</td>
                    <td className="col-2 text-center">Coin</td>
                    <td className="col-2 text-center">Color</td>
                    <td className="col-2">Alphabet</td>
                  </tr>
                </thead>

                <tbody>
                  {resultHistory.map((item, i) => (
                    <tr key={i} className="parity-myorder row">
                      <td className="col-5">{item.period}</td>
                      <td className="parity-selected col-2">
                        <p>{item.coin ? item.coin : "-"}</p>
                      </td>
                      <td className="col-2 text-center">
                        {item.color ? item.color : "-"}
                      </td>
                      <td className="col-2">
                        {item.alphabet ? item.alphabet : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mb-4 d-flex justify-content-center mt-3">
                <button
                  onClick={() =>
                    navigate("/power-x/result-history", {
                      state: { from: location.pathname },
                    })
                  }
                  className="w-50"
                  style={{
                    height: 55,
                    borderColor: "rgb(252, 148, 13)",
                    borderRadius: 5,
                    backgroundColor: "transparent",
                    color: "rgb(252, 148, 13)",
                    fontWeight: "500",
                  }}
                >
                  See More
                </button>
              </div>
            </div>
          ) : (
            <div>
              <table style={{ width: "100%", marginTop: "1rem" }}>
                <thead>
                  <tr className="parity-myorder-header parity-myorder row">
                    <td className="col-5">Period</td>
                    <td className="col-3 text-center">Select</td>
                    <td className="col-2 text-center ">Point</td>
                    <td className="col-2">Won</td>
                  </tr>
                </thead>

                <tbody>
                  {myOrder.map((item, i) => (
                    <tr key={i} className="parity-myorder row">
                      <td className="col-5">{item.period}</td>
                      <td className="parity-selected col-3 text-light text-center">
                        <p>{item.alphabet || item.coin || item.color}</p>
                      </td>
                      <td className="col-2 text-center">₹{item.points}</td>
                      <td className="col-2">₹{item.winPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </IsAuthenticate>
  );
};

export default FastParity;
