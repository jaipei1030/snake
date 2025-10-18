import { Position } from './Position.js';
import { Direction, CollisionType } from './Enums.js';

/**
 * Snake 類別 - 代表遊戲中的蛇
 */
export class Snake {
  constructor(startPosition, gridSize) {
    this.head = startPosition;
    this.body = [];
    this.direction = Direction.RIGHT;
    this.gridSize = gridSize;
    this.nextDirection = Direction.RIGHT;
  }

  /**
   * 獲取蛇的長度
   * @returns {number} 蛇的長度
   */
  get length() {
    return this.body.length + 1;
  }

  /**
   * 移動蛇
   */
  move() {
    // 更新方向
    this.direction = this.nextDirection;

    // 將當前頭部位置加入身體
    this.body.unshift(new Position(this.head.x, this.head.y));

    // 計算新的頭部位置
    const directionOffset = Position.fromDirection(this.direction);
    this.head = this.head.add(directionOffset);

    // 移除尾部（除非蛇正在成長）
    if (!this.isGrowing) {
      this.body.pop();
    } else {
      this.isGrowing = false;
    }
  }

  /**
   * 改變方向
   * @param {Direction} newDirection - 新方向
   * @returns {boolean} 是否成功改變方向
   */
  changeDirection(newDirection) {
    // 防止反向移動
    if (this.isOppositeDirection(newDirection)) {
      return false;
    }
    this.nextDirection = newDirection;
    return true;
  }

  /**
   * 檢查是否為相反方向
   * @param {Direction} direction - 方向
   * @returns {boolean} 是否為相反方向
   */
  isOppositeDirection(direction) {
    const opposites = {
      [Direction.UP]: Direction.DOWN,
      [Direction.DOWN]: Direction.UP,
      [Direction.LEFT]: Direction.RIGHT,
      [Direction.RIGHT]: Direction.LEFT
    };
    return opposites[direction] === this.direction;
  }

  /**
   * 讓蛇成長
   */
  grow() {
    this.isGrowing = true;
  }

  /**
   * 檢查碰撞
   * @param {GridSize} gridSize - 網格大小
   * @returns {CollisionType} 碰撞類型
   */
  checkCollision(gridSize) {
    // 檢查是否撞到牆壁
    if (!this.head.isValid(gridSize)) {
      return CollisionType.WALL;
    }

    // 檢查是否撞到自己的身體（不包括頭部）
    if (this.body.some(bodyPart => bodyPart.equals(this.head))) {
      return CollisionType.SELF;
    }

    return CollisionType.NONE;
  }

  /**
   * 獲取下一個位置
   * @returns {Position} 下一個位置
   */
  getNextPosition() {
    const directionOffset = Position.fromDirection(this.direction);
    return this.head.add(directionOffset);
  }

  /**
   * 檢查蛇是否在指定位置
   * @param {Position} position - 位置
   * @returns {boolean} 是否在該位置
   */
  isAt(position) {
    return this.head.equals(position);
  }

  /**
   * 檢查蛇是否包含指定位置
   * @param {Position} position - 位置
   * @returns {boolean} 是否包含該位置
   */
  contains(position) {
    if (this.head.equals(position)) {
      return true;
    }
    return this.body.some(bodyPart => bodyPart.equals(position));
  }

  /**
   * 重置蛇到初始狀態
   * @param {Position} startPosition - 起始位置
   */
  reset(startPosition) {
    this.head = startPosition;
    this.body = [];
    this.direction = Direction.RIGHT;
    this.nextDirection = Direction.RIGHT;
    this.isGrowing = false;
  }

  /**
   * 獲取蛇的所有位置（頭部 + 身體）
   * @returns {Position[]} 所有位置
   */
  getAllPositions() {
    return [this.head, ...this.body];
  }

  /**
   * 轉換為字串表示
   * @returns {string} 字串表示
   */
  toString() {
    return `Snake(head: ${this.head.toString()}, body: [${this.body.map(p => p.toString()).join(', ')}], direction: ${this.direction})`;
  }
}
