const canvas = document.querySelector('#myCanvas') // 取得渲染畫布位置
const ctx = canvas.getContext('2d') // 宣告為2d渲染環境
const showScore = document.querySelector('.score-number')
const winText = document.querySelector('.win')
const loseText = document.querySelector('.lose')
let x = canvas.width / 2; // 球心，定義x座標於畫面中間位置
let y = canvas.height - 30; // 球心，定義y座標於畫面由下往上30位置
let dx = 5 * (Math.round(Math.random()) * 2 - 1); // 定義球要移動的X距離 * 1或-1
let dy = Math.ceil(Math.random() * -3) - 2; // 定義球要移動的Y距離
const ballRadius = 6 // 球的半徑
// 定義球拍
const paddleHeight = 6;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2; // 定義畫板初始位置
let rightPressed = false // 右按鍵判斷用
let leftPressed = false  // 左按鍵判斷用

let render = null

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

// 遊戲初始化
function initial() {
  x = canvas.width / 2
  y = canvas.height - 30
  dx = 5 * (Math.round(Math.random()) * 2 - 1)
  dy = Math.ceil(Math.random() * -3) - 2
  score = 0
  lives = 3
  bricks = [];
  for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
  drawBoundary()
  drawBall()
  drawPaddle()
  drawBricks()
  drawLives()
  loseText.style.display = "none"
  winText.style.display = "none"
}

function drawBoundary() {
  ctx.beginPath()
  ctx.moveTo(0, canvas.height - ballRadius)
  ctx.lineTo(canvas.width, canvas.height - ballRadius)
  ctx.strokeStyle = '#FF0000'
  ctx.stroke()
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

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function collisionDetection() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r]
      if (b.status == 1) {
        if (x > b.x - ballRadius && x < b.x + brickWidth + ballRadius && y > b.y + ballRadius && y < b.y + brickHeight + ballRadius) {
          dy = -dy;
          b.status = 0;
          score += 10;
          showScore.innerText = score
        }
      }
    }
  }
}

function detectionWin() {
  if (score === bricks.length * bricks[0].length * 10 && score !== 0) {
    winText.style.display = "block"
    return true
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  if (detectionWin()) {
    cancelAnimationFrame(render)
    render = null
    return
  }
  if (x + dx > canvas.width - ballRadius || x + dx < 0 + ballRadius) {
    dx = -dx;
  }
  if (y + dy < 0 + ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius * 2) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy
    } else {
      if (!lives) {
        clearInterval(interval)
        loseText.style.display = "block"
      }
      else {
        lives--
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 5 * (Math.round(Math.random()) * 2 - 1)
        dy = Math.ceil(Math.random() * -3) - 2
        paddleX = (canvas.width - paddleWidth) / 2
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7
  }
  else if (leftPressed && paddleX > 0) {
    paddleX -= 7
  }
  drawBoundary()
  drawLives()
  drawBricks()
  drawBall()
  drawPaddle()
  collisionDetection()
  x += dx
  y += dy

  render = requestAnimationFrame(draw)

}

function keyDownHandler(e) {
  if (e.key === "Enter") {
    if (!render) { // 由原本的interval 改為 render
      initial()
      draw() // 如果render是空的話，就執行畫圖渲染計算
    }
  }
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

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2
  }
}

initial()

document.addEventListener("keydown", function anyKeyDown(e) {
  keyDownHandler(e)
})

document.addEventListener("keyup", keyUpHandler)

document.addEventListener('mousemove', mouseMoveHandler)

