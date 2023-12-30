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
import Spinner from "../../components/spinner/Spinner";
import useRazorpay from "react-razorpay";
import { AppContext } from "../../context/AppContext";

const Recharge = () => {
  const { user } = useContext(AppContext);
  const location = useLocation();
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
      const { data } = await dbObject.get("/power-x/fetch-wallet.php");

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
      const { data } = await dbObject.get("/power-x/control-fields.php");
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

  const navigate = useNavigate();

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
    formData.append("game", "Power-X");
    const response = await dbObject.post(
      "/razorpay/create-order.php",
      formData
    );
    console.log(formData);
    console.log(response.data);
    if (!response.data.error) {
      return response.data.response;
    }
    return "";
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
          description: "Power-X Wallet Recharge",
          image: "https://zingo.online/favicon.png",
          order_id: await createOrder(),
          handler: function (response) {
            const formData = new FormData();
            formData.append("amount", amount);
            formData.append("game", "Power-X");
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
    <IsAuthenticate path={"/power-x/recharge"}>
      {loading && <Spinner />}
      <div className="container px-transfer" style={{ paddingTop: 55 }}>
        <Header title={"Recharge"} path={location?.state?.from || "/power-x"} />
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

          <div className="withdrawal__input__notes">
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

        <div className="d-flex justify-content-center mt-4 mb-4">
          <button
            onClick={() =>
              navigate("/recharge-history?type=power-x", {
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
            Recharge History
          </button>
        </div>
      </div>
    </IsAuthenticate>
  );
};

export default Recharge;
