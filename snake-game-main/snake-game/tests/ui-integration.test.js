import { Game } from '../src/Game.js';
import { GameConfig } from '../src/utils/GameConfig.js';
import { GridSize } from '../src/core/GridSize.js';
import { GameState, GameEvent } from '../src/core/Enums.js';

// 模擬 DOM 元素
const mockDOM = {
  getElementById: jest.fn((id) => {
    const elements = {
      gameCanvas: {
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
      },
      startBtn: {
        addEventListener: jest.fn(),
        disabled: false,
        textContent: '開始遊戲'
      },
      pauseBtn: {
        addEventListener: jest.fn(),
        disabled: false,
        textContent: '暫停'
      },
      resetBtn: {
        addEventListener: jest.fn(),
        disabled: false,
        textContent: '重新開始'
      },
      score: {
        textContent: '0'
      },
      highScore: {
        textContent: '0'
      },
      level: {
        textContent: '1'
      },
      gameSpeed: {
        textContent: '200ms'
      },
      snakeLength: {
        textContent: '1'
      },
      gameOverlay: {
        classList: {
          add: jest.fn(),
          remove: jest.fn()
        }
      },
      overlayTitle: {
        textContent: ''
      },
      overlayMessage: {
        textContent: ''
      }
    };
    return elements[id] || null;
  })
};

// 模擬 document
global.document = mockDOM;

// 模擬 requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

