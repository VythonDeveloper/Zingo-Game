import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../../../components";
import "./DKDTransfer.css";
import { Rupee } from "../../../assets/svg/CustomSVG";
import Keyboard from "../../../components/keyboard/Keyboard";
import { dbObject } from "../../../helper/constant";
import { toast } from "react-toastify";
import Toaster, { toastOptions } from "../../../components/toaster/Toaster";
import IsAuthenticate from "../../../redirect/IsAuthenticate";
import Spinner from "../../../components/spinner/Spinner";

const Transfer = () => {
  const location = useLocation();
  const [amount, setAmount] = useState("");
  const [bonus, setBonus] = useState("0");
  const [winWallet, setWinWallet] = useState("0.00");
  const [minimunTransfer, setMinimumTrasfer] = useState();
  const [level1Bonus, setLevel1Bonus] = useState(0);
  const [level2Bonus, setLevel2Bonus] = useState(0);
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  const getWallet = async () => {
    try {
      setLoading(true)
      const { data } = await dbObject("/dus-ka-dum/fetch-wallet.php");

      if (!data.error) {
        setWinWallet(data?.response.winWallet);
      }
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  const getControlFields = async () => {
    try {
      setLoading(true)
      const { data } = await dbObject.get("/dus-ka-dum/control-fields.php");

      if (!data.error) {
        setBonus(data.response.transferBonus);
        setMinimumTrasfer(data?.response.minTransfer);
        setLevel2Bonus(data.response.level2Bonus);
        setLevel1Bonus(data.response.level1Bonus);
      }
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  useEffect(() => {
    getWallet();
    getControlFields();
  }, []);

  const transferHandler = async () => {
    try {
      setLoading(true)
      const values = {
        points: amount,
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
        "/dus-ka-dum/transfer.php",
        formData,
        config
      );

      if (!data.error) {
        toast.success(data.message, toastOptions);
        getWallet();
        setAmount("");
      } else {
        toast.error(data.message, toastOptions);
      }
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  return (
    <IsAuthenticate path={"/dus-ka-dum/transfer"}>
      {
        loading && <Spinner />
      }
      <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
        <Toaster />
        <div className="container dkd-container" style={{ paddingTop: 55 }}>
          <Header
            backgroundColor={"#fff"}
            title={"Transfer"}
            path={location?.state?.from || "/dus-ka-dum"}
          />

          <div className="withdrawal__page__balance__section mt-4">
            <center>
              <div className="withdrawal__page__balance__section__top">
                Win Wallet
              </div>
              <div
                className="withdrawal__page__balance__section__bottom"
                style={{ fontFamily: "sans-serif" }}
              >
                ₹{winWallet}
              </div>
            </center>
          </div>

          <div className="withdrawal__amount__field">
            <div className="withdrawal__field__header">
              Transfer to Play Wallet <br />
              <span style={{ fontSize: 12, fontWeight: "300" }}>
                Min Rs. {minimunTransfer} & thereafter multiple of Rs. 5
              </span>
            </div>
            <div className="withdrawal__input__field">
              <div className="withdrawal__input__field__icon">
                <Rupee />
              </div>

              <div className="w-100 input text-dark">{amount}</div>
            </div>

            <div className="withdrawal__input__notes">
              <p className="mb-0 mt-2">Bonus {bonus}%</p>
              <p className="mb-0 mt-2">
                Referral Fees {Number(level1Bonus) + Number(level2Bonus)}%
              </p>
            </div>

            <br />
            <button
              className={`withdraw__btn`}
              style={{
                height: 45,
              }}
              onClick={transferHandler}
            >
              Transfer
            </button>
          </div>

          <Keyboard color={"#c1bebe27"} setAmount={setAmount} amount={amount} />
          <div className="d-flex justify-content-center mt-4 pb-3">
          <button
            onClick={() =>
              navigate("/transfer-history?type=dus-ka-dum", {
                state: { from: location.pathname },
              })
            }
            className="w-75"
            style={{
              height: 55,
              borderColor: "rgb(252, 148, 13)",
              borderRadius: 5,
              backgroundColor: "transparent",
              color: "rgb(252, 148, 13)",
              fontWeight: "500",
            }}
          >
            Transfer History
          </button>
        </div>
        </div>

      
      </div>
    </IsAuthenticate>
  );
};

export default Transfer;
