import React from "react";
import "./home.css";
import BottomNav from "../../components/bottomNav/BottomNav";
import { daskadum, powerx } from "../../assets";
import { useNavigate } from "react-router-dom";
import IsAuthenticate from "../../redirect/IsAuthenticate";

const Home = () => {
  const navigate = useNavigate();

  return (
    <IsAuthenticate path={'/home'}>
      <BottomNav />
      <div className="container background-custom" style={{paddingTop: 55}}>
        {/* <div className="background-custom"></div> */}
        <div style={{position: 'relative', zIndex: '999'}}>
          <h1 style={{ fontSize: "1.5rem" }}>All Games</h1>

          <div className="games">
            <div onClick={() => navigate("/power-x")} className="game">
              <img src={powerx} alt="power x" />
            </div>

            <div onClick={() => navigate("/dus-ka-dum")} className="game">
              <img src={daskadum} alt="das ka dum" />
            </div>
          </div>
        </div>
      </div>
    </IsAuthenticate>
  );
};

export default Home;
