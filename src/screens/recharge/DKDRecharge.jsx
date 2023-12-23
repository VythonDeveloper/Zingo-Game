import React from "react";
import { Header } from "../../components";
import { useLocation, useNavigate } from "react-router-dom";
import { whiteQr } from "../../assets";
import IsAuthenticate from "../../redirect/IsAuthenticate";

const Recharge = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <IsAuthenticate path={'/dus-ka-dum/recharge'}>
      
      <div className="container" style={{paddingTop: 55}}>
        <Header title={"Recharge"} path={location?.state?.from || "/dus-ka-dum"} />
        <div className="d-flex flex-column align-items-center mt-2">
          <p className="mb-0">Recharge for</p>
          <p
            className="mb-2"
            style={{ fontSize: "2rem", color: "#398d3f", fontWeight: "500" }}
          >
            10 Ka Dum
          </p>
          <p>Proceed to pay</p>

          <div className="mt-4 d-flex justify-content-center mb-2">
            <img style={{ width: "60%" }} src={whiteQr} alt="" />
          </div>
          <p>Scan the QR code to pay</p>
          <p>
            Note - After paying send the sceenshot of the confirmation page and
            transaction page of the UPI app used for payment.
          </p>
        </div>

        <div className="mt-2">
          <button
            onClick={() => navigate("/dus-ka-dum")}
            className="w-100 mb-2 withdraw__btn"
            style={{ height: 55 }}
          >
            Continue to the Game
          </button>
          <button
            onClick={() =>
              navigate("/recharge-history?type=dus-ka-dum", {
                state: { from: '/dus-ka-dum/recharge' },
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
