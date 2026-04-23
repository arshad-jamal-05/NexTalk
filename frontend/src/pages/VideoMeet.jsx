import React, { useEffect, useRef, useState } from "react";
import "../style/VideoMeet.css";
// import styles from "../style/VideoMeet.module.css";
import { TextField, Button, Badge, IconButton } from "@mui/material";
import { VideocamOff, Videocam, CallEnd, MicOff, Mic, ScreenShare, StopScreenShare, Chat, SpeakerNotesOff, Send } from "@mui/icons-material";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const server_url = "http://localhost:8000";

var connections = {};

const peerConfigConnections = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

export default function VideoMeet() {
  var socketRef = useRef();
  let socketIdRef = useRef();
  let localVideoRef = useRef();
  let [videoAvailable, setVideoAvailable] = useState(true);
  let [audioAvailable, setAudioAvailable] = useState(true);
  let [video, setVideo] = useState([]);
  let [audio, setAudio] = useState();
  let [screen, setScreen] = useState();
  let [showModal, setModal] = useState(false);
  let [screenAvailable, setScreenAvailable] = useState();
  let [messages, setMessages] = useState([]);
  let [message, setMessage] = useState("");
  let [newMessages, setNewMessages] = useState(0);
  let [askForUsername, setAskForUsername] = useState(true);
  let [username, setUsername] = useState("");
  const videoRef = useRef([]);
  let [videos, setVideos] = useState([]);
  let routeTo = useNavigate();

  useEffect(() => {
    getPermissions();
  }, []);

  let getDisplayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDisplayMediaSuccess)
          .then((stream) => {})
          .catch((e) => console.log(e));
      }
    }
  };

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoPermission) {
        setVideoAvailable(true);
        console.log("Video permission granted");
      } else {
        setVideoAvailable(false);
        console.log("Video permission denied");
      }

      const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (audioPermission) {
        setAudioAvailable(true);
        console.log("Audio permission granted");
      } else {
        setAudioAvailable(false);
        console.log("Audio permission denied");
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
      console.log("SET STATE HAS ", video, audio);
    }
  }, [audio, video]);

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  let getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        console.log(description);
        connections[id]
          .setLocalDescription(description)
          .then(() => socketRef.current.emit("signal", id, JSON.stringify({ sdp: connections[id].localDescription })))
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach((track) =>
      (track.onended = () => {
        setVideo(false);
        setAudio(false);

        try {
          let tracks = localVideoRef.current.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
        } catch (e) {
          console.log(e);
        }

        let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
        window.localStream = blackSilence();
        localVideoRef.current.srcObject = window.localStream;

        for (let id in connections) {
          connections[id].addStream(window.localStream);

          connections[id].createOffer().then((description) => {
            connections[id]
              .setLocalDescription(description)
              .then(() => socketRef.current.emit("signal", id, JSON.stringify({ sdp: connections[id].localDescription })))
              .catch((e) => console.log(e));
          });
        }
      }),
    );
  };

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .then((stream) => {})
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
      } catch (error) {
        console.log(error);
      }

      let blackSilenceStream = new MediaStream([black(), silence()]);
      window.localStream = blackSilenceStream;
      localVideoRef.current.srcObject = blackSilenceStream;

      for (let id in connections) {
        connections[id].addStream(blackSilenceStream);

        connections[id].createOffer().then((description) => {
          connections[id].setLocalDescription(description).then(() => {
            socketRef.current.emit("signal", id, JSON.stringify({ sdp: connections[id].localDescription }));
          });
        });
      }
    }
  };

  let getDisplayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);
      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => socketRef.current.emit("signal", id, JSON.stringify({ sdp: connections[id].localDescription })))
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach((track) =>
      (track.onended = () => {
        setScreen(false);

        try {
          let tracks = localVideoRef.current.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
        } catch (e) {
          console.log(e);
        }

        let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
        window.localStream = blackSilence();
        localVideoRef.current.srcObject = window.localStream;

        getUserMedia();
      }),
    );
  };

  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => socketRef.current.emit("signal", fromId, JSON.stringify({ sdp: connections[fromId].localDescription })))
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }
      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href);

      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });

      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
          
          connections[socketListId].onicecandidate = function (event) {
            if (event.candidate != null) {
              socketRef.current.emit("signal", socketListId, JSON.stringify({ ice: event.candidate }));
            }
          };

          // Wait for their video stream
          connections[socketListId].onaddstream = (event) => {
            console.log("BEFORE:", videoRef.current);
            console.log("FINDING ID: ", socketListId);

            let videoExists = videoRef.current.find(
              (video) => video.socketId === socketListId,
            );

            if (videoExists) {
              console.log("FOUND EXISTING");

              // Update the stream of the existing video
              setVideos((videos) => {
                const updatedVideos = videos.map((video) => video.socketId === socketListId ? { ...video, stream: event.stream } : video);
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              // Create a new video
              console.log("CREATING NEW");
              let newVideo = { socketId: socketListId, stream: event.stream, autoPlay: true, playsinline: true };

              setVideos((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };

          // Add the local video stream
          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {
              console.log(e);
            }

            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => socketRef.current.emit("signal", id2, JSON.stringify({ sdp: connections[id2].localDescription })))
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });
  };

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());

    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), { width, height });

    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();

    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  let handleVideo = () => {
    setVideo((prev) => {
      const newState = !prev;

      const videoTrack = window.localStream?.getTracks().find((track) => track.kind === "video");

      if (videoTrack) {
        videoTrack.enabled = newState; // true = on, false = off
      }

      return newState;
    });
  };

  let handleAudio = () => {
    setAudio(!audio);
    console.log(audio);
  };

  useEffect(() => {
    if (screen !== undefined) {
      getDisplayMedia();
    }
  }, [screen]);

  let handleScreen = () => {
    setScreen(!screen);
  };

  let handleEndCall = () => {
    try {
      let tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    routeTo("/");
  };

  let openChat = () => {
    setModal(true);
    setNewMessages(0);
  };

  let closeChat = () => {
    setModal(false);
  };

  let handleMessage = (e) => {
    setMessage(e.target.value);
  };

  let addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [ ...prevMessages, { sender: sender, data: data } ]);

    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };

  let sendMessage = () => {
    console.log(socketRef.current);
    socketRef.current.emit("chat-message", message, username);
    setMessage("");
  };

  let connect = () => {
    setAskForUsername(false);
    getMedia();
  };

  return (
    <div>
      {askForUsername === true ? (
        <div style={{position:"relative", padding:"50px", display:"flex", justifyContent:"center", alignItems:"center", gap:"40px", minHeight:"100vh", overflow:"hidden"}}>
          <div>
            <video style={{ width: "400px", borderRadius: "20px" }} ref={localVideoRef} autoPlay muted></video>
          </div>
          
          <div style={{background:"rgb(255,255,255)", borderRadius:"10px", padding:"40px 30px", color:"rgb(33,33,33)", textAlign:"center"}}>
            <h1 style={{fontSize:"28px", marginBottom:"10px"}}>Ready to connect</h1>
            <p style={{fontSize:"16px",marginBottom:"20px"}}>So let's go to the chatroom</p>
            <br />
            <TextField id="outlined-basic" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} variant="outlined" />
            <Button variant="contained" onClick={connect} style={{margin:"0px 15px", padding:"13px 25px", border:"none",borderRadius:"8px",fontSize:"16px"}}>Connect</Button>
          </div>
        </div>
      ) : (
        <div className="meetVideoContainer">
          {showModal ? (
            <div className="chatRoom">
              <div className="chatContainer">
                <div className="chatHead">
                  <h1>Chat</h1>
                  <Button onClick={closeChat} variant="outlined" color="error">Close</Button>
                </div>
                <hr />

                <div className="chattingDisplay">
                  {messages.length !== 0 ? (
                    messages.map((item, index) => {
                      console.log(messages);
                      return (
                        <div style={{ marginBottom: "15px" }} className="message" key={index}>
                          <div className="senderDetail" style={{ height: "30px", width: "auto", padding: "0.75rem", backgroundColor: "brown", color: "white", borderRadius: "7px", margin: "auto 12px auto 0px", display: "flex", alignItems: "center", justifyContent: "center" }}>{item.sender[0].toUpperCase()}</div>
                          <div className="messageInfo">
                            <p style={{ fontWeight: "bold", textTransform: "capitalize" }}>{item.sender}</p>
                            <p style={{ fontStyle: "italic", opacity: "0.7" }}>{item.data}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p style={{ marginTop: "25vh", marginLeft: "8vw", fontSize: "1rem" }}>No Messages Yet</p>
                  )}
                </div>

                <div className="chattingArea">
                  <TextField value={message} onChange={(e) => setMessage(e.target.value)} size="small" id="outlined-basic" label="Enter Your Message" variant="outlined" />
                  <Button onClick={sendMessage} variant="contained" endIcon={<Send />}>Send</Button>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          <div className="buttonContainer">
            <IconButton onClick={handleVideo} style={{ color: "white" }}>
              {video === true ? <Videocam /> : <VideocamOff />}
            </IconButton>
            <IconButton onClick={handleAudio} style={{ color: "white" }}>
              {audio === true ? <Mic /> : <MicOff />}
            </IconButton>
            {screenAvailable === true ? (
              <IconButton onClick={handleScreen} style={{ color: "white" }}>
                {screen === true ? <StopScreenShare /> : <ScreenShare />}
              </IconButton>
            ) : (
              <></>
            )}
            <Badge badgeContent={newMessages} max={999} color="secondary">
              <IconButton onClick={() => setModal(!showModal)} style={{ color: "white" }}>
                {showModal ? <SpeakerNotesOff /> : <Chat />}
              </IconButton>
            </Badge>
            <IconButton onClick={handleEndCall} style={{ color: "red" }}>
              <CallEnd />
            </IconButton>
          </div>

          <div
            // className="meetUserVideo"
            style={{ position: "absolute", height: "20vh", width: "auto", bottom: "10vh", left: "1.1rem", borderRadius: "15px" }}
          >
            <video className="meetUserVideo" ref={localVideoRef} autoPlay muted style={{ width: "100%", height: "100%", background: "black", objectFit: "cover", borderRadius: "15px" }}></video>

            {!video && (
              <div className="videoOverlay" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "black", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "60px", fontWeight: "bold", borderRadius: "15px" }}>
                {username?.[0]?.toUpperCase()}
              </div>
            )}
          </div>

          {/* REMOTE VIDEOS */}
          <div style={{ display: "flex", paddingTop: "20px" }}>
            {videos.map(
              (videoObj) => (
                // console.log(videoObj),
                // console.log(videos),
                // console.log(typeof videos, typeof videoObj),
                (
                  <video key={videoObj.socketId}
                    ref={(ref) => {
                      if (ref && videoObj.stream) {
                        ref.srcObject = videoObj.stream;
                      }
                    }}
                    autoPlay style={{ height: "30vh", width: "auto", borderRadius: "20px", marginRight: "10px", marginLeft: "1.1rem", backgroundColor: "black" }}
                  />
                )
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
