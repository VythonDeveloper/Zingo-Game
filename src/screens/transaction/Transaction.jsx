import React from "react";
import { Header } from "../../components";
import "./transaction.css";
import { rocket } from "../../assets";
import IsAuthenticate from "../../redirect/IsAuthenticate";

const Transaction = () => {
  return (
    <IsAuthenticate path={'/transaction'}>
    <div className="container">
      <Header title={"Transactions"} path="/profile" />
      <div className="mt-3">
        <Card />
        <Card />
        <Card />
      </div>
    </div>
    </IsAuthenticate>
  );
};

const Card = () => {
  return (
    <div className="transaction-history-card">
      <div className="info">
        <img src={rocket} width={50} alt="" />
        <div>
          <p className="m-0">Fast Parity</p>
          <p className="m-0">20230115820</p>
        </div>
      </div>

      <div style={{ color: "#3bd146" }}>
        <p className="amount m-0">+' 20.00</p>
      </div>
    </div>
  );
};

export default Transaction;
