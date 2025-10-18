import { Food } from '../../src/core/Food.js';
import { Snake } from '../../src/core/Snake.js';
import { Position } from '../../src/core/Position.js';
import { FoodType } from '../../src/core/Enums.js';

describe('Food', () => {
  let food;
  let position;
  let snake;
  let gridSize;

  beforeEach(() => {
    position = new Position(5, 5);
    food = new Food(position, 10, FoodType.NORMAL);
    gridSize = { width: 20, height: 20 };
    snake = new Snake(new Position(10, 10), gridSize);
  });

  describe('初始化', () => {
    test('應該正確建立食物', () => {
      expect(food.position).toEqual(position);
      expect(food.value).toBe(10);
      expect(food.type).toBe(FoodType.NORMAL);
    });

    test('應該使用預設值', () => {
      const defaultFood = new Food(position);
      expect(defaultFood.value).toBe(10);
      expect(defaultFood.type).toBe(FoodType.NORMAL);
    });
  });

  describe('位置生成', () => {
    test('應該生成不與蛇身重疊的位置', () => {
      const originalPosition = food.position;
      food.generateNewPosition(snake, gridSize);
      
      expect(food.position).not.toEqual(originalPosition);
      expect(snake.contains(food.position)).toBe(false);
    });

    test('應該在無法找到合適位置時使用中心位置', () => {
      // 建立一個填滿整個網格的蛇
      const fullSnake = new Snake(new Position(0, 0), gridSize);
      for (let i = 0; i < gridSize.width * gridSize.height - 1; i++) {
        fullSnake.grow();
        fullSnake.move();
      }
      
      food.generateNewPosition(fullSnake, gridSize);
      expect(food.position).toEqual(gridSize.getCenterPosition());
    });
  });

  describe('被吃檢測', () => {
    test('應該檢測被蛇頭吃掉', () => {
      snake.head = food.position;
      expect(food.isEatenBy(snake)).toBe(true);
    });

    test('應該檢測未被吃掉', () => {
      expect(food.isEatenBy(snake)).toBe(false);
    });
  });

  describe('位置檢查', () => {
    test('應該正確檢查是否在位置', () => {
      expect(food.isAt(position)).toBe(true);
      expect(food.isAt(new Position(1, 1))).toBe(false);
    });
  });

  describe('屬性設定', () => {
    test('應該能夠設定位置', () => {
      const newPosition = new Position(15, 15);
      food.setPosition(newPosition);
      expect(food.position).toEqual(newPosition);
    });

    test('應該能夠設定分數值', () => {
      food.setValue(20);
      expect(food.value).toBe(20);
    });

    test('應該能夠設定類型', () => {
      food.setType(FoodType.SPECIAL);
      expect(food.type).toBe(FoodType.SPECIAL);
    });
  });

  describe('獲取屬性', () => {
    test('應該能夠獲取分數值', () => {
      expect(food.getValue()).toBe(10);
    });

    test('應該能夠獲取類型', () => {
      expect(food.getType()).toBe(FoodType.NORMAL);
    });
  });
});
