/**
 * PerformanceOptimizer 類別 - 效能優化工具
 */
export class PerformanceOptimizer {
  constructor() {
    this.frameCount = 0;
    this.lastTime = 0;
    this.fps = 0;
    this.frameTime = 0;
    this.isOptimizing = false;
    this.optimizationSettings = {
      targetFPS: 60,
      maxFrameTime: 16.67, // 60 FPS = 16.67ms per frame
      enableVSync: true,
      enableFrameSkipping: true,
      enableObjectPooling: true
    };
  }

  /**
   * 開始效能監控
   */
  startMonitoring() {
    this.isOptimizing = true;
    this.lastTime = performance.now();
    this.frameCount = 0;
  }

  /**
   * 停止效能監控
   */
  stopMonitoring() {
    this.isOptimizing = false;
  }

  /**
   * 更新效能統計
   * @param {number} currentTime - 當前時間
   */
  updateStats(currentTime) {
    if (!this.isOptimizing) return;

    this.frameTime = currentTime - this.lastTime;
    this.frameCount++;
    
    // 每秒更新一次 FPS
    if (this.frameCount % 60 === 0) {
      this.fps = 1000 / (this.frameTime || 1);
    }
    
    this.lastTime = currentTime;
  }

  /**
   * 檢查是否需要跳過幀
   * @param {number} currentTime - 當前時間
   * @returns {boolean} 是否跳過幀
   */
  shouldSkipFrame(currentTime) {
    if (!this.optimizationSettings.enableFrameSkipping) {
      return false;
    }

    const frameTime = currentTime - this.lastTime;
    return frameTime < this.optimizationSettings.maxFrameTime;
  }

  /**
   * 獲取效能統計
   * @returns {Object} 效能統計
   */
  getStats() {
    return {
      fps: Math.round(this.fps),
      frameTime: Math.round(this.frameTime * 100) / 100,
      frameCount: this.frameCount,
      isOptimizing: this.isOptimizing
    };
  }

  /**
   * 設定優化參數
   * @param {Object} settings - 優化設定
   */
  setOptimizationSettings(settings) {
    this.optimizationSettings = { ...this.optimizationSettings, ...settings };
  }
}

/**
 * 物件池類別 - 用於重用物件以減少記憶體分配
 */
export class ObjectPool {
  constructor(createFn, resetFn, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
    this.active = new Set();
    
    // 預先建立物件
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }

  /**
   * 獲取物件
   * @returns {Object} 物件實例
   */
  get() {
    let obj;
    
    if (this.pool.length > 0) {
      obj = this.pool.pop();
    } else {
      obj = this.createFn();
    }
    
    this.active.add(obj);
    return obj;
  }

  /**
   * 歸還物件
   * @param {Object} obj - 要歸還的物件
   */
  release(obj) {
    if (this.active.has(obj)) {
      this.active.delete(obj);
      this.resetFn(obj);
      this.pool.push(obj);
    }
  }

  /**
   * 歸還所有物件
   */
  releaseAll() {
    this.active.forEach(obj => {
      this.resetFn(obj);
      this.pool.push(obj);
    });
    this.active.clear();
  }

  /**
   * 獲取池狀態
   * @returns {Object} 池狀態
   */
  getStats() {
    return {
      poolSize: this.pool.length,
      activeCount: this.active.size,
      totalCapacity: this.pool.length + this.active.size
    };
  }
}

/**
 * 記憶體管理器
 */
export class MemoryManager {
  constructor() {
    this.allocations = new Map();
    this.totalAllocated = 0;
    this.maxMemory = 50 * 1024 * 1024; // 50MB
  }

  /**
   * 分配記憶體
   * @param {string} key - 分配鍵
   * @param {number} size - 大小
   * @returns {boolean} 是否成功分配
   */
  allocate(key, size) {
    if (this.totalAllocated + size > this.maxMemory) {
      console.warn('記憶體不足，無法分配:', key, size);
      return false;
    }

    this.allocations.set(key, size);
    this.totalAllocated += size;
    return true;
  }

  /**
   * 釋放記憶體
   * @param {string} key - 分配鍵
   */
  deallocate(key) {
    const size = this.allocations.get(key);
    if (size) {
      this.allocations.delete(key);
      this.totalAllocated -= size;
    }
  }

  /**
   * 獲取記憶體使用情況
   * @returns {Object} 記憶體使用情況
   */
  getMemoryUsage() {
    return {
      totalAllocated: this.totalAllocated,
      maxMemory: this.maxMemory,
      usagePercentage: (this.totalAllocated / this.maxMemory) * 100,
      allocationCount: this.allocations.size
    };
  }

  /**
   * 清理所有記憶體
   */
  cleanup() {
    this.allocations.clear();
    this.totalAllocated = 0;
  }
}

/**
 * 全域效能優化器實例
 */
export const globalPerformanceOptimizer = new PerformanceOptimizer();

/**
 * 全域記憶體管理器實例
 */
export const globalMemoryManager = new MemoryManager();
