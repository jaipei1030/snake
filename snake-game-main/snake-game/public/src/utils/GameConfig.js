import { GridSize } from '../core/GridSize.js';

/**
 * GameConfig 類別 - 遊戲配置
 */
export class GameConfig {
  constructor(options = {}) {
    this.gridSize = options.gridSize || new GridSize(20, 20);
    this.initialSpeed = options.initialSpeed || 200;
    this.speedIncrement = options.speedIncrement || 20;
    this.minSpeed = options.minSpeed || 50;
    this.foodValue = options.foodValue || 10;
    this.keyBindings = options.keyBindings || {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
      pause: 'Space',
      restart: 'r'
    };
    this.renderSettings = options.renderSettings || {
      snakeColor: '#00ff00',
      foodColor: '#ff0000',
      gridColor: '#333333',
      backgroundColor: '#000000',
      cellSize: 20,
      showGrid: true
    };
  }

  /**
   * 驗證配置是否有效
   * @returns {boolean} 是否有效
   */
  isValid() {
    return this.gridSize.isValid() &&
           this.initialSpeed > 0 &&
           this.speedIncrement > 0 &&
           this.minSpeed > 0 &&
           this.foodValue > 0 &&
           this.renderSettings.cellSize > 0;
  }

  /**
   * 獲取預設配置
   * @returns {GameConfig} 預設配置
   */
  static getDefault() {
    return new GameConfig();
  }

  /**
   * 從本地儲存載入配置
   * @returns {GameConfig} 載入的配置
   */
  static loadFromStorage() {
    try {
      const stored = localStorage.getItem('snakeGameConfig');
      if (stored) {
        const data = JSON.parse(stored);
        return new GameConfig(data);
      }
    } catch (error) {
      console.warn('無法載入配置，使用預設值:', error);
    }
    return GameConfig.getDefault();
  }

  /**
   * 儲存配置到本地儲存
   */
  saveToStorage() {
    try {
      const data = {
        gridSize: { width: this.gridSize.width, height: this.gridSize.height },
        initialSpeed: this.initialSpeed,
        speedIncrement: this.speedIncrement,
        minSpeed: this.minSpeed,
        foodValue: this.foodValue,
        keyBindings: this.keyBindings,
        renderSettings: this.renderSettings
      };
      localStorage.setItem('snakeGameConfig', JSON.stringify(data));
    } catch (error) {
      console.warn('無法儲存配置:', error);
    }
  }
}
