import { useState } from "react";
import "./App.css";
import Landing from "./pages/Landing";
import Authentication from "./pages/Authentication";
import VideoMeet from "./pages/VideoMeet";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import History from "./pages/History";
import Home from "./pages/Home";
import Join from "./pages/Join";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path="/home" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/join" element={<Join />} />
            <Route path="/:url" element={<VideoMeet />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
