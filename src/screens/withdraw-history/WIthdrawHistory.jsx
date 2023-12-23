import React, { useEffect, useState } from "react";
import { Header } from "../../components";
import { useLocation } from "react-router-dom";
import { dbObject } from "../../helper/constant";
import "./withdraw-history.css";
import IsAuthenticate from "../../redirect/IsAuthenticate";
import Spinner from "../../components/spinner/Spinner";

const WIthdrawHistory = () => {
  const location = useLocation();
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const getWithdrawHitory = async () => {
    try {
      setLoading(true);
      const { data } = await dbObject.get("/power-x/withdraw-history.php");
      if (!data.error) {
        setWithdrawHistory(data?.response);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getWithdrawHitory();
  }, []);
  return (
    <IsAuthenticate path={"/power-x/withdraw-history"}>
      {loading && <Spinner />}
      <div className="container powerx-withdraw" style={{ paddingTop: 55 }}>
        <Header
          title={"Withdraw History"}
          path={location?.state?.from || "/power-x"}
        />

        <h3>Power X</h3>

        {withdrawHistory.map((item, i) => (
          <div key={i} className="withdrawalRecords__container">
            <div className="withdrawalRecords__container__box">
              <div className="withdrawalRecords__container__box__top">
                <div
                  className="withdrawalRecords__container__box__top__col"
                  style={{ flexBasis: "32%", width: "100%" }}
                >
                  <div className="withdrawalRecords__container__box__top__top">
                    Amount
                  </div>
                  <div
                    className="withdrawalRecords__container__box__top__bottom"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    ₹{item.withdrawPoints}
                  </div>
                </div>
                <div
                  className="withdrawalRecords__container__box__top__col"
                  style={{ flexBasis: "34%", width: "100%" }}
                >
                  <div className="withdrawalRecords__container__box__top__top">
                    Time
                  </div>
                  <div className="withdrawalRecords__container__box__top__bottom">
                    {/* 01/25 16:24 */}
                    {item.date}
                  </div>
                </div>
                <div
                  className="withdrawalRecords__container__box__top__col"
                  style={{
                    flexBasis: "34%",
                    width: "100%",
                    textAlign: "right",
                  }}
                >
                  <div className="withdrawalRecords__container__box__top__top">
                    Status
                  </div>
                  <div className="withdrawalRecords__container__box__top__bottom">
                    {item.status}
                  </div>
                </div>
              </div>
              <div className="withdrawalRecords__container__box__bottom">
                <div
                  className="withdrawalRecords__container__box__bottom__top"
                  style={{ marginTop: 12 }}
                >
                  <div className="withdrawalRecords__container__box__bottom__top__col">
                    Name:
                  </div>
                  <div
                    style={{ textTransform: "capitalize" }}
                    className="withdrawalRecords__container__box__bottom__top__col"
                  >
                    {item.accountHolder}
                  </div>
                </div>

                <div className="withdrawalRecords__container__box__bottom__top">
                  <div className="withdrawalRecords__container__box__bottom__top__col">
                    Account Number:
                  </div>
                  <div className="withdrawalRecords__container__box__bottom__top__col">
                    {item.accountNumber}
                  </div>
                </div>
                <div className="withdrawalRecords__container__box__bottom__top">
                  <div className="withdrawalRecords__container__box__bottom__top__col">
                    UPI:
                  </div>
                  <div className="withdrawalRecords__container__box__bottom__top__col">
                    {item.upiAddress}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </IsAuthenticate>
  );
};

export default WIthdrawHistory;
