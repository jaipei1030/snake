import { PerformanceOptimizer, ObjectPool, MemoryManager } from '../src/utils/PerformanceOptimizer.js';
import { Game } from '../src/Game.js';
import { GameConfig } from '../src/utils/GameConfig.js';
import { GridSize } from '../src/core/GridSize.js';

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

describe('效能測試', () => {
  describe('PerformanceOptimizer', () => {
    let optimizer;

    beforeEach(() => {
      optimizer = new PerformanceOptimizer();
    });

    test('應該正確初始化', () => {
      expect(optimizer.frameCount).toBe(0);
      expect(optimizer.fps).toBe(0);
      expect(optimizer.isOptimizing).toBe(false);
    });

    test('應該能夠開始和停止監控', () => {
      optimizer.startMonitoring();
      expect(optimizer.isOptimizing).toBe(true);
      
      optimizer.stopMonitoring();
      expect(optimizer.isOptimizing).toBe(false);
    });

    test('應該能夠更新效能統計', () => {
      optimizer.startMonitoring();
      
      const currentTime = performance.now() + 16;
      optimizer.updateStats(currentTime);
      
      expect(optimizer.frameCount).toBe(1);
      expect(optimizer.frameTime).toBeGreaterThan(0);
    });

    test('應該能夠檢查是否需要跳過幀', () => {
      optimizer.startMonitoring();
      
      const currentTime = performance.now() + 8; // 8ms < 16.67ms
      const shouldSkip = optimizer.shouldSkipFrame(currentTime);
      
      expect(shouldSkip).toBe(true);
    });

    test('應該能夠獲取效能統計', () => {
      optimizer.startMonitoring();
      const stats = optimizer.getStats();
      
      expect(stats).toHaveProperty('fps');
      expect(stats).toHaveProperty('frameTime');
      expect(stats).toHaveProperty('frameCount');
      expect(stats).toHaveProperty('isOptimizing');
    });

    test('應該能夠設定優化參數', () => {
      const settings = { targetFPS: 30, enableVSync: false };
      optimizer.setOptimizationSettings(settings);
      
      expect(optimizer.optimizationSettings.targetFPS).toBe(30);
      expect(optimizer.optimizationSettings.enableVSync).toBe(false);
    });
  });

  describe('ObjectPool', () => {
    let pool;

    beforeEach(() => {
      pool = new ObjectPool(
        () => ({ x: 0, y: 0, active: false }),
        (obj) => { obj.x = 0; obj.y = 0; obj.active = false; },
        5
      );
    });

    test('應該正確初始化', () => {
      const stats = pool.getStats();
      expect(stats.poolSize).toBe(5);
      expect(stats.activeCount).toBe(0);
      expect(stats.totalCapacity).toBe(5);
    });

    test('應該能夠獲取和歸還物件', () => {
      const obj = pool.get();
      
      expect(obj).toBeDefined();
      expect(pool.getStats().activeCount).toBe(1);
      expect(pool.getStats().poolSize).toBe(4);
      
      pool.release(obj);
      
      expect(pool.getStats().activeCount).toBe(0);
      expect(pool.getStats().poolSize).toBe(5);
    });

    test('應該能夠歸還所有物件', () => {
      const obj1 = pool.get();
      const obj2 = pool.get();
      
      expect(pool.getStats().activeCount).toBe(2);
      
      pool.releaseAll();
      
      expect(pool.getStats().activeCount).toBe(0);
      expect(pool.getStats().poolSize).toBe(5);
    });

    test('應該在池空時建立新物件', () => {
      // 清空池
      pool.releaseAll();
      pool.pool = [];
      
      const obj = pool.get();
      
      expect(obj).toBeDefined();
      expect(pool.getStats().activeCount).toBe(1);
    });
  });

  describe('MemoryManager', () => {
    let memoryManager;

    beforeEach(() => {
      memoryManager = new MemoryManager();
    });

    test('應該正確初始化', () => {
      const usage = memoryManager.getMemoryUsage();
      expect(usage.totalAllocated).toBe(0);
      expect(usage.allocationCount).toBe(0);
    });

    test('應該能夠分配和釋放記憶體', () => {
      const success = memoryManager.allocate('test', 1024);
      
      expect(success).toBe(true);
      expect(memoryManager.getMemoryUsage().totalAllocated).toBe(1024);
      
      memoryManager.deallocate('test');
      expect(memoryManager.getMemoryUsage().totalAllocated).toBe(0);
    });

    test('應該在記憶體不足時拒絕分配', () => {
      const success = memoryManager.allocate('test', memoryManager.maxMemory + 1);
      
      expect(success).toBe(false);
      expect(memoryManager.getMemoryUsage().totalAllocated).toBe(0);
    });

    test('應該能夠清理所有記憶體', () => {
      memoryManager.allocate('test1', 1024);
      memoryManager.allocate('test2', 2048);
      
      expect(memoryManager.getMemoryUsage().totalAllocated).toBe(3072);
      
      memoryManager.cleanup();
      
      expect(memoryManager.getMemoryUsage().totalAllocated).toBe(0);
      expect(memoryManager.getMemoryUsage().allocationCount).toBe(0);
    });
  });

  describe('遊戲效能測試', () => {
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
    });

    test('應該能夠在 60 FPS 下運行', (done) => {
      game.start();
      
      let frameCount = 0;
      const startTime = performance.now();
      
      const checkPerformance = () => {
        frameCount++;
        
        if (frameCount >= 60) {
          const endTime = performance.now();
          const duration = endTime - startTime;
          const fps = (frameCount / duration) * 1000;
          
          expect(fps).toBeGreaterThan(50); // 允許一些誤差
          done();
        } else {
          setTimeout(checkPerformance, 16);
        }
      };
      
      setTimeout(checkPerformance, 16);
    });

    test('應該能夠處理大量物件而不影響效能', () => {
      game.start();
      
      const gameEngine = game.gameEngine;
      const snake = gameEngine.getSnake();
      
      // 模擬蛇變得很長
      for (let i = 0; i < 100; i++) {
        snake.grow();
        snake.move();
      }
      
      expect(snake.length).toBe(101);
      
      // 渲染應該仍然正常
      const startTime = performance.now();
      game.render();
      const renderTime = performance.now() - startTime;
      
      expect(renderTime).toBeLessThan(16); // 應該在 16ms 內完成
    });
  });
});
