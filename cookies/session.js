const express = require("express");
const session = require("express-session");
const crypto = require("crypto");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "my-secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/session", (req, res) => {
  res.sendFile(__dirname + "/session.html");
});

// 사용자 입력값에 salt를 적용하여 해시한 후, 세션에 저장합니다.
app.post("/setsession", (req, res) => {
  const input = req.body.input;
  console.log(input);

  // salt 생성
  const salt = crypto.randomBytes(8).toString("hex");

  // 입력값에 salt 적용하여 해시 생성
  const hash = crypto
    .pbkdf2Sync(input, salt, 10000, 64, "sha512")
    .toString("hex");

  // 세션에 저장
  req.session.NAMESession = { hash: hash };

  res.redirect("/getsession");
});

// 저장된 세션에서 hash와 salt 값을 추출하여 입력한 값과 비교합니다.
app.get("/getsession", (req, res) => {
  const userSession = req.session.NAMESession; // 수정된 부분
  if (!userSession) {
    res.send("Session not found");
    return;
  }
  const hash = userSession.hash;
  const sessionJSON = JSON.stringify({ hash: hash });
  const encodedSession = encodeURIComponent(sessionJSON);

  res.send(encodedSession);
});

app.listen("3000", () => {
  console.log("Server is running on port 3000");
});
