import { Snake } from './Snake.js';
import { Food } from './Food.js';
import { Position } from './Position.js';
import { GridSize } from './GridSize.js';
import { EventSystem } from './EventSystem.js';
import { GameState, GameEvent, CollisionType, Direction } from './Enums.js';

/**
 * GameEngine 類別 - 遊戲的核心引擎
 */
export class GameEngine extends EventSystem {
  constructor(config) {
    super();
    this.config = config;
    this.score = 0;
    this.highScore = this.loadHighScore();
    this.level = 1;
    this.speed = config.initialSpeed;
    this.state = GameState.READY;
    this.snake = null;
    this.food = null;
    this.gameLoop = null;
    this.lastMoveTime = 0;
    this.foodEatenCount = 0;
  }

  /**
   * 開始遊戲
   */
  start() {
    if (this.state !== GameState.READY && this.state !== GameState.GAME_OVER) {
      return;
    }

    this.initializeGame();
    this.state = GameState.RUNNING;
    this.lastMoveTime = 0; // 使用 0 讓第一次更新立即執行
    this.startGameLoop();
    this.emit(GameEvent.GAME_START, { score: this.score });
  }

  /**
   * 暫停遊戲
   */
  pause() {
    if (this.state !== GameState.RUNNING) {
      return;
    }

    this.state = GameState.PAUSED;
    this.stopGameLoop();
    this.emit(GameEvent.GAME_PAUSE);
  }

  /**
   * 恢復遊戲
   */
  resume() {
    if (this.state !== GameState.PAUSED) {
      return;
    }

    this.state = GameState.RUNNING;
    this.lastMoveTime = 0; // 重置為 0
    this.startGameLoop();
    this.emit(GameEvent.GAME_RESUME);
  }

  /**
   * 重置遊戲
   */
  reset() {
    this.state = GameState.READY;
    this.score = 0;
    this.level = 1;
    this.speed = this.config.initialSpeed;
    this.foodEatenCount = 0;
    this.stopGameLoop();
    this.emit(GameEvent.GAME_RESET);
  }

  /**
   * 停止遊戲
   */
  stop() {
    this.state = GameState.READY;
    this.stopGameLoop();
  }

  /**
   * 改變蛇的方向
   * @param {Direction} direction - 新方向
   */
  changeDirection(direction) {
    if (this.snake && this.state === GameState.RUNNING) {
      this.snake.changeDirection(direction);
    }
  }

  /**
   * 初始化遊戲
   */
  initializeGame() {
    const centerPosition = this.config.gridSize.getCenterPosition();
    this.snake = new Snake(centerPosition, this.config.gridSize);
    this.food = new Food(new Position(0, 0), this.config.foodValue);
    this.generateNewFood();
  }

  /**
   * 開始遊戲循環
   */
  startGameLoop() {
    if (this.gameLoop) {
      return;
    }
    
    const gameLoop = (currentTime) => {
      if (this.state !== GameState.RUNNING) {
        return;
      }

      if (currentTime - this.lastMoveTime >= this.speed) {
        this.update();
        this.lastMoveTime = currentTime;
      }

      this.gameLoop = requestAnimationFrame(gameLoop);
    };

    this.gameLoop = requestAnimationFrame(gameLoop);
  }

  /**
   * 停止遊戲循環
   */
  stopGameLoop() {
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
      this.gameLoop = null;
    }
  }

  /**
   * 更新遊戲狀態
   */
  update() {
    this.snake.move();
    this.emit(GameEvent.SNAKE_MOVE, { position: this.snake.head });

    // 檢查碰撞
    const collision = this.snake.checkCollision(this.config.gridSize);
    if (collision !== CollisionType.NONE) {
      this.handleCollision(collision);
      return;
    }

    // 檢查是否吃到食物
    if (this.food.isEatenBy(this.snake)) {
      this.eatFood();
    }
  }

  /**
   * 處理碰撞
   * @param {CollisionType} collision - 碰撞類型
   */
  handleCollision(collision) {
    if (collision === CollisionType.SELF || collision === CollisionType.WALL) {
      this.gameOver();
    }
  }

  /**
   * 吃食物
   */
  eatFood() {
    this.snake.grow();
    this.score += this.food.value;
    this.foodEatenCount++;
    this.updateLevel();
    this.generateNewFood();
    
    this.emit(GameEvent.FOOD_EATEN, {
      position: this.food.position,
      value: this.food.value,
      newScore: this.score
    });
  }

  /**
   * 生成新食物
   */
  generateNewFood() {
    this.food.generateNewPosition(this.snake, this.config.gridSize);
  }

  /**
   * 更新等級
   */
  updateLevel() {
    const newLevel = Math.floor(this.foodEatenCount / 5) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      this.speed = Math.max(
        this.config.minSpeed,
        this.config.initialSpeed - (this.level - 1) * this.config.speedIncrement
      );
      this.emit(GameEvent.LEVEL_UP, { level: this.level, speed: this.speed });
    }
  }

  /**
   * 遊戲結束
   */
  gameOver() {
    this.state = GameState.GAME_OVER;
    this.stopGameLoop();

    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveHighScore();
    }

    this.emit(GameEvent.GAME_OVER, {
      score: this.score,
      highScore: this.highScore
    });
  }

  /**
   * 載入最高分數
   * @returns {number} 最高分數
   */
  loadHighScore() {
    try {
      return parseInt(localStorage.getItem('snakeGameHighScore') || '0');
    } catch (error) {
      console.warn('無法載入最高分數:', error);
      return 0;
    }
  }

  /**
   * 儲存最高分數
   */
  saveHighScore() {
    try {
      localStorage.setItem('snakeGameHighScore', this.highScore.toString());
    } catch (error) {
      console.warn('無法儲存最高分數:', error);
    }
  }

  // Getters
  getState() { return this.state; }
  getScore() { return this.score; }
  getHighScore() { return this.highScore; }
  getLevel() { return this.level; }
  getSpeed() { return this.speed; }
  getSnake() { return this.snake; }
  getFood() { return this.food; }
}
