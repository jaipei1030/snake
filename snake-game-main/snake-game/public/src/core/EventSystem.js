/**
 * EventSystem 類別 - 事件系統基礎類別
 */
export class EventSystem {
  constructor() {
    this.eventListeners = {};
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
          console.error(`事件 ${event} 的監聽器執行錯誤:`, error);
        }
      });
    }
  }

  /**
   * 移除所有事件監聽器
   * @param {string} event - 事件名稱（可選）
   */
  removeAllListeners(event) {
    if (event) {
      delete this.eventListeners[event];
    } else {
      this.eventListeners = {};
    }
  }

  /**
   * 獲取事件監聽器數量
   * @param {string} event - 事件名稱
   * @returns {number} 監聽器數量
   */
  listenerCount(event) {
    return this.eventListeners[event] ? this.eventListeners[event].length : 0;
  }

  /**
   * 獲取所有事件名稱
   * @returns {string[]} 事件名稱陣列
   */
  eventNames() {
    return Object.keys(this.eventListeners);
  }
}
