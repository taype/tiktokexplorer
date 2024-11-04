const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { WebcastPushConnection } = require('tiktok-live-connector');

// 初始化 Express 应用
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: '*',  // 允许前端的请求地址
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true
    },
    transports: ['websocket']  // 强制只使用 WebSocket
  });

// 定义 TikTok 用户名

const giftValue = {
  "Gimme The Vote": 1.0,
  "Music Play": 1.0,
  "GG": 1.0,
  "Ice Cream Cone": 1.0,
  "Rose": 1.0,
  "TikTok": 1.0,
  "Finger Heart": 5.0,
  "Friendship Necklace": 10.0,
  "Rosa": 10.0,
  "Perfume": 20.0,
  "Doughnut": 30.0,
  "Heart Me": 1.0,
  "Community Celebration": 2999.0,
  "Community Fest": 1.0,
  "TikTok Universe": 44999.0,
  "Community Crown": 99.0,
  "TikTok Stars": 39999.0,
  "Leon and Lion": 34000.0,
  "Lion": 29999.0,
  "Dragon Flame": 26999.0,
  "Phoenix": 25999.0,
  "Adam’s Dream": 25999.0,
  "TikTok Shuttle": 20000.0,
  "Amusement Park": 17000.0,
  "Rosa Nebula": 15000.0,
  "Future Journey": 15000.0,
  "Party On&On": 15000.0,
  "To the Space": 15000.0,
  "Red Lightning": 12000.0,
  "Gimme The Mic": 12000.0,
  "Falcon": 10999.0,
  "Interstellar": 10000.0,
  "Sunset Speedway": 10000.0,
  "Leon and Lili": 9699.0,
  "Star Throne": 7999.0,
  "Sports Car": 7000.0,
  "Celebration Time": 6999.0,
  "Lili the Leopard": 6599.0,
  "Future City": 6000.0,
  "Work Hard Play Harder": 6000.0,
  "Hands up High": 6000.0,
  "Desert Wolf": 5500.0,
  "Let's Go Bro": 5500.0,
  "Unicorn Fantasy": 5000.0,
  "Flying Jets": 5000.0,
  "Diamond Gun": 5000.0,
  "Private Jet": 4888.0,
  "Leon the Kitten": 4888.0,
  "Your Concert": 4500.0,
  "Gift Box": 1999.0,
  "Meteor Shower": 3000.0,
  "Golden Party": 3000.0,
  "Rhythmic Bear": 2999.0,
  "Motorcycle": 2988.0,
  "Magic Stage": 2599.0,
  "Animal Band": 2500.0,
  "Whale Diving": 2150.0,
  "Star of Red Carpet": 1999.0,
  "Cooper Flies Home": 1999.0,
  "Mystery Firework": 1999.0,
  "Love Drop": 1800.0,
  "Chasing the Dream": 1500.0,
  "Lover’s Lock": 1500.0,
  "Greeting Card": 1500.0,
  "Future Encounter": 1500.0,
  "Under Control": 1500.0,
  "Love Explosion": 1500.0,
  "Cherry Blossoms": 1500.0,
  "Fireworks": 1088.0,
  "Diamond Tree": 1088.0,
  "Watermelon Love": 1000.0,
  "Blooming Ribbons": 1000.0,
  "Galaxy": 1000.0,
  "Glowing Jellyfish": 1000.0,
  "Travel with You": 999.0,
  "Lovely Music": 999.0,
  "Lucky Airdrop Box": 999.0,
  "Spring Picnic": 999.0,
  "Train": 899.0,
  "Sunset in Bali": 799.0,
  "Cute Cat": 799.0,
  "Swan": 699.0,
  "Money Gun": 500.0,
  "You’re Amazing": 500.0,
  "VR Goggles": 500.0,
  "DJ Glasses": 500.0,
  "Coral": 499.0,
  "Beating Heart": 449.0,
  "Singing Mic": 399.0,
  "Forever Rosa": 399.0,
  "Magic Rhythm": 399.0,
  "Relaxed Goose": 399.0,
  "Tom's Hug": 399.0,
  "Rosie the Rose Bean": 399.0,
  "Jollie the Joy Bean": 399.0,
  "Rocky the Rock Bean": 399.0,
  "Sage the Smart Bean": 399.0,
  "Diamond ring of love": 300.0,
  "Birthday Cake": 300.0,
  "Boxing Gloves": 299.0,
  "Corgi": 299.0,
  "Fruit Friends": 299.0,
  "Dancing Flower": 299.0,
  "Naughty Chicken": 299.0,
  "Play for You": 299.0,
  "Rock Star": 299.0,
  "Pinch Face": 249.0,
  "Diamond Heart necklace": 200.0,
  "Gold necklace": 200.0,
  "Sunglasses": 199.0,
  "Hearts": 199.0,
  "Lock and Key": 199.0,
  "Garland Headpiece": 199.0,
  "Love You": 199.0,
  "Pinch Cheek": 199.0,
  "Cheer For You": 199.0,
  "The Crown": 199.0,
  "Stinging Bee": 199.0,
  "Massage for You": 199.0,
  "Coffee Magic": 199.0,
  "Eye See You": 199.0,
  "Mishka Bear": 100.0,
  "Confetti": 100.0,
  "Hand Hearts": 100.0,
  "Chicken and Cola": 100.0,
  "Bouquet": 100.0,
  "Paper Crane": 99.0,
  "Little Crown": 99.0,
  "Cap": 99.0,
  "Hat and Mustache": 99.0,
  "Like-Pop": 99.0,
  "Cupid’s Bow": 99.0,
  "Love Painting": 99.0,
  "Bouquet Flower": 30.0,
  "I love you": 10.0,
  "Sweet Sheep": 10.0,
  "Hi Bear": 10.0,
  "Cow": 10.0,
  "Coffee": 1.0,
  "Orange Juice": 1.0,
  "Thumbs Up": 1.0,
  "Luxury Yacht": 7999.0,
  "Heart": 1.0,
  "Cake Slice": 1.0,
  "Tom's Love": 4999.0,
  "Magic Blast": 2999.0,
  "Glow Stick": 1.0,
  "Love you": 1.0,
  "For You": 3500.0,
  "Helmet": 299.0,
  "Don't forget to Eat": 5.0,
  "Frugal Friend": 1.0,
  "Fairy wings": 1.0,
  "Headphone": 1.0,
  "Blow a kiss": 1.0,
  "Power hug": 1.0,
  "Pegasus": 42999.0,
  "Fire Phoenix": 41999.0,
  "Thunder Falcon": 39999.0,
  "TikTok Universe+": 34999.0,
  "Premium Shuttle": 20000.0,
  "Fly Love": 19999.0,
  "Happy Party": 6999.0,
  "Signature Jet": 4888.0,
  "Here We Go": 1799.0,
  "Shiny air balloon": 1000.0,
  "Trending Figure": 999.0,
  "Gem Gun": 500.0,
  "Hands Up": 499.0,
  "Marvelous Confetti": 100.0,
  "Star": 99.0,
  "Cheer You Up": 9.0,
  "Team Bracelet": 2.0
}

