import { Snake } from '../../src/core/Snake.js';
import { Position } from '../../src/core/Position.js';
import { Direction, CollisionType } from '../../src/core/Enums.js';

describe('Snake', () => {
  let snake;
  let startPosition;
  let gridSize;

  beforeEach(() => {
    startPosition = new Position(10, 10);
    gridSize = { width: 20, height: 20 };
    snake = new Snake(startPosition, gridSize);
  });

  describe('初始化', () => {
    test('應該正確建立蛇', () => {
      expect(snake.head).toEqual(startPosition);
      expect(snake.body).toEqual([]);
      expect(snake.direction).toBe(Direction.RIGHT);
      expect(snake.length).toBe(1);
    });

    test('應該有正確的長度', () => {
      expect(snake.length).toBe(1);
    });
  });

  describe('移動', () => {
    test('應該能夠向右移動', () => {
      snake.move();
      expect(snake.head).toEqual(new Position(11, 10));
      expect(snake.body).toEqual([startPosition]);
    });

    test('應該能夠改變方向', () => {
      snake.changeDirection(Direction.DOWN);
      snake.move();
      expect(snake.head).toEqual(new Position(10, 11));
    });

    test('應該防止反向移動', () => {
      snake.changeDirection(Direction.LEFT);
      expect(snake.direction).toBe(Direction.RIGHT);
    });

    test('應該能夠成長', () => {
      snake.grow();
      snake.move();
      expect(snake.length).toBe(2);
      expect(snake.body).toHaveLength(1);
    });
  });

  describe('碰撞檢測', () => {
    test('應該檢測牆壁碰撞', () => {
      snake.head = new Position(0, 10);
      snake.changeDirection(Direction.LEFT);
      snake.move();
      expect(snake.checkCollision(gridSize)).toBe(CollisionType.WALL);
    });

    test('應該檢測自身碰撞', () => {
      snake.grow();
      snake.move();
      snake.grow();
      snake.move();
      snake.changeDirection(Direction.UP);
      snake.move();
      snake.changeDirection(Direction.LEFT);
      snake.move();
      snake.changeDirection(Direction.DOWN);
      snake.move();
      expect(snake.checkCollision(gridSize)).toBe(CollisionType.SELF);
    });

    test('應該檢測無碰撞', () => {
      snake.move();
      expect(snake.checkCollision(gridSize)).toBe(CollisionType.NONE);
    });
  });

  describe('位置檢查', () => {
    test('應該正確檢查是否在位置', () => {
      expect(snake.isAt(startPosition)).toBe(true);
      expect(snake.isAt(new Position(5, 5))).toBe(false);
    });

    test('應該正確檢查是否包含位置', () => {
      snake.grow();
      snake.move();
      expect(snake.contains(startPosition)).toBe(true);
      expect(snake.contains(snake.head)).toBe(true);
    });
  });

  describe('重置', () => {
    test('應該能夠重置到初始狀態', () => {
      snake.grow();
      snake.move();
      snake.changeDirection(Direction.DOWN);
      snake.move();
      
      snake.reset(startPosition);
      
      expect(snake.head).toEqual(startPosition);
      expect(snake.body).toEqual([]);
      expect(snake.direction).toBe(Direction.RIGHT);
    });
  });
});
