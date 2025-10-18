import { Direction, GameEvent } from '../core/Enums.js';

/**
 * InputHandler 類別 - 處理使用者輸入
 */
export class InputHandler {
  constructor() {
    this.keyBindings = {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
      pause: 'Space',
      restart: 'r'
    };
    this.isListening = false;
    this.eventListeners = {};
    this.lastKeyTime = 0;
    this.keyThrottle = 100; // 防止按鍵過快
    
    // 綁定事件處理器並保存引用
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    this.boundHandleKeyUp = this.handleKeyUp.bind(this);
  }

  /**
   * 開始監聽輸入
   */
  startListening() {
    if (this.isListening) {
      return;
    }

    this.isListening = true;
    document.addEventListener('keydown', this.boundHandleKeyDown);
    document.addEventListener('keyup', this.boundHandleKeyUp);
  }

  /**
   * 停止監聽輸入
   */
  stopListening() {
    if (!this.isListening) {
      return;
    }

    this.isListening = false;
    document.removeEventListener('keydown', this.boundHandleKeyDown);
    document.removeEventListener('keyup', this.boundHandleKeyUp);
  }

  /**
   * 處理按鍵按下事件
   * @param {KeyboardEvent} event - 鍵盤事件
   */
  handleKeyDown(event) {
    const currentTime = Date.now();
    if (currentTime - this.lastKeyTime < this.keyThrottle) {
      return;
    }
    this.lastKeyTime = currentTime;

    const key = event.key;
    
    // 只對遊戲相關按鍵阻止預設行為
    if (this.isDirectionKey(key) || this.isGameControlKey(key)) {
      event.preventDefault();
      this.handleKeyPress(key);
    }
  }

  /**
   * 處理按鍵釋放事件
   * @param {KeyboardEvent} event - 鍵盤事件
   */
  handleKeyUp(event) {
    // 可以在這裡處理按鍵釋放事件
  }

  /**
   * 處理按鍵按下
   * @param {string} key - 按鍵
   */
  handleKeyPress(key) {
    // 處理方向鍵
    if (this.isDirectionKey(key)) {
      const direction = this.getDirectionFromKey(key);
      this.handleDirectionInput(direction);
      return;
    }

    // 處理遊戲控制鍵
    if (this.isGameControlKey(key)) {
      const action = this.getGameActionFromKey(key);
      this.handleGameControlInput(action);
      return;
    }
  }

  /**
   * 處理方向輸入
   * @param {Direction} direction - 方向
   */
  handleDirectionInput(direction) {
    this.emit('direction', direction);
  }

  /**
   * 處理遊戲控制輸入
   * @param {string} action - 動作
   */
  handleGameControlInput(action) {
    this.emit('gameControl', action);
  }

  /**
   * 檢查是否為方向鍵
   * @param {string} key - 按鍵
   * @returns {boolean} 是否為方向鍵
   */
  isDirectionKey(key) {
    return Object.values(this.keyBindings).slice(0, 4).includes(key);
  }

  /**
   * 檢查是否為遊戲控制鍵
   * @param {string} key - 按鍵
   * @returns {boolean} 是否為遊戲控制鍵
   */
  isGameControlKey(key) {
    return Object.values(this.keyBindings).slice(4).includes(key);
  }

  /**
   * 從按鍵獲取方向
   * @param {string} key - 按鍵
   * @returns {Direction} 方向
   */
  getDirectionFromKey(key) {
    const directionMap = {
      [this.keyBindings.up]: Direction.UP,
      [this.keyBindings.down]: Direction.DOWN,
      [this.keyBindings.left]: Direction.LEFT,
      [this.keyBindings.right]: Direction.RIGHT
    };
    return directionMap[key];
  }

  /**
   * 從按鍵獲取遊戲動作
   * @param {string} key - 按鍵
   * @returns {string} 動作
   */
  getGameActionFromKey(key) {
    const actionMap = {
      [this.keyBindings.pause]: 'pause',
      [this.keyBindings.restart]: 'restart'
    };
    return actionMap[key];
  }

  /**
   * 設定按鍵綁定
   * @param {Object} bindings - 按鍵綁定
   */
  setKeyBindings(bindings) {
    this.keyBindings = { ...this.keyBindings, ...bindings };
  }

  /**
   * 獲取按鍵綁定
   * @returns {Object} 按鍵綁定
   */
  getKeyBindings() {
    return { ...this.keyBindings };
  }

  /**
   * 設定按鍵節流時間
   * @param {number} throttle - 節流時間（毫秒）
   */
  setKeyThrottle(throttle) {
    this.keyThrottle = throttle;
  }

  /**
   * 註冊事件監聽器
   * @param {string} event - 事件名稱
   * @param {Function} callback - 回調函數
   */
  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  /**
   * 移除事件監聽器
   * @param {string} event - 事件名稱
   * @param {Function} callback - 回調函數
   */
  off(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
    }
  }

  /**
   * 觸發事件
   * @param {string} event - 事件名稱
   * @param {*} data - 事件資料
   */
  emit(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`輸入事件 ${event} 的監聽器執行錯誤:`, error);
        }
      });
    }
  }

  /**
   * 移除所有事件監聽器
   */
  removeAllListeners() {
    this.eventListeners = {};
  }

  /**
   * 檢查是否正在監聽
   * @returns {boolean} 是否正在監聽
   */
  isActive() {
    return this.isListening;
  }
}
