import { GameRenderer } from '../../src/render/GameRenderer.js';
import { GameConfig } from '../../src/utils/GameConfig.js';
import { GridSize } from '../../src/core/GridSize.js';
import { Snake } from '../../src/core/Snake.js';
import { Food } from '../../src/core/Food.js';
import { Position } from '../../src/core/Position.js';
import { GameState } from '../../src/core/Enums.js';

// 模擬 Canvas 和 Context
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

describe('GameRenderer', () => {
  let renderer;
  let config;
  let mockCtx;

  beforeEach(() => {
    config = new GameConfig({
      gridSize: new GridSize(20, 20),
      renderSettings: {
        snakeColor: '#00ff00',
        foodColor: '#ff0000',
        gridColor: '#333333',
        backgroundColor: '#000000',
        cellSize: 20,
        showGrid: true
      }
    });
    
    mockCtx = mockCanvas.getContext();
    renderer = new GameRenderer(mockCanvas, config);
  });

  describe('初始化', () => {
    test('應該正確初始化渲染器', () => {
      expect(renderer.canvas).toBe(mockCanvas);
      expect(renderer.ctx).toBe(mockCtx);
      expect(renderer.cellSize).toBe(20);
      expect(renderer.gridWidth).toBe(20);
      expect(renderer.gridHeight).toBe(20);
    });

    test('應該設定 Canvas 大小', () => {
      expect(mockCanvas.width).toBe(400);
      expect(mockCanvas.height).toBe(400);
    });
  });

  describe('渲染功能', () => {
    let gameState;

    beforeEach(() => {
      const snake = new Snake(new Position(10, 10), config.gridSize);
      const food = new Food(new Position(5, 5));
      
      gameState = {
        snake,
        food,
        score: 100,
        highScore: 200,
        level: 2,
        state: GameState.RUNNING
      };
    });

    test('應該能夠渲染遊戲狀態', () => {
      renderer.render(gameState);
      
      expect(mockCtx.fillRect).toHaveBeenCalled();
      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.fillText).toHaveBeenCalled();
    });

    test('應該能夠清除畫布', () => {
      renderer.clear();
      
      expect(mockCtx.fillStyle).toBe('#000000');
      expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, 400, 400);
    });

    test('應該能夠繪製網格', () => {
      renderer.drawGrid();
      
      expect(mockCtx.strokeStyle).toBe('#333333');
      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.stroke).toHaveBeenCalled();
    });

    test('應該能夠繪製蛇', () => {
      renderer.drawSnake(gameState.snake);
      
      expect(mockCtx.fillStyle).toBe('#00ff00');
      expect(mockCtx.fillRect).toHaveBeenCalled();
    });

    test('應該能夠繪製食物', () => {
      renderer.drawFood(gameState.food);
      
      expect(mockCtx.fillStyle).toBe('#ff0000');
      expect(mockCtx.fillRect).toHaveBeenCalled();
    });

    test('應該能夠繪製 UI 資訊', () => {
      renderer.drawUI(gameState);
      
      expect(mockCtx.fillText).toHaveBeenCalledWith('分數: 100', 10, 420);
      expect(mockCtx.fillText).toHaveBeenCalledWith('最高分: 200', 150, 420);
      expect(mockCtx.fillText).toHaveBeenCalledWith('等級: 2', 300, 420);
    });
  });

  describe('遊戲結束畫面', () => {
    test('應該能夠繪製遊戲結束畫面', () => {
      const gameState = {
        state: GameState.GAME_OVER,
        score: 150,
        highScore: 200
      };
      
      renderer.drawGameOver(gameState.score, gameState.highScore);
      
      expect(mockCtx.fillText).toHaveBeenCalledWith('遊戲結束', 200, 160);
      expect(mockCtx.fillText).toHaveBeenCalledWith('最終分數: 150', 200, 200);
      expect(mockCtx.fillText).toHaveBeenCalledWith('最高分: 200', 200, 230);
    });

    test('應該在新紀錄時顯示特殊訊息', () => {
      renderer.drawGameOver(250, 250);
      
      expect(mockCtx.fillText).toHaveBeenCalledWith('新紀錄！', 200, 230);
    });
  });

  describe('狀態文字', () => {
    test('應該返回正確的狀態文字', () => {
      expect(renderer.getStateText(GameState.READY)).toBe('準備開始');
      expect(renderer.getStateText(GameState.RUNNING)).toBe('遊戲中');
      expect(renderer.getStateText(GameState.PAUSED)).toBe('已暫停');
      expect(renderer.getStateText(GameState.GAME_OVER)).toBe('遊戲結束');
      expect(renderer.getStateText(GameState.ERROR)).toBe('錯誤');
    });
  });

  describe('設定方法', () => {
    test('應該能夠設定 Canvas', () => {
      const newCanvas = { ...mockCanvas };
      renderer.setCanvas(newCanvas);
      
      expect(renderer.canvas).toBe(newCanvas);
    });

    test('應該能夠設定網格大小', () => {
      const newGridSize = new GridSize(30, 30);
      renderer.setGridSize(newGridSize);
      
      expect(renderer.gridWidth).toBe(30);
      expect(renderer.gridHeight).toBe(30);
    });
  });
});
