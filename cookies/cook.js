const express = require("express");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/cook.html", (req, res) => {
  res.sendFile(__dirname + "/cook.html");
});

// 사용자 입력값에 salt를 적용하여 해시한 후, 쿠키에 저장합니다.
app.post("/set", (req, res) => {
  const input = req.body.input;
  console.log(input);

  // salt 생성
  const salt = crypto.randomBytes(8).toString("hex");

  // 입력값에 salt 적용하여 해시 생성
  const hash = crypto
    .pbkdf2Sync(input, salt, 10000, 64, "sha512")
    .toString("hex");

  // 쿠키 생성
  res.cookie("user", { hash: hash });

  res.redirect("/get");
});

// 저장된 쿠키에서 hash와 salt 값을 추출하여 입력한 값과 비교합니다.
app.get("/get", (req, res) => {
  const userCookie = req.cookies.user;
  if (!userCookie) {
    res.send("Cookie not found");
    return;
  }
  const hash = userCookie.hash; // hash 값 추출
  const cookieJSON = JSON.stringify({ hash: hash }); // JSON 형식으로 변환
  const encodedCookie = encodeURIComponent(cookieJSON); // URL 인코딩

  res.send(encodedCookie);
});

app.listen("3000", () => {
  console.log("Server is running on port 3000");
});
