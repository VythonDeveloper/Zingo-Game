import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../../components";
import "./transfer.css";
import { Rupee } from "../../assets/svg/CustomSVG";
import Keyboard from "../../components/keyboard/Keyboard";
import { dbObject } from "../../helper/constant";
import { toast } from "react-toastify";
import Toaster, { toastOptions } from "../../components/toaster/Toaster";
import IsAuthenticate from "../../redirect/IsAuthenticate";
import useRazorpay from "react-razorpay";
import { AppContext } from "../../context/AppContext";

const Recharge = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const [amount, setAmount] = useState("");
  const [playWallet, setplayWallet] = useState("0.00");
  const [loading, setLoading] = useState(false);

  const [Razorpay, isLoaded] = useRazorpay();
  const [minRecharge, setminRecharge] = useState(0);
  const [rechargeBonus, setrechargeBonus] = useState(0);
  const [level1Bonus, setlevel1Bonus] = useState(0);
  const [level2Bonus, setlevel2Bonus] = useState(0);

  const getWallet = async () => {
    try {
      setLoading(true);
      const { data } = await dbObject.get("/dus-ka-dum/fetch-wallet.php");

      if (!data.error) {
        setplayWallet(data?.response.playWallet);
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
      console.log(data);
      if (!data.error) {
        setminRecharge(data.response.minRecharge);
        setrechargeBonus(data.response.rechargeBonus);
        setlevel1Bonus(data.response.level1Bonus);
        setlevel2Bonus(data.response.level2Bonus);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getWallet();
    getControlFields();
  }, []);

  const rechargeHandler = async (formData) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await dbObject.post(
        "/razorpay/verify-payment.php",
        formData,
        config
      );
      console.log(data);
      if (!data.error) {
        toast.success(data.message, toastOptions);
        getWallet();
        setAmount("");
        setLoading(false);
      } else {
        toast.error(data.message, toastOptions);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  async function createOrder() {
    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("receipt", "Wallet Recharge");
    formData.append("game", "Dus-Ka-Dum");
    const response = await dbObject.post(
      "/razorpay/create-order.php",
      formData
    );
    if (!response.data.error) {
      return response.data.response;
    }
    return null;
  }

  const handlePayment = async () => {
    try {
      setLoading(true);
      if (minRecharge <= parseInt(amount)) {
        const options = {
          key: "rzp_live_IkZ6Jom8wKDXFH",
          amount: parseInt(amount),
          currency: "INR",
          name: "Zingo",
          description: "Dus Ka Dum Wallet Recharge",
          image: "https://zingo.online/favicon.png",
          order_id: await createOrder(),
          handler: function (response) {
            const formData = new FormData();
            formData.append("amount", amount);
            formData.append("game", "Dus-Ka-Dum");
            formData.append("orderId", response.razorpay_order_id);
            formData.append("paymentId", response.razorpay_payment_id);
            rechargeHandler(formData);
          },
          prefill: {
            email: user.email,
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };
        const rzp1 = new Razorpay(options);
        rzp1.on("payment.failed", function (response) {
          alert(response.error);
          console.log(response.error);
        });
        rzp1.open();
      } else {
        toast.error(
          "Minimum recharge allowed is Rs. " + minRecharge,
          toastOptions
        );
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <IsAuthenticate path={"/dus-ka-dum/recharge"}>
      <div className="container" style={{ paddingTop: 55 }}>
        <Header
          title={"Recharge"}
          path={location?.state?.from || "/dus-ka-dum"}
        />
        <Toaster />

        <div className="withdrawal__page__balance__section">
          <center>
            <div className="withdrawal__page__balance__section__top">
              Current Balance
            </div>
            <div
              className="withdrawal__page__balance__section__bottom"
              style={{ fontFamily: "sans-serif" }}
            >
              ₹{playWallet}
            </div>
          </center>
        </div>

        <div className="withdrawal__amount__field">
          <div className="withdrawal__field__header text-light">
            Recharge Play Wallet <br />
            <span style={{ fontSize: 12, fontWeight: "300" }}>
              Min Rs. {minRecharge} & thereafter multiple of Rs. 5
            </span>
          </div>
          <div className="withdrawal__input__field">
            <div className="withdrawal__input__field__icon text-light">
              <Rupee />
            </div>

            <div className="w-100 input">{amount}</div>
          </div>

          <div
            className="withdrawal__input__notes"
            style={{
              color: "white",
            }}
          >
            <p className="mb-0 mt-2">Bonus {rechargeBonus}%</p>
            <p className="mb-0 mt-2">-</p>
            <p className="mb-0 mt-2">( Lv1 Fees {level1Bonus}%</p>
            <p className="mb-0 mt-2">+</p>
            <p className="mb-0 mt-2">Lv2 Fees {level2Bonus}% )</p>
          </div>

          <br />
          <button
            className={`withdraw__btn `}
            style={{
              height: 45,
            }}
            // onClick={transferHandler}
            onClick={handlePayment}
          >
            Recharge
          </button>
        </div>

        <Keyboard setAmount={setAmount} amount={amount} />

        <div className="mt-2">
          <button
            onClick={() =>
              navigate("/recharge-history?type=dus-ka-dum", {
                state: { from: "/dus-ka-dum/recharge" },
              })
            }
            className="w-100"
            style={{
              height: 55,
              borderColor: "rgb(252, 148, 13)",
              borderRadius: 5,
              backgroundColor: "transparent",
              color: "rgb(252, 148, 13)",
              fontWeight: "500",
            }}
          >
            Recharge History
          </button>
        </div>
      </div>
    </IsAuthenticate>
  );
};

export default Recharge;
