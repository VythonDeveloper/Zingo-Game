import React, { useContext, useState } from "react";
import { BottomNav, Header } from "../../components";
import "./refer.css";
import { ReferBanner } from "../../assets/svg/CustomSVG";
import { AppContext } from "../../context/AppContext";
import IsAuthenticate from "../../redirect/IsAuthenticate";
import Spinner from "../../components/spinner/Spinner";

const Refer = () => {
  const { user } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const shareLink = () => {
    setLoading(true);
    // Replace this URL with the link you want to share
    const linkToShare = `https://zingo.online/auth-refer?refercode=${user?.referCode}`;
    const message = `Ready to earn big while playing games? Join now with my referral code ${user?.referCode} and join the ranks of 1000+ players who are making over 500 Rs daily! Let's win together!`;

    // Use the Web Share API to share the link
    if (navigator.share) {
      navigator
        .share({
          title: "Share this link",
          text: message,
          url: linkToShare,
        })
        .then(() => console.log("Link shared successfully"))
        .catch((error) => console.error("Error sharing link:", error));
    }
    setLoading(false);
  };
  return (
    <IsAuthenticate path={"/refer"}>
      {loading && <Spinner />}
      <div className="container">
        <BottomNav />
        <Header title={"Refer"} path={"/home"} />

        <div style={{ marginTop: "50%" }}>
          <h1 className="text-center mt-4 refer-heading">
            Refer and Earn More
          </h1>
          <p className="refer-desc text-center">Refer code</p>
          <div className="refer-code">{user?.referCode}</div>
        </div>

        <div className="d-flex justify-content-center mt-5">
          <button
            className="w-75 mb-2 withdraw__btn refer-btn"
            style={{ height: 55 }}
            onClick={shareLink}
          >
            Refer
          </button>
        </div>
      </div>
    </IsAuthenticate>
  );
};

export default Refer;
