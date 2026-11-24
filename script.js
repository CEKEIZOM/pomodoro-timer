// HTML要素の取得
const statusBadge = document.getElementById('status-badge');
const statusLabel = document.getElementById('status-label');
const timerDisplay = document.getElementById('timer-display');
const workInput = document.getElementById('work-input');
const breakInput = document.getElementById('break-input');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');

// 状態管理用の変数
let timerId = null;                    // setIntervalのIDを保持
let isWorkMode = true;                 // trueなら作業時間、falseなら休憩時間
let timeLeft = workInput.value * 60;   // 残り時間（秒）

// 秒数を「MM:SS」形式の文字列に変換して画面に反映する関数
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  // 1桁の場合は先頭に0をつける（例: 5 -> 05）
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  timerDisplay.textContent = formattedTime;
}

// モード（作業 / 休憩）を切り替える関数
function switchMode() {
  isWorkMode = !isWorkMode;
  
  if (isWorkMode) {
    statusBadge.textContent = 'FOCUS TIME';
    statusLabel.textContent = '作業時間';
    timeLeft = workInput.value * 60;
    document.body.classList.remove('break-mode');
  } else {
    statusBadge.textContent = 'BREAK TIME';
    statusLabel.textContent = '休憩時間';
    timeLeft = breakInput.value * 60;
    document.body.classList.add('break-mode');
  }
  updateDisplay();
}

// スタートボタンの処理
startBtn.addEventListener('click', () => {
  // すでにタイマーが動いている場合は何もしない（二重起動防止）
  if (timerId !== null) return;

  timerId = setInterval(() => {
    timeLeft--;
    updateDisplay();

    // 0秒になったらモード切り替え
    if (timeLeft <= 0) {
      switchMode();
    }
  }, 1000);
});

// ストップボタンの処理
stopBtn.addEventListener('click', () => {
  clearInterval(timerId);
  timerId = null;
});

// リセットボタンの処理
resetBtn.addEventListener('click', () => {
  clearInterval(timerId);
  timerId = null;
  isWorkMode = true;
  statusBadge.textContent = 'FOCUS TIME';
  statusLabel.textContent = '作業時間';
  document.body.classList.remove('break-mode');
  timeLeft = workInput.value * 60;
  updateDisplay();
});

// 入力欄の数値が変更されたとき、タイマー停止中なら即座に表示に反映
workInput.addEventListener('change', () => {
  if (timerId === null && isWorkMode) {
    timeLeft = workInput.value * 60;
    updateDisplay();
  }
});

breakInput.addEventListener('change', () => {
  if (timerId === null && !isWorkMode) {
    timeLeft = breakInput.value * 60;
    updateDisplay();
  }
});

// 初期表示の実行
updateDisplay();