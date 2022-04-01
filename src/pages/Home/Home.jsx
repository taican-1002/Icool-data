import React, { useState } from "react";
import "./home.scss";

import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import baseReq from "../../api/baseReq";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  let navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    var data = new FormData();
    data.append("email", email);
    data.append("password", password);
    baseReq
      .post("login", data)
      .then(function (response) {
        console.log(response);
        window.localStorage.setItem("token", response.data.token);
        window.localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/detail");
        window.location.reload(true);
        setTimeout(() => {
          window.scrollTo(0, 0);
          window.location.reload(false);
        }, 10);
        // console.log(response.data);
      })
      .catch(function (error) {
        if (!email || !password) {
          toast.warning(error.response.data.message);
        } else {
          toast.error("Incorrect account or password!!");
        }
        setError(error.response.data);
      });
  };
  return (
    <div className="home container">
      <div className="home__form">
        <h1 className="home__title">ĐĂNG NHẬP</h1>
        <div className="loading-overlay">
          <div className="spinner-border loading" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <form id="form" onSubmit={handleLogin}>
          <TextField
            id="outlined-basic"
            className="home__input-user"
            label="Tài khoản"
            variant="outlined"
            type="email"
            placeholder="nhatbd"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Mật khẩu"
            className="home__input-password"
            variant="outlined"
            type="password"
            placeholder="*****************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Nhớ mật khẩu"
            className="home__input-checkbox"
          />
          <Button variant="contained" className="home-btn" type="submit">
            Đăng nhập
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Home;