const connections = {};

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    let tiktokLiveConnection = null;
    let totalGiftValue = 0;

    // 监听来自前端的 connectToTikTok 事件
    socket.on('connectToTikTok', (tiktokUsername) => {
      console.log(`Connecting to TikTok live stream of ${tiktokUsername} for socket: ${socket.id}`);

    // 如果已经有连接，断开之前的连接
    if (connections[socket.id]) {
      connections[socket.id].disconnect();
      delete connections[socket.id];  // 删除连接
      console.log(`Previous connection for socket ${socket.id} closed.`);
    }

    tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

    // 连接到 TikTok 直播间
    tiktokLiveConnection.connect().then(state => {
        console.info(`Connected to roomId ${state.roomId} for ${tiktokUsername}, socket: ${socket.id}`);

    connections[socket.id] = tiktokLiveConnection;

    // 处理实时消息 (chat)
    tiktokLiveConnection.on('chat', data => {
        console.log(`[${socket.id}]:${data.uniqueId}(userId:${data.userId}) writes: ${data.comment}`);
        
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
        console.log(`[${socket.id}]:${data.uniqueId} sent ${data.likeCount} likes, total likes: ${data.totalLikeCount}`);
        
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
        console.log(`[${socket.id}]:${data.uniqueId} (userId:${data.userId}) sends ${data.giftId} ${data.giftName} ${data.giftPictureUrl}`);

        const value = giftValue[data.giftName] || 0;
        totalGiftValue += value;

        
        // 通过 Socket.IO 将礼物数据发送给前端
        socket.emit('giftMessage', {
            userpic:data.profilePictureUrl,
            username: data.uniqueId,
            giftId: data.giftId,
            giftName:data.describe,
            giftPic:data.giftPictureUrl,
            giftValue: value,
            totalGiftValue: totalGiftValue,
            time: new Date().toLocaleString()
        });
    });

    }).catch(err => {
        console.error('Failed to connect to TikTok:', err);
        socket.emit('connectionError', `Failed to connect to ${tiktokUsername} &  ${socket.id}`);
    });

    // 处理连接错误
    tiktokLiveConnection.on('error', (err) => {
        console.error('Error from TikTok connection:', err);
        socket.emit('connectionError', `Connection error for ${tiktokUsername} & ${socket.id}`);
      });
    });

    socket.on('disconnectTikTok', () => {
      if (connections[socket.id]) {
        connections[socket.id].disconnect();  // 断开当前 TikTok 连接
        console.log(`TikTok live connection for socket ${socket.id} closed.`);
        delete connections[socket.id];  // 删除连接
      }
    });
    
    socket.on('disconnect', () => {
      console.log(`Client ${socket.id} disconnected`);
      if (connections[socket.id]) {
        connections[socket.id].disconnect();  // 断开 TikTok 连接
        console.log(`Live connection for socket ${socket.id} closed.`);
        delete connections[socket.id];  // 删除该连接
      }
    });
});

// 启动服务器
server.listen(3001, () => {
    console.log('Server is running on port 3001');
});
