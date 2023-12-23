import React, { useState } from "react";
import { Header } from "../../components";
import { useLocation } from "react-router-dom";
import { dbObject } from "../../helper/constant";
import { toast } from "react-toastify";
import Toaster, { toastOptions } from "../../components/toaster/Toaster";
import Spinner from "../../components/spinner/Spinner";

const ContactUs = () => {
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    if (name.length > 1 && email.length > 1 && message.length > 1) {
      try {
        const inputs = {
          name,
          email,
          message,
        };

        console.log(inputs);

        const formData = new FormData();
        for (const key in inputs) {
          formData.append(key, inputs[key]);
        }
        const config = {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type to form data
          },
        };

        const { data } = await dbObject.post(
          "/contact-master/request.php",
          formData,
          config
        );

        if (!data.error) {
          toast.success("Message sent to admin", toastOptions);
          setName("");
          setEmail("");
          setMessage("");
        } else {
          toast.error(data.message, toastOptions);
        }
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("All inputs required", toastOptions);
    }

    setLoading(false)
  };
  return (
    <div className="container" style={{ paddingTop: 55 }}>
      {
        loading && <Spinner />
      }
      <Toaster />
      <Header title={"Contact Us"} path={location?.state?.from || "/profile"} />
      <form onSubmit={handleSubmit} action="" className="contact-form mt-5">
        <div className="mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="John Doe"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="name@example.com"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="exampleFormControlTextarea1" className="form-label">
            Message
          </label>
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            name="message"
            placeholder="Write message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>

        <div className="d-flex justify-content-center">
          <button className="btn btn-warning w-100">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default ContactUs;
