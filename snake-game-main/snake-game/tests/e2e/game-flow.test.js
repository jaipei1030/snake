import { Game } from '../../src/Game.js';
import { GameConfig } from '../../src/utils/GameConfig.js';
import { GridSize } from '../../src/core/GridSize.js';
import { GameState, Direction } from '../../src/core/Enums.js';

// 模擬 Canvas
const mockCanvas = {
  width: 400,
  height: 400,
  getContext: jest.fn(() => ({
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    getImageData: jest.fn(() => ({ data: new Array(4) })),
    putImageData: jest.fn(),
    createImageData: jest.fn(() => ({ data: new Array(4) })),
    setTransform: jest.fn(),
    drawImage: jest.fn(),
    save: jest.fn(),
    fillText: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    stroke: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    rotate: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    measureText: jest.fn(() => ({ width: 0 })),
    transform: jest.fn(),
    rect: jest.fn(),
    clip: jest.fn(),
    imageSmoothingEnabled: false,
    strokeStyle: '',
    lineWidth: 1,
    fillStyle: '',
    font: '',
    textAlign: '',
    globalAlpha: 1
  }))
};

// 模擬 requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

describe('遊戲端對端測試', () => {
  let game;
  let config;

  beforeEach(() => {
    config = new GameConfig({
      gridSize: new GridSize(20, 20),
      initialSpeed: 200,
      speedIncrement: 20,
      minSpeed: 50,
      foodValue: 10
    });
    game = new Game(mockCanvas, config);
    game.initialize();
  });

  afterEach(() => {
    game.destroy();
    jest.clearAllMocks();
  });

  describe('完整遊戲流程', () => {
    test('應該能夠完成完整的遊戲流程', (done) => {
      // 開始遊戲
      game.start();
      expect(game.getState().state).toBe(GameState.RUNNING);

      // 模擬蛇移動
      const gameEngine = game.gameEngine;
      const snake = gameEngine.getSnake();
      const initialPosition = snake.head;

      // 模擬方向鍵輸入
      game.inputHandler.emit('direction', Direction.RIGHT);
      
      // 等待一幀
      setTimeout(() => {
        expect(snake.head.x).toBeGreaterThan(initialPosition.x);
        
        // 模擬吃到食物
        const food = gameEngine.getFood();
        snake.head = food.position;
        gameEngine.update();
        
        expect(gameEngine.getScore()).toBe(10);
        expect(snake.length).toBe(2);
        
        done();
      }, 50);
    });

    test('應該能夠處理遊戲暫停和恢復', () => {
      game.start();
      expect(game.getState().state).toBe(GameState.RUNNING);

      // 暫停遊戲
      game.inputHandler.emit('gameControl', 'pause');
      expect(game.getState().state).toBe(GameState.PAUSED);

      // 恢復遊戲
      game.inputHandler.emit('gameControl', 'pause');
      expect(game.getState().state).toBe(GameState.RUNNING);
    });

    test('應該能夠重新開始遊戲', () => {
      game.start();
      
      // 模擬一些遊戲進度
      const gameEngine = game.gameEngine;
      gameEngine.score = 50;
      gameEngine.level = 2;
      
      // 重新開始
      game.inputHandler.emit('gameControl', 'restart');
      
      expect(game.getState().state).toBe(GameState.RUNNING);
      expect(gameEngine.getScore()).toBe(0);
      expect(gameEngine.getLevel()).toBe(1);
    });
  });

  describe('遊戲結束流程', () => {
    test('應該能夠處理遊戲結束', (done) => {
      game.start();
      
      const gameEngine = game.gameEngine;
      const snake = gameEngine.getSnake();
      
      // 模擬蛇撞牆
      snake.head = { x: -1, y: 10 }; // 超出邊界
      
      const gameOverCallback = jest.fn();
      gameEngine.on('gameOver', gameOverCallback);
      
      gameEngine.update();
      
      setTimeout(() => {
        expect(game.getState().state).toBe(GameState.GAME_OVER);
        expect(gameOverCallback).toHaveBeenCalled();
        done();
      }, 50);
    });

    test('應該能夠在遊戲結束後重新開始', () => {
      game.start();
      
      // 模擬遊戲結束
      const gameEngine = game.gameEngine;
      gameEngine.state = GameState.GAME_OVER;
      gameEngine.score = 100;
      
      // 重新開始
      game.restart();
      
      expect(game.getState().state).toBe(GameState.RUNNING);
      expect(gameEngine.getScore()).toBe(0);
    });
  });

  describe('分數和等級系統', () => {
    test('應該能夠正確計算分數和等級', (done) => {
      game.start();
      
      const gameEngine = game.gameEngine;
      const snake = gameEngine.getSnake();
      
      // 模擬吃 5 個食物
      for (let i = 0; i < 5; i++) {
        const food = gameEngine.getFood();
        snake.head = food.position;
        gameEngine.update();
      }
      
      setTimeout(() => {
        expect(gameEngine.getScore()).toBe(50);
        expect(gameEngine.getLevel()).toBe(2);
        done();
      }, 100);
    });
  });

  describe('輸入處理', () => {
    test('應該能夠處理所有方向鍵', () => {
      game.start();
      
      const directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
      
      directions.forEach(direction => {
        game.inputHandler.emit('direction', direction);
        expect(game.gameEngine.getSnake().nextDirection).toBe(direction);
      });
    });

    test('應該能夠處理遊戲控制鍵', () => {
      game.start();
      
      // 測試暫停
      game.inputHandler.emit('gameControl', 'pause');
      expect(game.getState().state).toBe(GameState.PAUSED);
      
      // 測試恢復
      game.inputHandler.emit('gameControl', 'pause');
      expect(game.getState().state).toBe(GameState.RUNNING);
      
      // 測試重新開始
      game.inputHandler.emit('gameControl', 'restart');
      expect(game.getState().state).toBe(GameState.RUNNING);
    });
  });

  describe('渲染系統', () => {
    test('應該能夠正確渲染遊戲狀態', () => {
      game.start();
      
      const renderer = game.renderer;
      const gameState = {
        snake: game.gameEngine.getSnake(),
        food: game.gameEngine.getFood(),
        score: game.gameEngine.getScore(),
        highScore: game.gameEngine.getHighScore(),
        level: game.gameEngine.getLevel(),
        state: game.gameEngine.getState()
      };
      
      renderer.render(gameState);
      
      expect(renderer.ctx.fillRect).toHaveBeenCalled();
      expect(renderer.ctx.fillText).toHaveBeenCalled();
    });
  });
});