describe('UI 整合測試', () => {
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
    
    const canvas = mockDOM.getElementById('gameCanvas');
    game = new Game(canvas, config);
    game.initialize();
    
    jest.clearAllMocks();
  });

  afterEach(() => {
    game.destroy();
  });

  describe('UI 事件處理', () => {
    test('應該能夠處理開始按鈕點擊', () => {
      const startBtn = mockDOM.getElementById('startBtn');
      const clickHandler = startBtn.addEventListener.mock.calls.find(
        call => call[0] === 'click'
      )[1];
      
      clickHandler();
      
      expect(game.getState().state).toBe(GameState.RUNNING);
    });

    test('應該能夠處理暫停按鈕點擊', () => {
      game.start();
      const pauseBtn = mockDOM.getElementById('pauseBtn');
      const clickHandler = pauseBtn.addEventListener.mock.calls.find(
        call => call[0] === 'click'
      )[1];
      
      clickHandler();
      
      expect(game.getState().state).toBe(GameState.PAUSED);
    });

    test('應該能夠處理重新開始按鈕點擊', () => {
      game.start();
      const resetBtn = mockDOM.getElementById('resetBtn');
      const clickHandler = resetBtn.addEventListener.mock.calls.find(
        call => call[0] === 'click'
      )[1];
      
      clickHandler();
      
      expect(game.getState().state).toBe(GameState.RUNNING);
      expect(game.getState().score).toBe(0);
    });
  });

  describe('UI 狀態更新', () => {
    test('應該在遊戲開始時更新按鈕狀態', () => {
      game.start();
      
      const startBtn = mockDOM.getElementById('startBtn');
      const pauseBtn = mockDOM.getElementById('pauseBtn');
      const resetBtn = mockDOM.getElementById('resetBtn');
      
      expect(startBtn.disabled).toBe(true);
      expect(pauseBtn.disabled).toBe(false);
      expect(resetBtn.disabled).toBe(false);
    });

    test('應該在遊戲暫停時更新按鈕狀態', () => {
      game.start();
      game.togglePause();
      
      const startBtn = mockDOM.getElementById('startBtn');
      const pauseBtn = mockDOM.getElementById('pauseBtn');
      const resetBtn = mockDOM.getElementById('resetBtn');
      
      expect(startBtn.disabled).toBe(true);
      expect(pauseBtn.disabled).toBe(false);
      expect(resetBtn.disabled).toBe(false);
    });

    test('應該在遊戲結束時更新按鈕狀態', () => {
      game.start();
      
      // 模擬遊戲結束
      const gameEngine = game.gameEngine;
      gameEngine.state = GameState.GAME_OVER;
      
      const startBtn = mockDOM.getElementById('startBtn');
      const pauseBtn = mockDOM.getElementById('pauseBtn');
      const resetBtn = mockDOM.getElementById('resetBtn');
      
      expect(startBtn.disabled).toBe(false);
      expect(pauseBtn.disabled).toBe(true);
      expect(resetBtn.disabled).toBe(false);
    });
  });

  describe('分數和統計更新', () => {
    test('應該在分數更新時更新 UI', () => {
      game.start();
      
      const gameEngine = game.gameEngine;
      gameEngine.score = 100;
      
      // 觸發分數更新事件
      gameEngine.emit(GameEvent.SCORE_UPDATE, { newScore: 100 });
      
      const scoreElement = mockDOM.getElementById('score');
      expect(scoreElement.textContent).toBe('100');
    });

    test('應該在等級更新時更新 UI', () => {
      game.start();
      
      // 觸發等級更新事件
      game.gameEngine.emit(GameEvent.LEVEL_UP, { level: 2, speed: 180 });
      
      const levelElement = mockDOM.getElementById('level');
      const speedElement = mockDOM.getElementById('gameSpeed');
      
      expect(levelElement.textContent).toBe('2');
      expect(speedElement.textContent).toBe('180ms');
    });

    test('應該在蛇移動時更新長度顯示', () => {
      game.start();
      
      // 觸發蛇移動事件
      game.gameEngine.emit(GameEvent.SNAKE_MOVE, { position: { x: 10, y: 10 } });
      
      const lengthElement = mockDOM.getElementById('snakeLength');
      expect(lengthElement.textContent).toBe('1');
    });
  });

  describe('遊戲覆蓋層', () => {
    test('應該在遊戲暫停時顯示覆蓋層', () => {
      game.start();
      game.togglePause();
      
      const overlay = mockDOM.getElementById('gameOverlay');
      const titleElement = mockDOM.getElementById('overlayTitle');
      const messageElement = mockDOM.getElementById('overlayMessage');
      
      expect(overlay.classList.remove).toHaveBeenCalledWith('hidden');
      expect(titleElement.textContent).toBe('遊戲暫停');
      expect(messageElement.textContent).toBe('按空白鍵繼續');
    });

    test('應該在遊戲結束時顯示覆蓋層', () => {
      game.start();
      
      // 模擬遊戲結束
      const gameEngine = game.gameEngine;
      gameEngine.emit(GameEvent.GAME_OVER, { score: 150, highScore: 200 });
      
      const overlay = mockDOM.getElementById('gameOverlay');
      const titleElement = mockDOM.getElementById('overlayTitle');
      const messageElement = mockDOM.getElementById('overlayMessage');
      
      expect(overlay.classList.remove).toHaveBeenCalledWith('hidden');
      expect(titleElement.textContent).toBe('遊戲結束');
      expect(messageElement.textContent).toBe('最終分數: 150');
    });

    test('應該在遊戲恢復時隱藏覆蓋層', () => {
      game.start();
      game.togglePause();
      game.togglePause();
      
      const overlay = mockDOM.getElementById('gameOverlay');
      expect(overlay.classList.add).toHaveBeenCalledWith('hidden');
    });
  });

  describe('UI 重置', () => {
    test('應該在遊戲重置時重置 UI', () => {
      game.start();
      
      // 設定一些遊戲狀態
      const gameEngine = game.gameEngine;
      gameEngine.score = 100;
      gameEngine.level = 2;
      
      // 重置遊戲
      game.restart();
      
      const scoreElement = mockDOM.getElementById('score');
      const levelElement = mockDOM.getElementById('level');
      const speedElement = mockDOM.getElementById('gameSpeed');
      const lengthElement = mockDOM.getElementById('snakeLength');
      
      expect(scoreElement.textContent).toBe('0');
      expect(levelElement.textContent).toBe('1');
      expect(speedElement.textContent).toBe('200ms');
      expect(lengthElement.textContent).toBe('1');
    });
  });
});
