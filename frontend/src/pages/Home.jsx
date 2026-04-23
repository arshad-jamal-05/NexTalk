import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Button, IconButton } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import { AuthContext } from "../contexts/AuthContext";

function HomeComponent() {
  let navigate = useNavigate();
  const { addToUserHistory } = useContext(AuthContext);

  const handleCreateMeeting = async () => {
    const roomId = Math.random().toString(36).substring(2, 10);
    await addToUserHistory(roomId);
    navigate(`/${roomId}`);
  };

  const handleJoinMeeting = () => {
    navigate("/join");
  };

  return (
    <>
      <div className="navBar">
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2>NexTalk</h2>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => navigate("/history")}>
            <RestoreIcon />
          </IconButton>
          <p>History</p>

          <Button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="meetContainer">
        <div className="leftPanel">
          <div>
            <h2>Providing Quality Video Call Just Like Quality Education</h2>

            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <Button
                onClick={handleCreateMeeting}
                variant="contained"
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              >
                Create Meeting
              </Button>

              <Button
                onClick={handleJoinMeeting}
                variant="outlined"
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              >
                Join Meeting
              </Button>
            </div>
          </div>
        </div>
        <div className="rightPanel">
          <img srcSet="/logo3.png" alt="" />
        </div>
      </div>
    </>
  );
}

export default withAuth(HomeComponent);
