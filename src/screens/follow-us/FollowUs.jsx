import React, { useEffect, useState } from "react";
import "./followus.css";
import Header from "../../components/header/Header";
import { dbObject } from "../../helper/constant";

const FollowUs = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await dbObject("/documents/follow-us.php");
      if (!data.error) {
        setLoading(false);
        return setData(data?.response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "90vh" }}
      >
        <div
          className="spinner-border text-warning"
          role="status"
        >
          <span className="sr-only"></span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container" style={{ paddingTop: 55 }}>
        <Header title="Follow Us" path="/profile" />

        <div className="follow-cards">
          {data?.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="blank"
              className="follow-card"
            >
              <div>
                <i className="bi bi-telegram"></i>
              </div>
              <h2 className="mb-0">{item.channel}</h2>
            </a>
          ))}
        </div>
      </div>
    );
  }
};

export default FollowUs;
