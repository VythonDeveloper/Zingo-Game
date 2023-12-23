import React, { useEffect, useState } from "react";
import "./duskadum-result.css";
import { Header } from "../../components";
import { dbObject } from "../../helper/constant";
import IsAuthenticate from "../../redirect/IsAuthenticate";
import Spinner from "../../components/spinner/Spinner";

const DKDResult = () => {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getResultHistory();
  }, []);
  const getResultHistory = async () => {
    try {
      setLoading(true);
      const { data } = await dbObject.get("/dus-ka-dum/result-history.php");

      if (!data.error) {
        setResult(data.response);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <IsAuthenticate path="/dus-ka-dum/result">
      <div style={{ background: "#fff", minHeight: "100vh", color: "#000" }}>
        <div className="container dus-ka-dum" style={{ paddingTop: 55 }}>
          <Header
            backgroundColor={"#fff"}
            title={"Result"}
            path={"/dus-ka-dum"}
          />

          <div className="result-history">
            <div className="header mt-4 p-2">
              <p className="mb-0">Period</p>
              {/* <p className="text-center mb-0"></p> */}
              <p className="text-center mb-0">Number</p>
              <p className="text-end mb-0">Status</p>
            </div>

            {result.length ? (
              result?.map((item, i) => {
                let periodArr = item.period.split("-");

                let formatedPeriod = `${periodArr[2]}/${periodArr[1]}/${periodArr[0]} ${periodArr[3]}:${periodArr[4]} ${periodArr[5]}`;

                return (
                  <div key={i} className="value  p-2">
                    <p className="mb-0">{formatedPeriod}</p>

                    <div>
                      <button className="text-center mb-0">
                        {item.number || "?"}
                      </button>
                    </div>

                    <p
                      className={`text-end mb-0 ${
                        item.status === "Running"
                          ? "text-danger"
                          : "text-success"
                      }`}
                      style={{ fontSize: "18px", fontWeight: "500" }}
                    >
                      {item.status}
                    </p>
                  </div>
                );
              })
            ) : (
              <Spinner />
            )}
          </div>
        </div>
      </div>
    </IsAuthenticate>
  );
};

export default DKDResult;
