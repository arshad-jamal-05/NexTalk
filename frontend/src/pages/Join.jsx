import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";

export default function Join() {
  const [roomId, setRoomId] = useState("");
  const routeTo = useNavigate();

  const handleJoin = () => {
    if (!roomId.trim()) return;
    routeTo(`/${roomId.trim()}`);
  };

  return (
    <div
      style={{
        position: "relative",
        padding: "50px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "40px",
        minHeight: "100vh",
        overflow: "hidden",
        backgroundColor: "#fff",
        flexWrap: "wrap",
      }}
    >
      <div style={{ textAlign: "center", color: "rgb(33,33,33)" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "10px", fontWeight: 600 }}>
          Join a Meeting
        </h1>
        <p style={{ fontSize: "16px", marginBottom: "28px", color: "#666" }}>
          Enter the room ID to get started
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <TextField
              label="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              variant="outlined"
              autoFocus
            />
            <Button
              variant="contained"
              onClick={handleJoin}
              disabled={!roomId.trim()}
              style={{
                padding: "13px 25px",
                borderRadius: "8px",
                fontSize: "16px",
                backgroundColor: "#1976d2",
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              Join
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
