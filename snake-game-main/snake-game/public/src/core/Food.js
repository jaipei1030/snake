import { Position } from './Position.js';
import { FoodType } from './Enums.js';

/**
 * Food 類別 - 代表遊戲中的食物
 */
export class Food {
  constructor(position, value = 10, type = FoodType.NORMAL) {
    this.position = position;
    this.value = value;
    this.type = type;
  }

  /**
   * 生成新的食物位置
   * @param {Snake} snake - 蛇物件
   * @param {GridSize} gridSize - 網格大小
   */
  generateNewPosition(snake, gridSize) {
    let newPosition;
    let attempts = 0;
    const maxAttempts = 1000; // 防止無限循環

    do {
      newPosition = Position.random(gridSize);
      attempts++;
    } while (snake.contains(newPosition) && attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      // 如果無法找到合適位置，使用網格中心
      newPosition = gridSize.getCenterPosition();
    }

    this.position = newPosition;
  }

  /**
   * 檢查是否被蛇吃掉
   * @param {Snake} snake - 蛇物件
   * @returns {boolean} 是否被吃掉
   */
  isEatenBy(snake) {
    return snake.isAt(this.position);
  }

  /**
   * 檢查食物是否在指定位置
   * @param {Position} position - 位置
   * @returns {boolean} 是否在該位置
   */
  isAt(position) {
    return this.position.equals(position);
  }

  /**
   * 獲取食物分數值
   * @returns {number} 分數值
   */
  getValue() {
    return this.value;
  }

  /**
   * 獲取食物類型
   * @returns {FoodType} 食物類型
   */
  getType() {
    return this.type;
  }

  /**
   * 設定食物位置
   * @param {Position} position - 新位置
   */
  setPosition(position) {
    this.position = position;
  }

  /**
   * 設定食物分數值
   * @param {number} value - 分數值
   */
  setValue(value) {
    this.value = value;
  }

  /**
   * 設定食物類型
   * @param {FoodType} type - 食物類型
   */
  setType(type) {
    this.type = type;
  }

  /**
   * 轉換為字串表示
   * @returns {string} 字串表示
   */
  toString() {
    return `Food(position: ${this.position.toString()}, value: ${this.value}, type: ${this.type})`;
  }
}
