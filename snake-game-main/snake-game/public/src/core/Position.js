/**
 * Position 類別 - 代表二維座標位置
 */
export class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * 比較兩個位置是否相等
   * @param {Position} other - 另一個位置
   * @returns {boolean} 是否相等
   */
  equals(other) {
    return this.x === other.x && this.y === other.y;
  }

  /**
   * 將兩個位置相加
   * @param {Position} other - 另一個位置
   * @returns {Position} 新的位置
   */
  add(other) {
    return new Position(this.x + other.x, this.y + other.y);
  }

  /**
   * 將兩個位置相減
   * @param {Position} other - 另一個位置
   * @returns {Position} 新的位置
   */
  subtract(other) {
    return new Position(this.x - other.x, this.y - other.y);
  }

  /**
   * 計算兩個位置之間的距離
   * @param {Position} other - 另一個位置
   * @returns {number} 距離
   */
  distance(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * 檢查位置是否在網格範圍內
   * @param {GridSize} gridSize - 網格大小
   * @returns {boolean} 是否有效
   */
  isValid(gridSize) {
    return this.x >= 0 && this.x < gridSize.width &&
           this.y >= 0 && this.y < gridSize.height;
  }

  /**
   * 生成隨機位置
   * @param {GridSize} gridSize - 網格大小
   * @returns {Position} 隨機位置
   */
  static random(gridSize) {
    return new Position(
      Math.floor(Math.random() * gridSize.width),
      Math.floor(Math.random() * gridSize.height)
    );
  }

  /**
   * 根據方向生成位置偏移
   * @param {Direction} direction - 方向
   * @returns {Position} 位置偏移
   */
  static fromDirection(direction) {
    const directions = {
      UP: new Position(0, -1),
      DOWN: new Position(0, 1),
      LEFT: new Position(-1, 0),
      RIGHT: new Position(1, 0)
    };
    return directions[direction];
  }

  /**
   * 轉換為字串表示
   * @returns {string} 字串表示
   */
  toString() {
    return `(${this.x}, ${this.y})`;
  }
}
