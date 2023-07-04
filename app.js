const express = require('express');
const { Server } = require('http'); // 1. 모듈 불러오기
const socketIo = require('socket.io'); // 1. 모듈 불러오기

const cookieParser = require('cookie-parser');
const goodsRouter = require('./routes/goods.js');
const usersRouter = require('./routes/users.js');
const authRouter = require('./routes/auth.js');
const connect = require('./schemas');

const app = express();
const http = Server(app); // 2. express app을 http 서버로 감싸기
const io = socketIo(http); // 3. http 객체를 Socket.io 모듈에 넘겨서 소켓 핸들러 생성
const port = 3000;

connect(); // mongoose를 연결합니다.

// Socket이 접속했을 때, 해당하는 콜백 함수가 실행된다.
io.on('connection', (sock) => {
  console.log('새로운 소켓이 연결됐어요!'); // Socket 사용자가 접속합니다.

  // Socket 사용자가 접속하였을 때, 바로 BUY_GOODS Socket 이벤트를 진행합니다.
  sock.emit('BUY_GOODS', {
    nickname: '서버가 보내준 구매자 닉네임',
    goodsId: 10, // 서버가 보내준 상품 데이터 고유 ID
    goodsName: '서버가 보내준 구매자가 구매한 상품 이름',
    date: '서버가 보내준 구매 일시',
  });

  // 현재 접속한 Socket 클라이언트가 종료되었을 때, 실행됩니다.
  sock.on('disconnect', () => {
    console.log(sock.id, '연결이 끊어졌어요!');
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('assets'));
app.use('/api', [goodsRouter, usersRouter, authRouter]);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 5. app 대신 http 객체로 서버 열기
http.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
