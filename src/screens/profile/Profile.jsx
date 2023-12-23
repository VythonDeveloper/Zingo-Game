import React, { useContext, useState } from "react";
import "./profile.css";
import BottomNav from "../../components/bottomNav/BottomNav";
import { useNavigate } from "react-router-dom";
import { ConfirmModal, Header } from "../../components";
import { AppContext } from "../../context/AppContext";
import { dbObject } from "../../helper/constant";
import { toast } from "react-toastify";
import { toastOptions } from '../../components/toaster/Toaster'
import IsAuthenticate from "../../redirect/IsAuthenticate";
import { profile } from "../../assets";
import { FollowUS, HistorySvg, RightArrow, Signout, Transaction } from "../../assets/svg/CustomSVG";
import {auth} from '../../firebase.config'
import Spinner from "../../components/spinner/Spinner";

const Profile = () => {
  const [showModal, setShowModal] = useState(false);
  const { user, setUser } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const logout = async () => {
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append('userId', user?.id);

      const { data } = await dbObject.post('/users/logout.php', formData)
      await auth.signOut()
      if (!data.error) {
        toast.success(data?.message, toastOptions)

        setTimeout(() => {
          setUser(null)
          navigate("/signin");
          setLoading(false)
        }, 1000);
      } else {
        toast.error(data?.message, toastOptions)
        setLoading(false)
      }

    } catch (error) {
      console.log(error);
      toast.error('Internal server error', toastOptions)
      setLoading(false)
    }
  };

  const data = [

    {
      title: 'Contact Us',
      path: '/Contact-us',
      icon: <Transaction />
    },

    {
      title: 'Follow us',
      path: '/follow-us',
      icon: <FollowUS />
    },

    {
      title: 'About Us',
      path: '/about-us',
      icon: <i className="bi bi-info-circle"></i>
    },

    {
      title: 'Faq',
      path: '/faq',
      icon: <i className="bi bi-question-circle"></i>
    },

  ]

  return (
    <IsAuthenticate path={'/profile'}>
      {loading && <Spinner />}
      {showModal && (
        <ConfirmModal
          confirmFunc={logout}
          setFunc={setShowModal}
          text1={"Are you sure you want to logout?"}
          text2="Do you really want to logout?"
        />
      )}

      <div className="container" style={{marginTop: 55}}>
        <BottomNav />

        <Header title={"Profile"} />

        {/* User details */}
        <div className="user__details__section">
          <div className="user__pic">
            <img
              src={profile}
              height="100%"
              alt="profile"
              loading='lazy'
            />
          </div>
          <div className="user__details__section__right">
            <div className="user__details__section__right__col">
              <b>ID: {user?.referCode}</b>
            </div>
            <div className="user__details__section__right__col">
              {user?.email}
            </div>
          </div>
        </div>

        {
          data.map((item, i) => (
            <Card item={item} key={i} />
          ))
        }

        {/* Sign out */}
        <div className="profile__records__section">
          <div
            className="profile__records__section__col"
            onClick={() => setShowModal(true)}
          >
            <div className="profile__records__section__col__left">
              <div className="profile__record__section__col__icon">
                <Signout />
              </div>
              <div className="profile__record__section__col__name">Sign Out</div>
            </div>

          </div>
        </div>
        <div className="toastContainer top-center"></div>
      </div>
    </IsAuthenticate>
  );
};


const Card = ({ item }) => {
  const navigate = useNavigate()
  return (
    <div className="profile__records__section">
      {/* Follow us */}
      <div
        className="profile__records__section__col"
        onClick={() => navigate(item?.path)}
      >
        <div className="profile__records__section__col__left user-select-none">
          <div className="profile__record__section__col__icon">
            {item?.icon}
          </div>
          <div className="profile__record__section__col__name">{item?.title}</div>
        </div>
        <div className="profile__records__section__col__right">
          <RightArrow />
        </div>
      </div>
    </div>
  )
}

export default Profile;
