import { ErrorCode } from './Enums.js';

/**
 * GameError 類別 - 遊戲錯誤處理
 */
export class GameError extends Error {
  constructor(message, code, context = null) {
    super(message);
    this.name = 'GameError';
    this.code = code;
    this.context = context;
    this.timestamp = new Date();
    
    // 確保堆疊追蹤正確
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GameError);
    }
  }

  /**
   * 轉換為字串表示
   * @returns {string} 錯誤字串
   */
  toString() {
    return `${this.name}: ${this.message} (${this.code})`;
  }

  /**
   * 轉換為 JSON 物件
   * @returns {Object} 錯誤物件
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack
    };
  }

  /**
   * 記錄錯誤
   */
  log() {
    console.error(this.toString());
    if (this.context) {
      console.error('Context:', this.context);
    }
    if (this.stack) {
      console.error('Stack:', this.stack);
    }
  }
}

/**
 * 錯誤處理工具類別
 */
export class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
  }

  /**
   * 處理錯誤
   * @param {Error} error - 錯誤物件
   * @param {string} context - 錯誤上下文
   * @returns {GameError} 處理後的錯誤
   */
  handle(error, context = null) {
    let gameError;
    
    if (error instanceof GameError) {
      gameError = error;
    } else {
      gameError = new GameError(
        error.message || '未知錯誤',
        ErrorCode.UNKNOWN_ERROR,
        { originalError: error, context }
      );
    }

    // 記錄錯誤
    this.logError(gameError);
    
    // 記錄到控制台
    gameError.log();
    
    return gameError;
  }

  /**
   * 記錄錯誤
   * @param {GameError} error - 錯誤物件
   */
  logError(error) {
    this.errorLog.push(error);
    
    // 限制日誌大小
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }
  }

  /**
   * 獲取錯誤日誌
   * @returns {GameError[]} 錯誤日誌
   */
  getErrorLog() {
    return [...this.errorLog];
  }

  /**
   * 清除錯誤日誌
   */
  clearErrorLog() {
    this.errorLog = [];
  }

  /**
   * 獲取錯誤統計
   * @returns {Object} 錯誤統計
   */
  getErrorStats() {
    const stats = {
      total: this.errorLog.length,
      byCode: {},
      recent: this.errorLog.slice(-10)
    };

    this.errorLog.forEach(error => {
      stats.byCode[error.code] = (stats.byCode[error.code] || 0) + 1;
    });

    return stats;
  }
}

/**
 * 全域錯誤處理器實例
 */
export const globalErrorHandler = new ErrorHandler();

/**
 * 錯誤處理裝飾器
 * @param {Function} fn - 要包裝的函數
 * @param {string} context - 錯誤上下文
 * @returns {Function} 包裝後的函數
 */
export function withErrorHandling(fn, context = null) {
  return function(...args) {
    try {
      return fn.apply(this, args);
    } catch (error) {
      const gameError = globalErrorHandler.handle(error, context);
      throw gameError;
    }
  };
}

/**
 * 異步錯誤處理裝飾器
 * @param {Function} fn - 要包裝的異步函數
 * @param {string} context - 錯誤上下文
 * @returns {Function} 包裝後的異步函數
 */
export function withAsyncErrorHandling(fn, context = null) {
  return async function(...args) {
    try {
      return await fn.apply(this, args);
    } catch (error) {
      const gameError = globalErrorHandler.handle(error, context);
      throw gameError;
    }
  };
}
