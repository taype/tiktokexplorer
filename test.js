const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { WebcastPushConnection } = require('tiktok-live-connector');

// 初始化 Express 应用
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',  // 允许前端的请求地址
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true
    },
    transports: ['websocket']  // 强制只使用 WebSocket
  });




io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // 定义 TikTok 用户名
    let tiktokLiveConnection = null;

    // 监听来自前端的 connectToTikTok 事件
    socket.on('connectToTikTok', (tiktokUsername) => {
      console.log(`Connecting to TikTok live stream of ${tiktokUsername}`);

    // 如果已经有连接，断开之前的连接
    if (tiktokLiveConnection) {
      tiktokLiveConnection.disconnect();
      console.log('Previous connection closed.');
    }

    tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

    // 连接到 TikTok 直播间
    tiktokLiveConnection.connect().then(state => {
        console.info(`Connected to roomId ${state.roomId} for ${tiktokUsername}`);

    // 处理实时消息 (chat)
    tiktokLiveConnection.on('chat', data => {
        console.log(`${data.uniqueId}(userId:${data.userId}) writes: ${data.comment}`);
        
        // 通过 Socket.IO 将消息发送给前端
        socket.emit('chatMessage', {
            userpic:data.profilePictureUrl,
            username: data.uniqueId,
            comment: data.comment,
            time: new Date().toLocaleString()
        });
    });

    // 处理点赞 (like)
    tiktokLiveConnection.on('like', data => {
        console.log(`${data.uniqueId} sent ${data.likeCount} likes, total likes: ${data.totalLikeCount}`);
        
        // 通过 Socket.IO 将点赞数据发送给前端
        socket.emit('likeMessage', {
            userpic:data.profilePictureUrl,
            username: data.uniqueId,
            likeCount: data.likeCount,
            totalLikes: data.totalLikeCount,
            time: new Date().toLocaleString()
        });
    });

    // 处理礼物 (gift)
    tiktokLiveConnection.on('gift', data => {
        console.log(`${data.uniqueId} (userId:${data.userId}) sends ${data.giftId}`);
        
        // 通过 Socket.IO 将礼物数据发送给前端
        socket.emit('giftMessage', {
            userpic:data.profilePictureUrl,
            username: data.uniqueId,
            //giftId: data.giftId,
            giftName:data.describe,
            time: new Date().toLocaleString()
        });
    });

    }).catch(err => {
        console.error('Failed to connect to TikTok:', err);
        socket.emit('connectionError', `Failed to connect to ${tiktokUsername}`);
    });

    // 处理连接错误
    tiktokLiveConnection.on('error', (err) => {
        console.error('Error from TikTok connection:', err);
        socket.emit('connectionError', `Connection error for ${tiktokUsername}`);
      });
    });

    socket.on('disconnectTikTok', () => {
        if (tiktokLiveConnection) {
          tiktokLiveConnection.disconnect();  // 断开当前 TikTok 连接
          console.log('TikTok live connection closed.');
        }
    });
    
    socket.on('disconnect', () => {
        console.log(`Client ${socket.id} disconnected`);
        if (tiktokLiveConnection) {
          tiktokLiveConnection.disconnect();
          console.log('Live connection closed.');
        }
    });
});

// 启动服务器
server.listen(3001, () => {
    console.log('Server is running on port 3001');
});
