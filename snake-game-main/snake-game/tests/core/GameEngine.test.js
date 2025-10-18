import { GameEngine } from '../../src/core/GameEngine.js';
import { GameConfig } from '../../src/utils/GameConfig.js';
import { GridSize } from '../../src/core/GridSize.js';
import { GameState, GameEvent, Direction } from '../../src/core/Enums.js';

// 模擬 requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

describe('GameEngine', () => {
  let gameEngine;
  let config;

  beforeEach(() => {
    config = new GameConfig({
      gridSize: new GridSize(20, 20),
      initialSpeed: 200,
      speedIncrement: 20,
      minSpeed: 50,
      foodValue: 10
    });
    gameEngine = new GameEngine(config);
  });

  afterEach(() => {
    gameEngine.stop();
    jest.clearAllMocks();
  });

  describe('初始化', () => {
    test('應該正確初始化遊戲引擎', () => {
      expect(gameEngine.getState()).toBe(GameState.READY);
      expect(gameEngine.getScore()).toBe(0);
      expect(gameEngine.getLevel()).toBe(1);
      expect(gameEngine.getSpeed()).toBe(200);
    });
  });

  describe('遊戲控制', () => {
    test('應該能夠開始遊戲', () => {
      const startCallback = jest.fn();
      gameEngine.on(GameEvent.GAME_START, startCallback);
      
      gameEngine.start();
      
      expect(gameEngine.getState()).toBe(GameState.RUNNING);
      expect(startCallback).toHaveBeenCalled();
      expect(gameEngine.getSnake()).toBeDefined();
      expect(gameEngine.getFood()).toBeDefined();
    });

    test('應該能夠暫停遊戲', () => {
      gameEngine.start();
      const pauseCallback = jest.fn();
      gameEngine.on(GameEvent.GAME_PAUSE, pauseCallback);
      
      gameEngine.pause();
      
      expect(gameEngine.getState()).toBe(GameState.PAUSED);
      expect(pauseCallback).toHaveBeenCalled();
    });

    test('應該能夠恢復遊戲', () => {
      gameEngine.start();
      gameEngine.pause();
      const resumeCallback = jest.fn();
      gameEngine.on(GameEvent.GAME_RESUME, resumeCallback);
      
      gameEngine.resume();
      
      expect(gameEngine.getState()).toBe(GameState.RUNNING);
      expect(resumeCallback).toHaveBeenCalled();
    });

    test('應該能夠重置遊戲', () => {
      gameEngine.start();
      gameEngine.changeDirection(Direction.DOWN);
      const resetCallback = jest.fn();
      gameEngine.on(GameEvent.GAME_RESET, resetCallback);
      
      gameEngine.reset();
      
      expect(gameEngine.getState()).toBe(GameState.READY);
      expect(gameEngine.getScore()).toBe(0);
      expect(resetCallback).toHaveBeenCalled();
    });
  });

  describe('方向控制', () => {
    test('應該能夠改變蛇的方向', () => {
      gameEngine.start();
      const snake = gameEngine.getSnake();
      const originalDirection = snake.direction;
      
      gameEngine.changeDirection(Direction.DOWN);
      
      expect(snake.nextDirection).toBe(Direction.DOWN);
    });

    test('應該防止在非運行狀態下改變方向', () => {
      const snake = gameEngine.getSnake();
      
      gameEngine.changeDirection(Direction.DOWN);
      
      expect(snake).toBeNull();
    });
  });

  describe('分數系統', () => {
    test('應該能夠吃食物並增加分數', () => {
      gameEngine.start();
      const foodEatenCallback = jest.fn();
      gameEngine.on(GameEvent.FOOD_EATEN, foodEatenCallback);
      
      // 模擬蛇吃到食物
      const snake = gameEngine.getSnake();
      const food = gameEngine.getFood();
      snake.head = food.position;
      gameEngine.update();
      
      expect(gameEngine.getScore()).toBe(10);
      expect(foodEatenCallback).toHaveBeenCalled();
    });
  });

  describe('等級系統', () => {
    test('應該能夠升級', () => {
      gameEngine.start();
      const levelUpCallback = jest.fn();
      gameEngine.on(GameEvent.LEVEL_UP, levelUpCallback);
      
      // 模擬吃 5 個食物
      for (let i = 0; i < 5; i++) {
        const snake = gameEngine.getSnake();
        const food = gameEngine.getFood();
        snake.head = food.position;
        gameEngine.update();
      }
      
      expect(gameEngine.getLevel()).toBe(2);
      expect(levelUpCallback).toHaveBeenCalled();
    });
  });

  describe('遊戲結束', () => {
    test('應該在撞牆時結束遊戲', () => {
      gameEngine.start();
      const gameOverCallback = jest.fn();
      gameEngine.on(GameEvent.GAME_OVER, gameOverCallback);
      
      // 模擬蛇撞牆
      const snake = gameEngine.getSnake();
      snake.head = { x: -1, y: 10 }; // 超出邊界
      gameEngine.update();
      
      expect(gameEngine.getState()).toBe(GameState.GAME_OVER);
      expect(gameOverCallback).toHaveBeenCalled();
    });

    test('應該在撞到自己時結束遊戲', () => {
      gameEngine.start();
      const gameOverCallback = jest.fn();
      gameEngine.on(GameEvent.GAME_OVER, gameOverCallback);
      
      // 模擬蛇撞到自己
      const snake = gameEngine.getSnake();
      snake.grow();
      snake.move();
      snake.grow();
      snake.move();
      snake.changeDirection(Direction.UP);
      snake.move();
      snake.changeDirection(Direction.LEFT);
      snake.move();
      snake.changeDirection(Direction.DOWN);
      snake.move();
      
      expect(gameEngine.getState()).toBe(GameState.GAME_OVER);
      expect(gameOverCallback).toHaveBeenCalled();
    });
  });

  describe('最高分數', () => {
    test('應該能夠載入和儲存最高分數', () => {
      localStorage.setItem('snakeGameHighScore', '100');
      const newGameEngine = new GameEngine(config);
      
      expect(newGameEngine.getHighScore()).toBe(100);
    });

    test('應該在遊戲結束時更新最高分數', () => {
      gameEngine.start();
      gameEngine.score = 150;
      
      gameEngine.gameOver();
      
      expect(gameEngine.getHighScore()).toBe(150);
    });
  });
});
