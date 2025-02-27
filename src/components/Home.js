// Home.js
import React, { useState } from "react";
import { handleGoogleLogin } from "../components/Sign"; // 로그인 기능 import
import { useNavigate } from "react-router-dom"; // useNavigate import
import "../styles/Home.css"; 

function Home() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate(); // navigate hook 사용

  // 로그인 후 Monthly 페이지로 이동
  const handleLogin = () => {
    handleGoogleLogin(setUserData, navigate); // navigate를 handleGoogleLogin에 전달
  };

  return (
    <div className="home-container">
      <img src="/assets/poc.web_logo-05.png" alt="PoG_logo" className="logo" />
      <img src="/assets/description.png" alt="PoG_description" className="description" />
      <button className="signup-button" >
        <img src="/assets/google_signup_btn.png" alt="signin-btn" onClick={!userData ? handleLogin : null}/>
      </button>
    </div>
  );
}

export default Home;
