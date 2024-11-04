// App.js
import React, { useState, useEffect } from 'react';
import { List, Avatar, Badge, Card } from 'antd';
import 'antd/dist/reset.css'; // 引入Ant Design样式

const App = () => {
  // 状态存储聊天信息和点赞数据
  const [chats, setChats] = useState([]);
  const [likes, setLikes] = useState({});

  // 模拟接收实时数据
  useEffect(() => {
    // 模拟每2秒接收一条聊天消息
    const chatInterval = setInterval(() => {
      setChats(prev => [
        ...prev, 
        { id: Date.now(), username: 'User' + (prev.length + 1), message: 'Hello, everyone!' }
      ]);
    }, 2000);

    // 模拟每1秒接收点赞数据
    const likeInterval = setInterval(() => {
      const userId = 'User1'; // 假设User1点赞
      setLikes(prev => ({
        ...prev, 
        [userId]: (prev[userId] || 0) + 1
      }));
    }, 1000);

    // 清理定时器
    return () => {
      clearInterval(chatInterval);
      clearInterval(likeInterval);
    };
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {/* 聊天列表 */}
      <Card title="Live Chat" style={{ marginBottom: '20px' }}>
        <List
          itemLayout="horizontal"
          dataSource={chats}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar>{item.username.charAt(0)}</Avatar>}
                title={item.username}
                description={item.message}
              />
            </List.Item>
          )}
        />
      </Card>

      {/* 点赞统计 */}
      <Card title="Likes Count">
        <List
          itemLayout="horizontal"
          dataSource={Object.entries(likes)}
          renderItem={([username, likeCount]) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar>{username.charAt(0)}</Avatar>}
                title={username}
                description={`Likes: ${likeCount}`}
              />
              <Badge count={likeCount} style={{ backgroundColor: '#52c41a' }} />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default App;
