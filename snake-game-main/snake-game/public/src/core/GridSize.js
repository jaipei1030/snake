import { Position } from './Position.js';

/**
 * GridSize 類別 - 定義遊戲區域的大小
 */
export class GridSize {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  /**
   * 檢查位置是否在網格範圍內
   * @param {Position} position - 位置
   * @returns {boolean} 是否在範圍內
   */
  contains(position) {
    return position.x >= 0 && position.x < this.width &&
           position.y >= 0 && position.y < this.height;
  }

  /**
   * 獲取隨機位置
   * @returns {Position} 隨機位置
   */
  getRandomPosition() {
    return Position.random(this);
  }

  /**
   * 獲取中心位置
   * @returns {Position} 中心位置
   */
  getCenterPosition() {
    return new Position(
      Math.floor(this.width / 2),
      Math.floor(this.height / 2)
    );
  }

  /**
   * 驗證網格大小是否有效
   * @returns {boolean} 是否有效
   */
  isValid() {
    return this.width >= 10 && this.width <= 50 &&
           this.height >= 10 && this.height <= 50;
  }

  /**
   * 獲取總格子數
   * @returns {number} 總格子數
   */
  getTotalCells() {
    return this.width * this.height;
  }

  /**
   * 轉換為字串表示
   * @returns {string} 字串表示
   */
  toString() {
    return `${this.width}x${this.height}`;
  }
}
