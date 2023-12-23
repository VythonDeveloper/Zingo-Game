import React, { useEffect, useState } from "react";
import { dbObject } from "../../helper/constant";
import Header from "../../components/header/Header";

const About = () => {
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    try {
        setLoading(true)
      const { data } = await dbObject.get("/documents/about-us.php");
      if (!data.error) {
        setAbout(data.response.content);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false)
  };

  useEffect(() => {
    fetchData();
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
      <Header title={"About Us"} path={"/profile"} />
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: about }}
      ></div>
    </div>
  );
  }
};

export default About;
