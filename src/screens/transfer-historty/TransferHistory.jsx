import "./rechargehistory.css";
import { emptyBox } from "../../assets";
import { Header } from "../../components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { dbObject } from "../../helper/constant";
import IsAuthenticate from "../../redirect/IsAuthenticate";
import Spinner from "../../components/spinner/Spinner";

const RechargeHistory = () => {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);

  // Get a specific query parameter
  const paramValue = queryParams.get("type");

  const getPowerx = async () => {
    try {
      setLoading(true);
      const { data } = await dbObject("/power-x/transfer-history.php");
      console.log(data);
      if (!data.error) {
        setData(data.response);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getDusKadum = async () => {
    try {
      setLoading(true);
      const { data } = await dbObject("/dus-ka-dum/transfer-history.php");
      console.log(data);
      if (!data.error) {
        setData(data.response);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (paramValue === "power-x") {
      getPowerx();
    } else if (paramValue === "dus-ka-dum") {
      getDusKadum();
    } else {
      navigate("/home");
    }
    setLoading(false);
  }, [location]);

  return (
    <IsAuthenticate path={`/transfer-history?type=${paramValue}`}>
      {loading && <Spinner />}
      <div className="container" style={{ paddingTop: 55 }}>
        <Header
          title={"Transfer History"}
          path={
             paramValue === "power-x"
              ? "/transfer"
              : "/dus-ka-dum/transfer"
          }
        />

        <h3>{paramValue === "power-x" ? "Power X" : "Dus Ka Dum"}</h3>

        {data.length ? (
          <div className="recharge-history-card-group">
            {data.map((item, i) => (
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
                        ₹{item.transferPoints}
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
                        Bonus:
                      </div>
                      <div
                        style={{ textTransform: "capitalize" }}
                        className="withdrawalRecords__container__box__bottom__top__col"
                      >
                        ₹{item.bonus}
                      </div>
                    </div>

                    <div className="withdrawalRecords__container__box__bottom__top">
                      <div className="withdrawalRecords__container__box__bottom__top__col">
                        Points:
                      </div>
                      <div className="withdrawalRecords__container__box__bottom__top__col">
                        ₹{item.points}
                      </div>
                    </div>
                    <div className="withdrawalRecords__container__box__bottom__top">
                      <div className="withdrawalRecords__container__box__bottom__top__col">
                        Referral Fees:
                      </div>
                      <div className="withdrawalRecords__container__box__bottom__top__col">
                        ₹{item.referralFees}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="emptyImage">
            <img src={emptyBox} alt="" />
          </div>
        )}
      </div>
    </IsAuthenticate>
  );
};

export default RechargeHistory;
