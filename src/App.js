import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import About from "./screens/about/About";
import Faq from "./screens/faq/Faq";
import DKDWithdraw from "./screens/withdraw/DKD/DKDWithdraw";
import DKDResult from "./screens/duskadum-result/DKDResult";
import ContactUs from "./screens/contact-us/ContactUs";
import Welcome from "./screens/welcome/Welcome";
import Home from "./screens/home/Home";
import FastParity from "./screens/games/FastParity";
import Parity from "./screens/games/Parity";
import FollowUs from "./screens/follow-us/FollowUs";
import ForgotPass from "./screens/auth/ForgotPass";
import ForwardPX from "./screens/forward/ForwardPX";
import ForwardDKD from "./screens/forward/DKD/ForwardDKD";
import Profile from "./screens/profile/Profile";
import Signin from "./screens/auth/Signin";
import Signup from "./screens/auth/Signup";
import Recharge from "./screens/recharge/Recharge";
import DKDRecharge from "./screens/recharge/DKDRecharge";
import Withdraw from "./screens/withdraw/Withdraw";
import Transfer from "./screens/transfer/Transfer";
import DKDTransfer from "./screens/transfer/DKD/DKDTransfer";
import AddBank from "./screens/bank/AddBank";
import RechargeHistory from "./screens/recharge-history/RechargeHistory";
import Refer from "./screens/refer/Refer";
import WithdrawHistory from "./screens/withdraw-history/WIthdrawHistory";
import DKDWithdrawHistory from "./screens/withdraw-history/DKDWithdrawHistory";
import ReferInput from "./screens/auth/Refer";
import TransferHistory from "./screens/transfer-historty/TransferHistory";
import ForwardHistory from "./screens/forward-history/ForwardHistory";
import ResultHistoryPx from "./screens/result-history-px/ResultHistoryPX";

function App() {
  return (
    <>
      <Suspense
        fallback={
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "90vh" }}
          >
            <div
              className="spinner-border text-warning"
              // style={{ width: "3rem", height: "3rem" }}
              role="status"
            >
              <span className="sr-only"></span>
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth-refer" element={<ReferInput />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/power-x" element={<FastParity />} />
          <Route path="/dus-ka-dum" element={<Parity />} />
          <Route path="/power-x/forward" element={<ForwardPX />} />
          <Route path="/dus-ka-dum/forward" element={<ForwardDKD />} />
          <Route path="/follow-us" element={<FollowUs />} />
          {/* <Route path="/transaction" element={<Transaction />} /> */}

          <Route path="/power-x/recharge" element={<Recharge />} />
          <Route path="/dus-ka-dum/recharge" element={<DKDRecharge />} />
          <Route path="/recharge-history" element={<RechargeHistory />} />
          <Route path="/dus-ka-dum/withdraw" element={<DKDWithdraw />} />
          <Route path="/dus-ka-dum/result" element={<DKDResult />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/dus-ka-dum/transfer" element={<DKDTransfer />} />
          <Route path="/bank" element={<AddBank />} />
          <Route path="/refer" element={<Refer />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/faq" element={<Faq />} />
          <Route
            path="/power-x/withdraw-history"
            element={<WithdrawHistory />}
          />
          <Route
            path="/dus-ka-dum/withdraw-history"
            element={<DKDWithdrawHistory />}
          />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/transfer-history" element={<TransferHistory />} />
          <Route path="/forward-history" element={<ForwardHistory />} />
          <Route path="/power-x/result-history" element={<ResultHistoryPx />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
