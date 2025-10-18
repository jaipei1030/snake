import { GameEngine } from './core/GameEngine.js';
import { GameRenderer } from './render/GameRenderer.js';
import { InputHandler } from './input/InputHandler.js';
import { GameConfig } from './utils/GameConfig.js';
import { GameEvent, GameState, Direction } from './core/Enums.js';

/**
 * Game 類別 - 主遊戲類別，整合所有組件
 */
export class Game {
  constructor(canvas, config = null) {
    this.canvas = canvas;
    this.config = config || GameConfig.getDefault();
    this.gameEngine = null;
    this.renderer = null;
    this.inputHandler = null;
    this.isInitialized = false;
    this.lastRenderTime = 0;
    this.renderLoop = null;
  }

  /**
   * 初始化遊戲
   */
  initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      // 初始化遊戲引擎
      this.gameEngine = new GameEngine(this.config);

      // 初始化渲染器
      this.renderer = new GameRenderer(this.canvas, this.config);

      // 初始化輸入處理器
      this.inputHandler = new InputHandler();
      this.inputHandler.setKeyBindings(this.config.keyBindings);

      // 設定事件監聽
      this.setupEventListeners();

      // 開始輸入監聽
      this.inputHandler.startListening();

      this.isInitialized = true;
      console.log('遊戲初始化完成');
    } catch (error) {
      console.error('遊戲初始化失敗:', error);
      throw error;
    }
  }

  /**
   * 設定事件監聽器
   */
  setupEventListeners() {
    // 遊戲引擎事件
    this.gameEngine.on(GameEvent.GAME_START, () => {
      this.startRenderLoop();
    });

    this.gameEngine.on(GameEvent.GAME_PAUSE, () => {
      this.stopRenderLoop();
    });

    this.gameEngine.on(GameEvent.GAME_RESUME, () => {
      this.startRenderLoop();
    });

    this.gameEngine.on(GameEvent.GAME_OVER, () => {
      this.stopRenderLoop();
    });

    this.gameEngine.on(GameEvent.GAME_RESET, () => {
      this.stopRenderLoop();
    });

    // 輸入處理器事件
    this.inputHandler.on('direction', (direction) => {
      this.gameEngine.changeDirection(direction);
    });

    this.inputHandler.on('gameControl', (action) => {
      this.handleGameControl(action);
    });
  }

  /**
   * 處理遊戲控制輸入
   * @param {string} action - 動作
   */
  handleGameControl(action) {
    switch (action) {
      case 'pause':
        this.togglePause();
        break;
      case 'restart':
        this.restart();
        break;
      default:
        console.warn('未知的遊戲控制動作:', action);
    }
  }

  /**
   * 開始遊戲
   */
  start() {
    if (!this.isInitialized) {
      this.initialize();
    }
    this.gameEngine.start();
  }

  /**
   * 暫停/恢復遊戲
   */
  togglePause() {
    const state = this.gameEngine.getState();
    if (state === GameState.RUNNING) {
      this.gameEngine.pause();
    } else if (state === GameState.PAUSED) {
      this.gameEngine.resume();
    }
  }

  /**
   * 重新開始遊戲
   */
  restart() {
    this.gameEngine.reset();
    this.gameEngine.start();
  }

  /**
   * 停止遊戲
   */
  stop() {
    this.gameEngine.stop();
    this.stopRenderLoop();
  }

  /**
   * 開始渲染循環
   */
  startRenderLoop() {
    if (this.renderLoop) {
      return;
    }

    const render = (currentTime) => {
      if (this.gameEngine.getState() !== GameState.RUNNING) {
        return;
      }

      // 限制渲染頻率到 60 FPS
      if (currentTime - this.lastRenderTime >= 16) {
        this.render();
        this.lastRenderTime = currentTime;
      }

      this.renderLoop = requestAnimationFrame(render);
    };

    this.renderLoop = requestAnimationFrame(render);
  }

  /**
   * 停止渲染循環
   */
  stopRenderLoop() {
    if (this.renderLoop) {
      cancelAnimationFrame(this.renderLoop);
      this.renderLoop = null;
    }
  }

  /**
   * 渲染遊戲
   */
  render() {
    if (!this.renderer || !this.gameEngine) {
      return;
    }

    const gameState = {
      snake: this.gameEngine.getSnake(),
      food: this.gameEngine.getFood(),
      score: this.gameEngine.getScore(),
      highScore: this.gameEngine.getHighScore(),
      level: this.gameEngine.getLevel(),
      state: this.gameEngine.getState()
    };

    this.renderer.render(gameState);
  }

  /**
   * 更新遊戲配置
   * @param {GameConfig} config - 新配置
   */
  updateConfig(config) {
    this.config = config;
    if (this.gameEngine) {
      // 重新初始化組件
      this.gameEngine = new GameEngine(config);
      this.renderer = new GameRenderer(this.canvas, config);
      this.inputHandler.setKeyBindings(config.keyBindings);
      this.setupEventListeners();
    }
  }

  /**
   * 獲取遊戲狀態
   * @returns {Object} 遊戲狀態
   */
  getState() {
    if (!this.gameEngine) {
      return null;
    }

    return {
      state: this.gameEngine.getState(),
      score: this.gameEngine.getScore(),
      highScore: this.gameEngine.getHighScore(),
      level: this.gameEngine.getLevel(),
      speed: this.gameEngine.getSpeed()
    };
  }

  /**
   * 銷毀遊戲
   */
  destroy() {
    this.stop();
    
    if (this.inputHandler) {
      this.inputHandler.stopListening();
      this.inputHandler.removeAllListeners();
    }

    if (this.gameEngine) {
      this.gameEngine.removeAllListeners();
    }

    this.isInitialized = false;
    console.log('遊戲已銷毀');
  }

  /**
   * 檢查遊戲是否已初始化
   * @returns {boolean} 是否已初始化
   */
  isReady() {
    return this.isInitialized;
  }

  /**
   * 獲取遊戲統計資訊
   * @returns {Object} 統計資訊
   */
  getStats() {
    if (!this.gameEngine) {
      return null;
    }

    const snake = this.gameEngine.getSnake();
    return {
      score: this.gameEngine.getScore(),
      highScore: this.gameEngine.getHighScore(),
      level: this.gameEngine.getLevel(),
      speed: this.gameEngine.getSpeed(),
      snakeLength: snake ? snake.length : 0,
      state: this.gameEngine.getState()
    };
  }
}
