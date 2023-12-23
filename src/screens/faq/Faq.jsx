import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import { dbObject } from "../../helper/constant";

const Faq = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await dbObject("documents/faq.php");
      setLoading(false);
      if (!data.error) return setList(data.response);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
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
        <div className="spinner-border text-warning" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container" style={{ paddingTop: 55 }}>
        <Header title={"Faq"} path={"/profile"} />

        <div>
          <div class="accordion mt-4" id="accordionExample">
            {list.map((item, i) => (
              <div class="accordion-item" key={i}>
                <h2 class="accordion-header" id={"heading" + i}>
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={"#collapse" + i}
                    aria-expanded="true"
                    aria-controls={"collapse" + i}
                  >
                    {item.title}
                  </button>
                </h2>
                <div
                  id={"collapse" + i}
                  class="accordion-collapse collapse show"
                  aria-labelledby={"heading" + i}
                  data-bs-parent="#accordionExample"
                >
                  <div class="accordion-body">{item.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

export default Faq;
