import React, { useState, useEffect } from 'react';
import { Button, Input } from 'antd';
import { List, Avatar, Card } from 'antd';
import 'antd/dist/reset.css'; // 引入Ant Design样式
import './App.css'; // 引入自定义样式
import io from 'socket.io-client';

const socket = io('http://localhost:3001', {
  transports: ['websocket']  // 强制使用 WebSocket 传输
});

function App() {

  const [messages, setMessages] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);  // 控制按钮的加载状态
  const [username, setUsername] = useState('');  // 存储输入的用户名
  const [connected, setConnected] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);

  // Helper function to format date and time
  // const formatTime = (date) => {
  //   const year = date.getFullYear();
  //   const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要+1
  //   const day = date.getDate().toString().padStart(2, '0');
  //   const hours = date.getHours().toString().padStart(2, '0');
  //   const minutes = date.getMinutes().toString().padStart(2, '0');
  //   const seconds = date.getSeconds().toString().padStart(2, '0');
  //   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  // };

  // 接收实时数据
  useEffect(() => {

    socket.on('connect', () => {
      console.log('Socket.IO connected:', socket.id);
    });

    // 打印断开连接的日志
    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });

    // 监听 chat 消息
    socket.on('chatMessage', (message) => {
      const newMessage = {
        type: 'chat',
        ...message
      };
      console.log('Chat message received:', message); 
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setLoading(false);
      setConnected(true);
    });

    // 监听 like 消息
    socket.on('likeMessage', (likeData) => {
      const newLike = {
        type: 'like',
        ...likeData
      };
      console.log('Like message received:', likeData);
      setMessages((prevMessages) => [...prevMessages, newLike]);
      setLoading(false);
      setConnected(true);
    });

    // 监听 gift 消息
    socket.on('giftMessage', (giftData) => {
      console.log('gift message received:', giftData);
      setGifts((prevGifts) => [...prevGifts, giftData]);
      setLoading(false);
      setConnected(true);
    });

    // 清理事件监听器
    return () => {
      socket.off('chatMessage');
      socket.off('likeMessage');
      socket.off('giftMessage');
    };
  }, []);

  const handleConnect = () => {
    if (username.trim()) {
      // 使用 WebSocket 传输用户名
      console.log('Connecting to TikTok with username:', username);
      setLoading(true);
      socket.emit('connectToTikTok', username); // 将用户名发送到后端
    }
    setShowDisconnect(true);
  };

  // 处理断开连接
  const handleDisconnect = () => {
    socket.emit('disconnectTikTok');  // 向后端发送断开连接请求
    setConnected(false);  // 更新状态为未连接

    // 清空聊天和点赞记录
    setMessages([]);
    setGifts([]);
    setShowDisconnect(false);

    socket.off('chatMessage');
    socket.off('likeMessage');
    socket.off('giftMessage');
    
    setLoading(false);  // 允许重新连接
  };

  return (

    <div style={{ padding: '20px' }}>
      {/* 添加标题 */}
      <h1 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '20px' }}>Tiktok Live Explorer</h1>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Input 
          placeholder="Enter TikTok Live UserID"
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
          style={{ width: '300px', marginRight: '10px', display: 'inline-block' }} 
          disabled={connected || loading}
        />
         <Button 
          type={connected ? 'default' : 'primary'}  // Connect 按钮样式，根据连接状态变化
          onClick={handleConnect}
          loading={loading}
          disabled={connected || loading}
          style={{ marginRight: '20px', width: '100px' }} // 增加按钮间距
        >
          Connect
        </Button>
        {showDisconnect && (
        <Button
          type={connected ? 'primary' : 'default'}
          onClick={handleDisconnect}
          style={{ width: '100px' }}
        >
          Disconnect
        </Button>
      )}
      </div>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '20px' }}>
      {/* chat&like统计 */}
      <Card title="Chat&Like" style={{ width: '600px' }}>
        <List
          itemLayout="horizontal"
          dataSource={messages}
          renderItem={item => (
            <List.Item style={{ padding: '5px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <div style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>
                  {item.time}
                </div>
                <Avatar 
                  size={24} 
                  shape="square" 
                  src={item.userpic}
                  style={{ marginRight: '10px' }} 
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <strong style={{ marginRight: '10px' }}>{item.username}</strong>
                  {item.type === 'chat' ? (
                  <p style={{ margin: 0 }}>{item.comment}</p>
                  ) : (
                  <p style={{ margin: 0 }}>Sent {item.likeCount} likes (Total: {item.totalLikes})</p>
                )}
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>

      {/* gift统计 */}
      <Card title="Gift" style={{ width: '600px' }}> {/* 调整宽度以适应时间和内容 */}
        <List
          itemLayout="horizontal"
          dataSource={gifts}
          renderItem={item => (
            <List.Item style={{ padding: '5px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <div style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>
                  {item.time}
                </div>
                <Avatar 
                  size={24} 
                  shape="square" 
                  src={item.userpic} 
                  style={{ marginRight: '10px' }} 
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <strong style={{ marginRight: '10px' }}>{item.username}</strong>
                  <p style={{ margin: 0 }}>{item.giftId}</p>
                  <p style={{ margin: 0 }}>{item.giftName}</p>
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
