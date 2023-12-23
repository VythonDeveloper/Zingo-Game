import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../../components";
import "./transfer.css";
import { Rupee } from "../../assets/svg/CustomSVG";
import Keyboard from "../../components/keyboard/Keyboard";
import { dbObject } from "../../helper/constant";
import { toast } from "react-toastify";
import Toaster, { toastOptions } from "../../components/toaster/Toaster";
import IsAuthenticate from "../../redirect/IsAuthenticate";
import Spinner from "../../components/spinner/Spinner";

const Transfer = () => {
  const location = useLocation();
  const [amount, setAmount] = useState("");
  const [transferlevel1Bonus, setTransferLevel1Bonus] = useState(0);
  const [transferlevel2Bonus, setTransferLevel2Bonus] = useState(0);
  const [bonus, setBonus] = useState("0");
  const [winWallet, setWinWallet] = useState("0.00");
  const [minimunTransfer, setMinimumTrasfer] = useState();
  const [loading, setLoading] = useState(false)

  const getWallet = async () => {
    try {
      setLoading(true)
      const { data } = await dbObject.get("/power-x/fetch-wallet.php");

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
      const { data } = await dbObject.get("/power-x/control-fields.php");
      if (!data.error) {
        setBonus(data.response.transferBonus);
        setMinimumTrasfer(data?.response.minTransfer);
        setTransferLevel2Bonus(data.response.transferLevel2Bonus);
        setTransferLevel1Bonus(data.response.transferLevel1Bonus);
      }
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  const navigate = useNavigate();

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
        "/power-x/transfer.php",
        formData,
        config
      );

      if (!data.error) {
        toast.success(data.message, toastOptions);
        getWallet();
        setAmount("");
        setLoading(false)
      } else {
        toast.error(data.message, toastOptions);
        setLoading(false)
      }
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  return (
    <IsAuthenticate path={"/transfer"}>
      {loading && <Spinner />}
      <div className="container px-transfer" style={{ paddingTop: 55 }}>
        <Header title={"Transfer"} path={location?.state?.from || "/power-x"} />
        <Toaster />

        <div className="withdrawal__page__balance__section">
          <center>
            <div className="withdrawal__page__balance__section__top">
              Win Balance
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
          <div className="withdrawal__field__header text-light">
            Transfer to Play Wallet <br />
            <span style={{ fontSize: 12, fontWeight: "300" }}>
              Min Rs. {minimunTransfer} & thereafter multiple of Rs. 5
            </span>
          </div>
          <div className="withdrawal__input__field">
            <div className="withdrawal__input__field__icon text-light">
              <Rupee />
            </div>

            <div className="w-100 input">{amount}</div>
          </div>

          <div className="withdrawal__input__notes">
            <p className="mb-0 mt-2">Bonus {bonus}%</p>
            <p className="mb-0 mt-2">-</p>
            <p className="mb-0 mt-2">(</p>
            <p className="mb-0 mt-2">
              Lv1 Fees {transferlevel1Bonus}%
            </p>
            <p className="mb-0 mt-2">+</p>
            <p className="mb-0 mt-2">
              Lv2 Fees {transferlevel2Bonus}%
            </p>
            <p className="mb-0 mt-2">)</p>
          </div>

          <br />
          <button
            className={`withdraw__btn `}
            style={{
              height: 45,
            }}
            onClick={transferHandler}
          >
            Transfer
          </button>
        </div>

        <Keyboard setAmount={setAmount} amount={amount} />

        <div className="d-flex justify-content-center mt-4 mb-4">
          <button
            onClick={() =>
              navigate("/transfer-history?type=power-x", {
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
    </IsAuthenticate>
  );
};

export default Transfer;
