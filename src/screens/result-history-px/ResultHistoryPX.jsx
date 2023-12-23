import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { dbObject } from "../../helper/constant";
import IsAuthenticate from "../../redirect/IsAuthenticate";
import { Header } from "../../components";
import { useLocation } from "react-router-dom";
import Spinner from "../../components/spinner/Spinner";

const ResultHistoryPX = () => {
  const [resultHistory, setResultHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const getResultHistory = async () => {
    try {
      setLoading(true);
      const { data } = await dbObject.get("/power-x/result-history.php");

      if (!data.error) {
        setResultHistory(data.response);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getResultHistory();
  }, []);

  const location = useLocation();

  return (
    <IsAuthenticate path="/power-x/result-history">
      <div className="container" style={{ paddingTop: 55 }}>
        <Header title={"Power X Result"} path={location?.state?.from || "/power-x"} />

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

            {resultHistory.length ? (
              <tbody className="mt-3">
                {resultHistory.map((item, i) => (
                  <tr key={i} className="parity-myorder row">
                    <td className="col-5">{item.period}</td>
                    <td className="parity-selected col-2">
                      <p>{item.coin ? item.coin : "-"}</p>
                    </td>
                    <td className="col-2 text-center">
                      {item.color ? item.color : "-"}
                    </td>
                    <td className="col-2 text-right">
                      {item.alphabet ? item.alphabet : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <Spinner />
            )}
          </table>
        </div>
      </div>
    </IsAuthenticate>
  );
};

export default ResultHistoryPX;
