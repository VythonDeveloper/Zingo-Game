import React, { useEffect, useState } from "react";
import "./game.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../../components";
import { database } from "../../firebase.config";
import { onValue, ref } from "firebase/database";
import { dbObject } from "../../helper/constant";
import { Rupee } from "../../assets/svg/CustomSVG";
import Keyboard from "../../components/keyboard/Keyboard";
import IsAuthenticate from "../../redirect/IsAuthenticate";
import { toast } from "react-toastify";
import Toaster, { toastOptions } from "../../components/toaster/Toaster";
import Spinner from "../../components/spinner/Spinner";

const Parity = () => {
  const navigate = useNavigate();
  const firstCardList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const [timer, setTimer] = useState("0:00");
  const [period, setPeroid] = useState("--/--/---- --:-- --");
  const [winWallet, setWinWallet] = useState("0.00");
  const [playWallet, setPlayWallet] = useState("0.00");
  const [amount, setAmount] = useState("");
  const [platformFees, setplatformFees] = useState();
  const [nums, setNums] = useState({
    num1: "",
    num2: "",
    num3: "",
    num4: "",
    num5: "",
    num6: "",
    num7: "",
    num8: "",
    num9: "",
    num10: "",
    num11: "",
    num12: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedNum, setSelectedNum] = useState(null);
  const [selectedNum2, setSelectedNum2] = useState(null);
  const [result, setResult] = useState([]);
  const [currentDayHistory, setCurrentDayHistory] = useState([]);
  const [time, setTime] = useState(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  function secondsToTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  useEffect(() => {
    const dusKaDamRef = ref(database, "dus-ka-dum/timer");

    try {
      setLoading(true);
      onValue(dusKaDamRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const key = Object.keys(data)[0];
          const { time, period } = data[key];
          setPeroid(period);
          setTimer(secondsToTime(time));
          setTime(time);
        }
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (time === 0) {
      getResultHistory();
      getCurrentDayHistory();
      getWallet();
    }
  }, [time]);

  const getWallet = async () => {
    try {
      setLoading(true);
      const { data } = await dbObject("/dus-ka-dum/fetch-wallet.php");

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
      const { data } = await dbObject.get("/dus-ka-dum/control-fields.php");
      if (!data.error) {
        setplatformFees(data.response.platformFees);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getWallet();
    getResultHistory();
    getCurrentDayHistory();
    getControlFields();
  }, []);

  const [showMyBidId, setShowMyBidId] = useState(false);

  const getResultHistory = async () => {
    try {
      setLoading(true);
      const { data } = await dbObject.get(
        "/dus-ka-dum/result-history.php?limit=5"
      );
      console.log(data);
      if (!data.error) {
        setResult(data.response);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getCurrentDayHistory = async () => {
    try {
      setLoading(true);
      const { data } = await dbObject.get(
        "/dus-ka-dum/my-current-day-orders.php"
      );

      if (!data.error) {
        setCurrentDayHistory(data.response);

        console.log(data.response);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = () => {
    setNums({ ...nums, [selectedNum]: amount });
    setShowModal(false);
    setAmount("");
  };

  const placeBit = async () => {
    try {
      setLoading(true);
      if (time >= 11) {
        const values = {
          ...nums,
          period,
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
          "/dus-ka-dum/place-bid.php",
          formData,
          config
        );

        if (!data.error) {
          toast.success(data.message, toastOptions);
          getWallet();
          getCurrentDayHistory();
        } else {
          toast.error(data.message, toastOptions);
        }
        setLoading(false);
      } else {
        toast.warning("We are not accepting any more bids");
        setLoading(false);
      }

      setNums({
        num1: "",
        num2: "",
        num3: "",
        num4: "",
        num5: "",
        num6: "",
        num7: "",
        num8: "",
        num9: "",
        num10: "",
        num11: "",
        num12: "",
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const formatPeriodFunc = (period) => {
    let periodArr = period.split("-");

    const formatedPeriod = `${periodArr[2]}/${periodArr[1]}/${periodArr[0]} ${periodArr[3]}:${periodArr[4]} ${periodArr[5]}`;
    return formatedPeriod;
  };

  return (
    <IsAuthenticate path="/dus-ka-dum">
      {loading && <Spinner />}
      <Toaster />
      <div style={{ background: "#fff", minHeight: "100vh", color: "#000" }}>
        <div className="container dus-ka-dum" style={{ paddingTop: 55 }}>
          <Header backgroundColor={"#fff"} title={"10 Ka Dum"} />

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
                <h2 className="game-name">Selected - {selectedNum2}</h2>

                <div className="contract-point">
                  <p>Contract Amount</p>

                  <div
                    className="withdrawal__input__field justify-content-start px-3"
                    style={{ backgroundColor: "#e5e5e5" }}
                  >
                    <div className="withdrawal__input__field__icon justify-content-start text-dark">
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
                  func={handleChange}
                  title={"Continue"}
                  amount={amount}
                  setAmount={setAmount}
                />
              </div>
            </div>
          )}

          <div>
            {/* Wallet */}
            <div className="wallet-container d-flex justify-content-between align-items-center gap-2 mt-2">
              <div className="parity-top flex-column align-items-center w-100 p-2 ">
                <p className="mb-1">Win Wallet</p>
                <p style={{ fontSize: "1.5rem", fontWeight: "500" }}>
                  ₹{winWallet}
                </p>

                <button
                  className="btn text-white rounded-pill w-100 fw-medium"
                  style={{
                    backgroundColor: "#65c65f",
                    fontSize: 13,
                  }}
                  onClick={() =>
                    navigate("/dus-ka-dum/withdraw", {
                      state: { from: location.pathname },
                    })
                  }
                >
                  Withdraw
                </button>

                <button
                  className="btn text-white rounded-pill w-100 fw-medium mt-2"
                  style={{
                    backgroundColor: "#25263b",
                    fontSize: 13,
                  }}
                  onClick={() =>
                    navigate("/dus-ka-dum/transfer", {
                      state: { from: location.pathname },
                    })
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
                    backgroundColor: "#65c65f",
                    fontSize: 13,
                  }}
                  onClick={() =>
                    navigate("/dus-ka-dum/recharge", {
                      state: { from: location.pathname },
                    })
                  }
                >
                  Recharge
                </button>

                <button
                  className="btn text-white rounded-pill w-100 fw-medium mt-2"
                  style={{
                    backgroundColor: "#25263b",
                    fontSize: 13,
                  }}
                  onClick={() =>
                    navigate("/dus-ka-dum/forward", {
                      state: { from: location.pathname },
                    })
                  }
                >
                  Forward
                </button>
              </div>
            </div>

            {/* Timer */}
            <div className="timer dkd  my-2 position-relative">
              <div>
                <div className="parity-period  rounded d-flex flex-column align-items-center justify-content-center p-1">
                  <p
                    className="mb-0 pb-0 px-3"
                    style={{
                      backgroundColor: "#fff",
                      fontWeight: "900",
                      color: "#002060",
                      fontSize: "14px",
                    }}
                  >
                    5 Minute
                  </p>
                  <p className="mb-0" style={{ fontSize: 14 }}>
                    {formatPeriodFunc(period)}
                  </p>
                </div>
                <p
                  className="mb-1 mt-1 w-25 d-flex justify-content-center text-light"
                  style={{
                    backgroundColor: "#098285",
                    position: "absolute",
                    bottom: "-12.5px",
                    borderRadius: 5,
                  }}
                >
                  Result...
                </p>
              </div>

              <div className="parity-count rounded p-1 ">
                <p
                  className="m-0"
                  style={{ fontWeight: "800", color: "#002060" }}
                >
                  Time Left
                </p>
                <div className="parity-count-box p-1 ">
                  <p
                    className="m-0"
                    style={{ backgroundColor: "#fff", color: "#000" }}
                  >
                    {timer}
                  </p>
                </div>
              </div>
            </div>

            <div className="slider mt-2">
              {result.map((item, i) => {
                let periodArr = item.period.split("-");
                const formatedArr = `${periodArr[3]}:${periodArr[4]} ${periodArr[5]}`;

                return (
                  <div
                    key={i}
                    className="slide-item d-flex flex-column align-item-center"
                  >
                    <div>{item.number || "?"}</div>
                    <p
                      className="mb-0 text-danger text-center"
                      style={{ fontSize: "10px", fontWeight: "600" }}
                    >
                      {formatedArr}
                    </p>
                  </div>
                );
              })}

              <div
                onClick={() =>
                  navigate("/dus-ka-dum/result", {
                    state: { from: "/dus-ka-dum/result" },
                  })
                }
                className="slider-btn ms-auto"
              >
                <i className="bi bi-arrow-right-square-fill"></i>
              </div>
            </div>

            <div className="paritynum-btns mt-2 p-4 position-relative">
              {time < 11 ? (
                <div
                  className="countdown"
                  style={{
                    position: "absolute",
                    backgroundColor: "#04040440",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    zIndex: "90",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                    width: "100%",
                    height: "100%",
                    color: "#c70d0e",
                  }}
                >
                  <section class="wrapper">
                    <div class="top">{time}</div>
                    <div class="wapper-bottom">{time}</div>
                  </section>
                </div>
              ) : null}
              {firstCardList.map((item, i) => (
                <div
                  className="position-relative item mb-2 dkd-chip"
                  onClick={() => {
                    setShowModal(true);
                    setSelectedNum(`num${i + 1}`);
                    setSelectedNum2(i + 1);
                  }}
                  key={i}
                >
                  <p className="m-0 text-light">{item}</p>
                  {nums[`num${i + 1}`] > 0 ? (
                    <span className="dus-ka-dum-flag text-light">
                      <span
                        className="w-100 h-75 mt-2 text-center bg-war"
                        style={{ backgroundColor: "#A084E8" }}
                      >
                        {nums[`num${i + 1}`]}
                      </span>
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="d-flex justify-content-center mt-2">
              <button onClick={placeBit} className="enter-btn">
                Enter
              </button>
            </div>

            <div className="dkd-table">
              <div className="header mt-4 p-2">
                <p className="mb-0">Entry no.</p>
                <p className="text-center mb-0">ID</p>
                <p className="text-center mb-0">Total</p>
                <p className="text-center mb-0">Result</p>
                <p className="text-end mb-0">Won </p>
              </div>

              {currentDayHistory?.map((item, i) => (
                <React.Fragment key={i}>
                  <div className="value  p-2">
                    <p className="mb-0">
                      {item.entryNo}{" "}
                      {showMyBidId === item.id ? (
                        <i
                          onClick={() => {
                            setShowMyBidId("");
                          }}
                          className="bi bi-arrow-down-circle"
                        ></i>
                      ) : (
                        <i
                          onClick={() => {
                            setShowMyBidId(item.id);
                          }}
                          className="bi bi-arrow-up-circle"
                        ></i>
                      )}
                    </p>
                    <p className="text-center mb-0" style={{ fontSize: 11 }}>
                      {formatPeriodFunc(item.period)}
                    </p>
                    <div className="text-center mb-0">₹{item.totalPoints}</div>
                    <div className="text-center mb-0">
                      {item.numberResult || "?"}
                    </div>
                    <p
                      className={`text-end mb-0`}
                      style={{ fontSize: "18px", fontWeight: "500" }}
                    >
                      ₹{item.winPoints}
                    </p>
                  </div>

                  {showMyBidId === item.id ? (
                    <div className="my-bit mt-2">
                      <div className="d-flex justify-content-between">
                        <ResultCircle numResult={item.num1} num="1" />
                        <ResultCircle numResult={item.num2} num="2" />
                        <ResultCircle numResult={item.num3} num="3" />
                        <ResultCircle numResult={item.num4} num="4" />
                        <ResultCircle numResult={item.num5} num="5" />
                        <ResultCircle numResult={item.num6} num="6" />
                      </div>

                      <div className="d-flex justify-content-between mt-2">
                        <ResultCircle numResult={item.num7} num="7" />
                        <ResultCircle numResult={item.num8} num="8" />
                        <ResultCircle numResult={item.num9} num="9" />
                        <ResultCircle numResult={item.num10} num="10" />
                        <ResultCircle numResult={item.num11} num="11" />
                        <ResultCircle numResult={item.num12} num="12" />
                      </div>
                    </div>
                  ) : null}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </IsAuthenticate>
  );
};

const ResultCircle = ({ numResult, num }) => (
  <div className={`d-flex flex-column gap-1 text-center`}>
    <p
      className="mb-0 text-light d-flex justify-content-center align-items-center rounded-pill fw-blod fw-bold bg-danger"
      style={{ width: 30, height: 30 }}
    >
      {num}
    </p>
    <p className="mb-0">{numResult}</p>
  </div>
);

export default Parity;
