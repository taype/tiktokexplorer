import React, { useState, useEffect } from "react";
import { Button, Input, List, Avatar, Card } from "antd";
import "antd/dist/reset.css";
import "./App.css";
import io from "socket.io-client";

const socket = io("http://34.69.85.229:3001", {
  transports: ["websocket"],
});

function App() {
  const [messages, setMessages] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [totalGiftValue, setTotalGiftValue] = useState(0);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket.IO connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO disconnected");
    });

    socket.on("chatMessage", (message) => {
      const newMessage = { type: "chat", ...message };
      console.log("Chat message received:", message);
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
      setLoading(false);
      setConnected(true);
    });

    socket.on("likeMessage", (likeData) => {
      const newLike = { type: "like", ...likeData };
      console.log("Like message received:", likeData);
      setMessages((prevMessages) => [newLike, ...prevMessages]);
      setLoading(false);
      setConnected(true);
    });

    socket.on("giftMessage", (giftData) => {
      console.log("gift message received:", giftData);
      setGifts((prevGifts) => [giftData, ...prevGifts]);
      setTotalGiftValue((prevValue) => prevValue + (giftData.giftValue || 0));
      setLoading(false);
      setConnected(true);
    });

    return () => {
      socket.off("chatMessage");
      socket.off("likeMessage");
      socket.off("giftMessage");
    };
  }, []);

  const handleConnect = () => {
    if (username.trim() && !connected) {
      console.log("Connecting to TikTok with username:", username);
      setLoading(true);
      socket.emit("connectToTikTok", username);
      setShowDisconnect(true);

      const id = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      setIntervalId(id);
    }
  };

  const handleDisconnect = () => {
    socket.emit("disconnectTikTok");
    setConnected(false);
    setMessages([]);
    setGifts([]);
    setShowDisconnect(false);
    setLoading(false);
    clearInterval(intervalId);
    setIntervalId(null);
    setTimer(0);
    setTotalGiftValue(0);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${hours}:${mins}:${secs}`;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", fontSize: "36px", marginBottom: "20px" }}>
        Tiktok Live Explorer
      </h1>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Input
          placeholder="Enter TikTok Live UserID"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "300px",
            marginRight: "10px",
            display: "inline-block",
          }}
          disabled={connected || loading}
        />
        <Button
          type={connected ? "default" : "primary"}
          onClick={handleConnect}
          loading={loading}
          disabled={connected || loading}
          style={{ marginRight: "20px", width: "100px" }}
        >
          Connect
        </Button>
        {showDisconnect && (
          <Button
            type={connected ? "primary" : "default"}
            onClick={handleDisconnect}
            style={{ width: "100px" }}
          >
            Disconnect
          </Button>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "200px" }}>
        {connected && (
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <span style={{ color: "blue", fontWeight: "bold" }}>
              Connected Time: {formatTime(timer)}
            </span>
          </div>
        )}
        {connected && (
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <span style={{ color: "red", fontWeight: "bold" }}>
              Gift Total Value: {totalGiftValue.toFixed(2)}
            </span>
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: "20px" }}>
        <Card title="Chat&Like" style={{ width: "600px" }}>
          <List
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={(item) => (
              <List.Item style={{ padding: "5px 0" }}>
                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                  <div style={{ marginRight: "10px", whiteSpace: "nowrap" }}>{item.time}</div>
                  <Avatar size={24} shape="square" src={item.userpic} style={{ marginRight: "10px" }} />
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <strong style={{ marginRight: "10px" }}>{item.username}</strong>
                    {item.type === "chat" ? (
                      <p style={{ margin: 0 }}>{item.comment}</p>
                    ) : (
                      <p style={{ margin: 0, color: "red", fontWeight: "bold" }}>
                        Sent {item.likeCount} likes (Total: {item.totalLikes})
                      </p>
                    )}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Card>

        <Card title="Gift" style={{ width: "600px" }}>
          <List
            itemLayout="horizontal"
            dataSource={gifts}
            renderItem={(item) => (
              <List.Item style={{ padding: "5px 0" }}>
                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                  <div style={{ marginRight: "10px", whiteSpace: "nowrap" }}>{item.time}</div>
                  <Avatar size={24} shape="square" src={item.userpic} style={{ marginRight: "10px" }} />
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <strong style={{ marginRight: "10px" }}>{item.username}</strong>
                    <p style={{ margin: 0 }}>{item.giftName}</p>
                    <p style={{ margin: 0 }}>({item.giftId})</p>
                    <p style={{ margin: 0 }}>({item.giftValue})</p>
                    <Avatar size={24} shape="square" src={item.giftPic} style={{ marginRight: "10px" }} />
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
}

export default App;
