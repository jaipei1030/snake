import { Game } from './Game.js';
import { GameConfig } from './utils/GameConfig.js';
import { GridSize } from './core/GridSize.js';
import { GameState, GameEvent } from './core/Enums.js';

/**
 * 遊戲初始化函數
 */
function initializeGame() {
  // 獲取 Canvas 元素
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) {
    console.error('找不到遊戲 Canvas 元素');
    return;
  }

  // 建立遊戲配置
  const config = new GameConfig({
    gridSize: new GridSize(20, 20),
    initialSpeed: 200,
    speedIncrement: 20,
    minSpeed: 50,
    foodValue: 10,
    keyBindings: {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
      pause: 'Space',
      restart: 'r'
    },
    renderSettings: {
      snakeColor: '#00ff00',
      foodColor: '#ff0000',
      gridColor: '#333333',
      backgroundColor: '#000000',
      cellSize: 20,
      showGrid: true
    }
  });

  // 建立遊戲實例
  const game = new Game(canvas, config);
  
  // 初始化遊戲
  game.initialize();

  // 設定 UI 事件監聽器
  setupUIEventListeners(game);

  // 設定遊戲事件監聽器
  setupGameEventListeners(game);

  // 將遊戲實例儲存到全域變數（用於除錯）
  window.game = game;

  console.log('貪吃蛇遊戲已初始化');
  return game;
}

/**
 * 設定 UI 事件監聽器
 * @param {Game} game - 遊戲實例
 */
function setupUIEventListeners(game) {
  // 開始按鈕
  const startBtn = document.getElementById('startBtn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      game.start();
      updateButtonStates(game);
    });
  }

  // 暫停按鈕
  const pauseBtn = document.getElementById('pauseBtn');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      game.togglePause();
      updateButtonStates(game);
    });
  }

  // 重新開始按鈕
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      game.restart();
      updateButtonStates(game);
    });
  }
}

/**
 * 設定遊戲事件監聽器
 * @param {Game} game - 遊戲實例
 */
function setupGameEventListeners(game) {
  // 分數更新
  game.gameEngine.on(GameEvent.SCORE_UPDATE, (data) => {
    updateScore(data.newScore);
  });

  // 等級更新
  game.gameEngine.on(GameEvent.LEVEL_UP, (data) => {
    updateLevel(data.level);
    updateSpeed(data.speed);
  });

  // 遊戲狀態變更
  game.gameEngine.on(GameEvent.GAME_START, () => {
    updateButtonStates(game);
    hideGameOverlay();
  });

  game.gameEngine.on(GameEvent.GAME_PAUSE, () => {
    updateButtonStates(game);
    showGameOverlay('遊戲暫停', '按空白鍵繼續');
  });

  game.gameEngine.on(GameEvent.GAME_RESUME, () => {
    updateButtonStates(game);
    hideGameOverlay();
  });

  game.gameEngine.on(GameEvent.GAME_OVER, (data) => {
    updateButtonStates(game);
    showGameOverlay('遊戲結束', `最終分數: ${data.score}`);
    updateHighScore(data.highScore);
  });

  game.gameEngine.on(GameEvent.GAME_RESET, () => {
    updateButtonStates(game);
    hideGameOverlay();
    resetUI();
  });

  // 蛇移動事件（更新統計資訊）
  game.gameEngine.on(GameEvent.SNAKE_MOVE, () => {
    updateSnakeLength(game.getStats().snakeLength);
  });
}

/**
 * 更新按鈕狀態
 * @param {Game} game - 遊戲實例
 */
function updateButtonStates(game) {
  const state = game.getState();
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');

  if (startBtn) {
    startBtn.disabled = state.state === GameState.RUNNING || state.state === GameState.PAUSED;
    startBtn.textContent = state.state === GameState.READY ? '開始遊戲' : '遊戲中';
  }

  if (pauseBtn) {
    pauseBtn.disabled = state.state === GameState.READY || state.state === GameState.GAME_OVER;
    pauseBtn.textContent = state.state === GameState.PAUSED ? '繼續' : '暫停';
  }

  if (resetBtn) {
    resetBtn.disabled = state.state === GameState.READY;
  }
}

/**
 * 更新分數顯示
 * @param {number} score - 分數
 */
function updateScore(score) {
  const scoreElement = document.getElementById('score');
  if (scoreElement) {
    scoreElement.textContent = score;
  }
}

/**
 * 更新最高分顯示
 * @param {number} highScore - 最高分
 */
function updateHighScore(highScore) {
  const highScoreElement = document.getElementById('highScore');
  if (highScoreElement) {
    highScoreElement.textContent = highScore;
  }
}

/**
 * 更新等級顯示
 * @param {number} level - 等級
 */
function updateLevel(level) {
  const levelElement = document.getElementById('level');
  if (levelElement) {
    levelElement.textContent = level;
  }
}

/**
 * 更新遊戲速度顯示
 * @param {number} speed - 速度
 */
function updateSpeed(speed) {
  const speedElement = document.getElementById('gameSpeed');
  if (speedElement) {
    speedElement.textContent = `${speed}ms`;
  }
}

/**
 * 更新蛇長度顯示
 * @param {number} length - 蛇長度
 */
function updateSnakeLength(length) {
  const lengthElement = document.getElementById('snakeLength');
  if (lengthElement) {
    lengthElement.textContent = length;
  }
}

/**
 * 顯示遊戲覆蓋層
 * @param {string} title - 標題
 * @param {string} message - 訊息
 */
function showGameOverlay(title, message) {
  const overlay = document.getElementById('gameOverlay');
  const titleElement = document.getElementById('overlayTitle');
  const messageElement = document.getElementById('overlayMessage');

  if (overlay && titleElement && messageElement) {
    titleElement.textContent = title;
    messageElement.textContent = message;
    overlay.classList.remove('hidden');
  }
}

/**
 * 隱藏遊戲覆蓋層
 */
function hideGameOverlay() {
  const overlay = document.getElementById('gameOverlay');
  if (overlay) {
    overlay.classList.add('hidden');
  }
}

/**
 * 重置 UI
 */
function resetUI() {
  updateScore(0);
  updateLevel(1);
  updateSpeed(200);
  updateSnakeLength(1);
}

/**
 * 頁面載入完成後初始化遊戲
 */
document.addEventListener('DOMContentLoaded', () => {
  try {
    initializeGame();
  } catch (error) {
    console.error('遊戲初始化失敗:', error);
    alert('遊戲初始化失敗，請重新整理頁面');
  }
});

// 防止頁面滾動（避免方向鍵滾動頁面）
document.addEventListener('keydown', (event) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.key)) {
    event.preventDefault();
  }
});

// 導出遊戲實例（用於測試）
export { initializeGame };
