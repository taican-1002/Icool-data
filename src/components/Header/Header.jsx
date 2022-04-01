import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "./header.scss";
import logo from "../../assets/img/logo.png";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import baseReq from "../../api/baseReq";

import { useNavigate } from "react-router-dom";

const Header = () => {
  const headerRef = useRef(null);
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  const loading = document.getElementsByClassName("loading");
  const loadingOverlay = document.getElementsByClassName("loading-overlay");

  window.onload = () => {
    loading[0].classList.add("block");
    loadingOverlay[0].classList.add("block");
  };
  setTimeout(() => {
    loading[0].classList.remove("block");
    loadingOverlay[0].classList.remove("block");
  }, 1100);

  const CheckedLogin = async () => {
    await baseReq
      .post("user")
      .then((response) => {
        // console.log(response);
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    navigate("/");
    window.location.reload(true);
    setTimeout(() => {
      window.location.reload(false);
    }, 10);
  };
  // console.log(user);
  useEffect(() => {
    const shrinkHeader = () => {
      if (
        document.body.scrollTop > 100 ||
        document.documentElement.scrollTop > 100
      ) {
        headerRef.current.classList.add("shrink");
      } else {
        headerRef.current.classList.remove("shrink");
      }
    };
    window.addEventListener("scroll", shrinkHeader);

    CheckedLogin();
    return () => {
      window.removeEventListener("scroll", shrinkHeader);
    };
  }, []);
  return (
    <div className="header " ref={headerRef}>
      <div className="header__wrap container-fluid">
        <Link to="/">
          <img src={logo} alt="" className="header__logo" />
        </Link>

        <div>
          {user != "" ? (
            <div className="header__user">
              <div className="header__user-name">
                <PersonOutlineIcon style={{ color: "#fff" }} />
                <div className="header__user-username">{user.name}</div>
                <button onClick={handleLogout} className="header__user-btn">
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : undefined}
        </div>
      </div>
    </div>
  );
};

export default Header;
