import { Game } from '../src/Game.js';
import { GameConfig } from '../src/utils/GameConfig.js';
import { GridSize } from '../src/core/GridSize.js';
import { GameState, Direction } from '../src/core/Enums.js';

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

describe('Game', () => {
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
  });

  afterEach(() => {
    game.destroy();
    jest.clearAllMocks();
  });

  describe('初始化', () => {
    test('應該正確初始化遊戲', () => {
      game.initialize();
      
      expect(game.isInitialized).toBe(true);
      expect(game.gameEngine).toBeDefined();
      expect(game.renderer).toBeDefined();
      expect(game.inputHandler).toBeDefined();
    });

    test('應該防止重複初始化', () => {
      game.initialize();
      const originalEngine = game.gameEngine;
      
      game.initialize();
      
      expect(game.gameEngine).toBe(originalEngine);
    });
  });

  describe('遊戲控制', () => {
    beforeEach(() => {
      game.initialize();
    });

    test('應該能夠開始遊戲', () => {
      game.start();
      
      expect(game.gameEngine.getState()).toBe(GameState.RUNNING);
    });

    test('應該能夠暫停和恢復遊戲', () => {
      game.start();
      game.togglePause();
      
      expect(game.gameEngine.getState()).toBe(GameState.PAUSED);
      
      game.togglePause();
      expect(game.gameEngine.getState()).toBe(GameState.RUNNING);
    });

    test('應該能夠重新開始遊戲', () => {
      game.start();
      game.restart();
      
      expect(game.gameEngine.getState()).toBe(GameState.RUNNING);
      expect(game.gameEngine.getScore()).toBe(0);
    });

    test('應該能夠停止遊戲', () => {
      game.start();
      game.stop();
      
      expect(game.gameEngine.getState()).toBe(GameState.READY);
    });
  });

  describe('渲染', () => {
    beforeEach(() => {
      game.initialize();
    });

    test('應該能夠渲染遊戲', () => {
      game.start();
      game.render();
      
      expect(game.renderer.render).toHaveBeenCalled();
    });

    test('應該在遊戲運行時開始渲染循環', () => {
      game.start();
      
      expect(requestAnimationFrame).toHaveBeenCalled();
    });

    test('應該在遊戲暫停時停止渲染循環', () => {
      game.start();
      game.togglePause();
      
      expect(cancelAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('輸入處理', () => {
    beforeEach(() => {
      game.initialize();
    });

    test('應該處理方向輸入', () => {
      game.start();
      
      // 模擬方向鍵輸入
      const directionCallback = jest.fn();
      game.inputHandler.on('direction', directionCallback);
      
      game.inputHandler.emit('direction', Direction.UP);
      
      expect(directionCallback).toHaveBeenCalledWith(Direction.UP);
    });

    test('應該處理遊戲控制輸入', () => {
      game.start();
      
      // 模擬暫停按鍵
      game.inputHandler.emit('gameControl', 'pause');
      
      expect(game.gameEngine.getState()).toBe(GameState.PAUSED);
    });
  });

  describe('配置更新', () => {
    beforeEach(() => {
      game.initialize();
    });

    test('應該能夠更新配置', () => {
      const newConfig = new GameConfig({
        gridSize: new GridSize(30, 30),
        initialSpeed: 150
      });
      
      game.updateConfig(newConfig);
      
      expect(game.config).toBe(newConfig);
      expect(game.gameEngine).toBeDefined();
      expect(game.renderer).toBeDefined();
    });
  });

  describe('狀態查詢', () => {
    beforeEach(() => {
      game.initialize();
    });

    test('應該能夠獲取遊戲狀態', () => {
      game.start();
      
      const state = game.getState();
      
      expect(state).toHaveProperty('state');
      expect(state).toHaveProperty('score');
      expect(state).toHaveProperty('highScore');
      expect(state).toHaveProperty('level');
      expect(state).toHaveProperty('speed');
    });

    test('應該能夠獲取遊戲統計資訊', () => {
      game.start();
      
      const stats = game.getStats();
      
      expect(stats).toHaveProperty('score');
      expect(stats).toHaveProperty('highScore');
      expect(stats).toHaveProperty('level');
      expect(stats).toHaveProperty('speed');
      expect(stats).toHaveProperty('snakeLength');
      expect(stats).toHaveProperty('state');
    });

    test('應該能夠檢查遊戲是否就緒', () => {
      expect(game.isReady()).toBe(false);
      
      game.initialize();
      expect(game.isReady()).toBe(true);
    });
  });

  describe('銷毀', () => {
    test('應該能夠銷毀遊戲', () => {
      game.initialize();
      game.start();
      
      game.destroy();
      
      expect(game.isInitialized).toBe(false);
      expect(game.gameEngine).toBeNull();
      expect(game.renderer).toBeNull();
      expect(game.inputHandler).toBeNull();
    });
  });
});
