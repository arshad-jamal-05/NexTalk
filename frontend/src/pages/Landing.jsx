import React from "react";
// import '../App.css'
import { Link, useNavigate } from "react-router-dom";

function Landing() {
  const routeTo = useNavigate();

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  return (
    <div className="landingPageContainer">
      <nav>
        <div className="logo">
          <h1 className="text-3xl font-semibold">NexTalk</h1>
        </div>
        <div className="navlist">
          <p
            onClick={() => {
              const roomId = generateRoomId();
              routeTo(`/${roomId}`);
            }}
          >
            Join As Guest
          </p>
          <p
            onClick={() => {
              routeTo("/auth");
            }}
          >
            Register
          </p>
          <div role="button">
            <p
              onClick={() => {
                routeTo("/auth");
              }}
            >
              LogIn
            </p>
          </div>
        </div>
      </nav>

      <div className="landingMainContainer">
        <div>
          <h1>
            <span style={{ color: "blue" }}>Connect</span> with your loved ones
          </h1>
          <p>Cover a distance by NexTalk</p>
          <div role="button">
            <Link to={"/auth"}>Get Started</Link>
          </div>
        </div>
        <div>
          <img src="/mobile.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Landing;
