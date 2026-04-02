import { useState } from "react";
import "./App.css";
import Landing from "./pages/Landing";
import Authentication from "./pages/Authentication";
import VideoMeet from "./pages/VideoMeet";
import AuthCard from "./pages/AuthCard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import History from "./pages/History";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Authentication />} />
            {/* <Route path="/login" element={<AuthCard />} /> */}
            <Route path="/history" element={<History />} />
            <Route path="/:url" element={<VideoMeet />} />
            <Route path="/home" s element={<Home />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
