const canvas = document.querySelector('#myCanvas') // 取得渲染畫布位置
const ctx = canvas.getContext('2d') // 宣告為2d渲染環境
let x = canvas.width / 2; // 球心，定義x座標於畫面中間位置
let y = canvas.height - 30; // 球心，定義y座標於畫面由下往上30位置
let dx = 2; // 定義球要移動的X距離
let dy = -2; // 定義球要移動的Y距離
const ballRadius = 10 // 球的半徑
// 定義球拍
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2; // 定義畫板初始位置
let rightPressed = false // 右按鍵判斷用
let leftPressed = false  // 左按鍵判斷用

// 定義磚塊資料
let brickRowCount = 3
let brickColumnCount = 5
const brickWidth = 75
const brickHeight = 20
const brickPadding = 10
const brickOffsetTop = 30
const brickOffsetLeft = 30
// 建立磚塊陣列資料結構，使用雙層陣列來宣告。
let bricks = [];
for (c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

function drawBall() {
  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = "#0095DD"
  ctx.fill()
  ctx.closePath()
}

function drawPaddle() {
  ctx.beginPath()
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD"
  ctx.fill()
  ctx.closePath()
}

function drawBricks() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        // 宣告依C及R，來定義每次畫磚的起始點
        let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft
        let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop
        // 將x及y的值宣告為新的x,y值
        bricks[c][r].x = brickX
        bricks[c][r].y = brickY
        // 開始畫磚
        ctx.beginPath()
        // 起始點位置要帶入新宣告的位置
        ctx.rect(brickX, brickY, brickWidth, brickHeight)
        ctx.fillStyle = "#0095DD"
        ctx.fill()
        ctx.closePath()
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  if (x + dx > canvas.width - ballRadius || x + dx < 0 + ballRadius) {
    dx = -dx;
  }

  if (y + dy < 0 + ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy
    } else {
      alert('Game Over')
      document.location.reload()
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7
  }
  else if (leftPressed && paddleX > 0) {
    paddleX -= 7
  }
  drawBricks()
  drawBall()
  drawPaddle()
  collisionDetection()
  x += dx
  y += dy
}

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true
  }
  else if (e.keyCode == 37) {
    leftPressed = true
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false
  }
  else if (e.keyCode == 37) {
    leftPressed = false
  }
}

function collisionDetection() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r]
      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
        }
      }
    }
  }
}


document.addEventListener("keydown", keyDownHandler)
document.addEventListener("keyup", keyUpHandler)

const interval = setInterval(draw, 10);