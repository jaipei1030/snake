import { GameState } from '../core/Enums.js';

/**
 * GameRenderer 類別 - 負責遊戲畫面的渲染
 */
export class GameRenderer {
  constructor(canvas, config) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.config = config;
    this.cellSize = config.renderSettings.cellSize;
    this.gridWidth = config.gridSize.width;
    this.gridHeight = config.gridSize.height;
    
    this.setupCanvas();
  }

  /**
   * 設定 Canvas
   */
  setupCanvas() {
    this.canvas.width = this.gridWidth * this.cellSize;
    this.canvas.height = this.gridHeight * this.cellSize;
    this.ctx.imageSmoothingEnabled = false;
  }

  /**
   * 渲染遊戲狀態
   * @param {Object} gameState - 遊戲狀態
   */
  render(gameState) {
    this.clear();
    this.drawGrid();
    this.drawSnake(gameState.snake);
    this.drawFood(gameState.food);
    this.drawUI(gameState);
    
    if (gameState.state === GameState.GAME_OVER) {
      this.drawGameOver(gameState.score, gameState.highScore);
    }
  }

  /**
   * 清除畫布
   */
  clear() {
    this.ctx.fillStyle = this.config.renderSettings.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 繪製網格
   */
  drawGrid() {
    if (!this.config.renderSettings.showGrid) {
      return;
    }

    this.ctx.strokeStyle = this.config.renderSettings.gridColor;
    this.ctx.lineWidth = 1;

    // 繪製垂直線
    for (let x = 0; x <= this.gridWidth; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * this.cellSize, 0);
      this.ctx.lineTo(x * this.cellSize, this.canvas.height);
      this.ctx.stroke();
    }

    // 繪製水平線
    for (let y = 0; y <= this.gridHeight; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * this.cellSize);
      this.ctx.lineTo(this.canvas.width, y * this.cellSize);
      this.ctx.stroke();
    }
  }

  /**
   * 繪製蛇
   * @param {Snake} snake - 蛇物件
   */
  drawSnake(snake) {
    if (!snake) return;

    // 繪製蛇頭
    this.drawCell(snake.head, this.config.renderSettings.snakeColor, true);

    // 繪製蛇身
    snake.body.forEach((segment, index) => {
      const alpha = 1 - (index / snake.body.length) * 0.5;
      this.drawCell(segment, this.config.renderSettings.snakeColor, false, alpha);
    });
  }

  /**
   * 繪製食物
   * @param {Food} food - 食物物件
   */
  drawFood(food) {
    if (!food) return;

    this.drawCell(food.position, this.config.renderSettings.foodColor, true);
  }

  /**
   * 繪製單個格子
   * @param {Position} position - 位置
   * @param {string} color - 顏色
   * @param {boolean} isHead - 是否為蛇頭
   * @param {number} alpha - 透明度
   */
  drawCell(position, color, isHead = false, alpha = 1) {
    const x = position.x * this.cellSize;
    const y = position.y * this.cellSize;
    const size = this.cellSize - 2; // 留出邊界

    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x + 1, y + 1, size, size);

    if (isHead) {
      // 為蛇頭添加高光效果
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      this.ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
    }

    this.ctx.restore();
  }

  /**
   * 繪製 UI 資訊
   * @param {Object} gameState - 遊戲狀態
   */
  drawUI(gameState) {
    const uiY = this.canvas.height + 20;
    
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'left';
    
    // 繪製分數
    this.ctx.fillText(`分數: ${gameState.score}`, 10, uiY);
    
    // 繪製最高分
    this.ctx.fillText(`最高分: ${gameState.highScore}`, 150, uiY);
    
    // 繪製等級
    this.ctx.fillText(`等級: ${gameState.level}`, 300, uiY);
    
    // 繪製遊戲狀態
    const stateText = this.getStateText(gameState.state);
    this.ctx.textAlign = 'right';
    this.ctx.fillText(stateText, this.canvas.width - 10, uiY);
  }

  /**
   * 獲取狀態文字
   * @param {GameState} state - 遊戲狀態
   * @returns {string} 狀態文字
   */
  getStateText(state) {
    const stateTexts = {
      [GameState.READY]: '準備開始',
      [GameState.RUNNING]: '遊戲中',
      [GameState.PAUSED]: '已暫停',
      [GameState.GAME_OVER]: '遊戲結束',
      [GameState.ERROR]: '錯誤'
    };
    return stateTexts[state] || '未知狀態';
  }

  /**
   * 繪製遊戲結束畫面
   * @param {number} score - 分數
   * @param {number} highScore - 最高分
   */
  drawGameOver(score, highScore) {
    // 繪製半透明覆蓋層
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 繪製遊戲結束文字
    this.ctx.fillStyle = '#ff0000';
    this.ctx.font = 'bold 32px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('遊戲結束', this.canvas.width / 2, this.canvas.height / 2 - 40);

    // 繪製分數
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`最終分數: ${score}`, this.canvas.width / 2, this.canvas.height / 2);

    // 繪製最高分
    if (score === highScore && score > 0) {
      this.ctx.fillStyle = '#ffff00';
      this.ctx.fillText('新紀錄！', this.canvas.width / 2, this.canvas.height / 2 + 30);
    } else {
      this.ctx.fillText(`最高分: ${highScore}`, this.canvas.width / 2, this.canvas.height / 2 + 30);
    }

    // 繪製重新開始提示
    this.ctx.fillStyle = '#cccccc';
    this.ctx.font = '16px Arial';
    this.ctx.fillText('按 R 鍵重新開始', this.canvas.width / 2, this.canvas.height / 2 + 60);

    this.ctx.restore();
  }

  /**
   * 更新渲染器
   */
  update() {
    // 可以在這裡添加動畫效果
  }

  /**
   * 設定 Canvas
   * @param {HTMLCanvasElement} canvas - Canvas 元素
   */
  setCanvas(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.setupCanvas();
  }

  /**
   * 設定網格大小
   * @param {GridSize} gridSize - 網格大小
   */
  setGridSize(gridSize) {
    this.gridWidth = gridSize.width;
    this.gridHeight = gridSize.height;
    this.setupCanvas();
  }
}
