import { Game } from '../src/Game.js';
import { GameConfig } from '../src/utils/GameConfig.js';
import { GridSize } from '../src/core/GridSize.js';
import { GameState, Direction } from '../src/core/Enums.js';

// 模擬不同瀏覽器的 Canvas API
const createMockCanvas = (browserType = 'chrome') => {
  const baseContext = {
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
  };

  // 根據瀏覽器類型添加特定功能
  switch (browserType) {
    case 'firefox':
      // Firefox 特定功能
      baseContext.mozImageSmoothingEnabled = false;
      break;
    case 'safari':
      // Safari 特定功能
      baseContext.webkitImageSmoothingEnabled = false;
      break;
    case 'ie':
      // IE 特定功能
      baseContext.msImageSmoothingEnabled = false;
      break;
    default:
      // Chrome/Edge 預設功能
      break;
  }

  return {
    width: 400,
    height: 400,
    getContext: jest.fn(() => baseContext)
  };
};

// 模擬不同瀏覽器的事件 API
const createMockEventAPI = (browserType = 'chrome') => {
  const addEventListener = jest.fn();
  const removeEventListener = jest.fn();
  
  // 根據瀏覽器類型添加特定功能
  switch (browserType) {
    case 'ie':
      // IE 使用 attachEvent
      return {
        addEventListener: addEventListener,
        removeEventListener: removeEventListener,
        attachEvent: jest.fn(),
        detachEvent: jest.fn()
      };
    default:
      return {
        addEventListener: addEventListener,
        removeEventListener: removeEventListener
      };
  }
};

// 模擬 requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

describe('跨瀏覽器相容性測試', () => {
  const browsers = ['chrome', 'firefox', 'safari', 'ie'];
  
  browsers.forEach(browser => {
    describe(`${browser} 瀏覽器`, () => {
      let game;
      let config;
      let mockCanvas;

      beforeEach(() => {
        mockCanvas = createMockCanvas(browser);
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
      });

      test('應該能夠初始化遊戲', () => {
        expect(game.isInitialized).toBe(true);
        expect(game.gameEngine).toBeDefined();
        expect(game.renderer).toBeDefined();
        expect(game.inputHandler).toBeDefined();
      });

      test('應該能夠開始遊戲', () => {
        game.start();
        expect(game.getState().state).toBe(GameState.RUNNING);
      });

      test('應該能夠處理方向鍵輸入', () => {
        game.start();
        
        const directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
        
        directions.forEach(direction => {
          game.inputHandler.emit('direction', direction);
          expect(game.gameEngine.getSnake().nextDirection).toBe(direction);
        });
      });

      test('應該能夠渲染遊戲', () => {
        game.start();
        game.render();
        
        const ctx = mockCanvas.getContext();
        expect(ctx.fillRect).toHaveBeenCalled();
        expect(ctx.fillText).toHaveBeenCalled();
      });

      test('應該能夠處理遊戲控制', () => {
        game.start();
        
        // 測試暫停
        game.togglePause();
        expect(game.getState().state).toBe(GameState.PAUSED);
        
        // 測試恢復
        game.togglePause();
        expect(game.getState().state).toBe(GameState.RUNNING);
        
        // 測試重新開始
        game.restart();
        expect(game.getState().state).toBe(GameState.RUNNING);
      });
    });
  });

  describe('Canvas API 相容性', () => {
    test('應該支援所有瀏覽器的 Canvas 方法', () => {
      const canvas = createMockCanvas('chrome');
      const ctx = canvas.getContext();
      
      // 測試基本繪製方法
      expect(typeof ctx.fillRect).toBe('function');
      expect(typeof ctx.clearRect).toBe('function');
      expect(typeof ctx.strokeRect).toBe('function');
      expect(typeof ctx.beginPath).toBe('function');
      expect(typeof ctx.moveTo).toBe('function');
      expect(typeof ctx.lineTo).toBe('function');
      expect(typeof ctx.stroke).toBe('function');
      expect(typeof ctx.fill).toBe('function');
    });

    test('應該支援不同瀏覽器的圖片平滑設定', () => {
      const browsers = ['chrome', 'firefox', 'safari', 'ie'];
      
      browsers.forEach(browser => {
        const canvas = createMockCanvas(browser);
        const ctx = canvas.getContext();
        
        // 設定圖片平滑
        ctx.imageSmoothingEnabled = false;
        
        // 根據瀏覽器檢查特定屬性
        switch (browser) {
          case 'firefox':
            expect(ctx.mozImageSmoothingEnabled).toBe(false);
            break;
          case 'safari':
            expect(ctx.webkitImageSmoothingEnabled).toBe(false);
            break;
          case 'ie':
            expect(ctx.msImageSmoothingEnabled).toBe(false);
            break;
          default:
            expect(ctx.imageSmoothingEnabled).toBe(false);
            break;
        }
      });
    });
  });

  describe('事件 API 相容性', () => {
    test('應該支援標準事件 API', () => {
      const eventAPI = createMockEventAPI('chrome');
      
      expect(typeof eventAPI.addEventListener).toBe('function');
      expect(typeof eventAPI.removeEventListener).toBe('function');
    });

    test('應該支援 IE 事件 API', () => {
      const eventAPI = createMockEventAPI('ie');
      
      expect(typeof eventAPI.addEventListener).toBe('function');
      expect(typeof eventAPI.removeEventListener).toBe('function');
      expect(typeof eventAPI.attachEvent).toBe('function');
      expect(typeof eventAPI.detachEvent).toBe('function');
    });
  });

  describe('動畫 API 相容性', () => {
    test('應該支援 requestAnimationFrame', () => {
      expect(typeof requestAnimationFrame).toBe('function');
      expect(typeof cancelAnimationFrame).toBe('function');
    });

    test('應該能夠正確處理動畫幀', (done) => {
      const startTime = performance.now();
      
      requestAnimationFrame((timestamp) => {
        expect(timestamp).toBeGreaterThanOrEqual(startTime);
        done();
      });
    });
  });

  describe('本地儲存相容性', () => {
    test('應該支援 localStorage', () => {
      expect(typeof localStorage).toBe('object');
      expect(typeof localStorage.getItem).toBe('function');
      expect(typeof localStorage.setItem).toBe('function');
      expect(typeof localStorage.removeItem).toBe('function');
      expect(typeof localStorage.clear).toBe('function');
    });

    test('應該能夠儲存和讀取資料', () => {
      const testKey = 'testKey';
      const testValue = 'testValue';
      
      localStorage.setItem(testKey, testValue);
      expect(localStorage.getItem(testKey)).toBe(testValue);
      
      localStorage.removeItem(testKey);
      expect(localStorage.getItem(testKey)).toBeNull();
    });
  });

  describe('效能相容性', () => {
    test('應該在各種瀏覽器中保持良好效能', (done) => {
      const browsers = ['chrome', 'firefox', 'safari', 'ie'];
      let completedTests = 0;
      
      browsers.forEach(browser => {
        const mockCanvas = createMockCanvas(browser);
        const config = new GameConfig({
          gridSize: new GridSize(20, 20),
          initialSpeed: 200,
          speedIncrement: 20,
          minSpeed: 50,
          foodValue: 10
        });
        const game = new Game(mockCanvas, config);
        
        game.initialize();
        game.start();
        
        // 測試渲染效能
        const startTime = performance.now();
        game.render();
        const renderTime = performance.now() - startTime;
        
        expect(renderTime).toBeLessThan(16); // 應該在 16ms 內完成
        
        game.destroy();
        completedTests++;
        
        if (completedTests === browsers.length) {
          done();
        }
      });
    });
  });
});
