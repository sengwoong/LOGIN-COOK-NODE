const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// session 암호화를 위한 secret key 생성
const secret = crypto.randomBytes(64).toString("hex");

// express-session 설정
app.use(
  session({
    secret: secret, // 암호화를 위한 secret key 설정
    resave: false,
    saveUninitialized: true,
  })
);

// HTML 파일 제공
app.get("/htmllogin", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

// 로그인 처리 라우터
app.post("/login", (req, res) => {
  const { id, password } = req.body;

  // id, password 검증 처리

  // 인증 성공 시 세션에 값을 저장
  req.session.authenticated = { authenticated: true };
  req.session.userId = { userId: id };

  res.send("로그인 성공");
});

// 인증 검사 미들웨어
const authChecker = (req, res, next) => {
  if (!req.session.authenticated.authenticated) {
    return res.status(401).send("인증되지 않은 사용자입니다.");
  }

  // 인증된 사용자의 경우 다음 미들웨어로 넘어감
  next();
};

// 인증이 필요한 라우터
app.get("/profile", authChecker, (req, res) => {
  // 인증된 사용자의 경우 세션 값에서 userId 불러옴
  const userId = req.session.userId.userId;

  // userId를 이용한 로직 처리

  res.send(`userId: ${userId}의 프로필 페이지`);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});
