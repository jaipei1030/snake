import { InputHandler } from '../../src/input/InputHandler.js';
import { Direction } from '../../src/core/Enums.js';

// 模擬 DOM 事件
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

Object.defineProperty(document, 'addEventListener', {
  value: mockAddEventListener,
  writable: true
});

Object.defineProperty(document, 'removeEventListener', {
  value: mockRemoveEventListener,
  writable: true
});

describe('InputHandler', () => {
  let inputHandler;

  beforeEach(() => {
    inputHandler = new InputHandler();
    jest.clearAllMocks();
  });

  afterEach(() => {
    inputHandler.stopListening();
  });

  describe('初始化', () => {
    test('應該正確初始化輸入處理器', () => {
      expect(inputHandler.isListening).toBe(false);
      expect(inputHandler.keyBindings).toEqual({
        up: 'ArrowUp',
        down: 'ArrowDown',
        left: 'ArrowLeft',
        right: 'ArrowRight',
        pause: 'Space',
        restart: 'r'
      });
    });
  });

  describe('事件監聽', () => {
    test('應該能夠開始監聽', () => {
      inputHandler.startListening();
      
      expect(inputHandler.isListening).toBe(true);
      expect(mockAddEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(mockAddEventListener).toHaveBeenCalledWith('keyup', expect.any(Function));
    });

    test('應該能夠停止監聽', () => {
      inputHandler.startListening();
      inputHandler.stopListening();
      
      expect(inputHandler.isListening).toBe(false);
      expect(mockRemoveEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(mockRemoveEventListener).toHaveBeenCalledWith('keyup', expect.any(Function));
    });

    test('應該防止重複開始監聽', () => {
      inputHandler.startListening();
      inputHandler.startListening();
      
      expect(mockAddEventListener).toHaveBeenCalledTimes(2); // 只調用一次
    });
  });

  describe('按鍵處理', () => {
    beforeEach(() => {
      inputHandler.startListening();
    });

    test('應該處理方向鍵', () => {
      const directionCallback = jest.fn();
      inputHandler.on('direction', directionCallback);

      // 模擬按鍵事件
      const keyDownHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'keydown'
      )[1];
      
      const event = { key: 'ArrowUp', preventDefault: jest.fn() };
      keyDownHandler(event);

      expect(directionCallback).toHaveBeenCalledWith(Direction.UP);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    test('應該處理遊戲控制鍵', () => {
      const gameControlCallback = jest.fn();
      inputHandler.on('gameControl', gameControlCallback);

      const keyDownHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'keydown'
      )[1];
      
      const event = { key: 'Space', preventDefault: jest.fn() };
      keyDownHandler(event);

      expect(gameControlCallback).toHaveBeenCalledWith('pause');
    });

    test('應該忽略無效按鍵', () => {
      const directionCallback = jest.fn();
      const gameControlCallback = jest.fn();
      inputHandler.on('direction', directionCallback);
      inputHandler.on('gameControl', gameControlCallback);

      const keyDownHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'keydown'
      )[1];
      
      const event = { key: 'Enter', preventDefault: jest.fn() };
      keyDownHandler(event);

      expect(directionCallback).not.toHaveBeenCalled();
      expect(gameControlCallback).not.toHaveBeenCalled();
    });
  });

  describe('按鍵節流', () => {
    beforeEach(() => {
      inputHandler.startListening();
      inputHandler.setKeyThrottle(100);
    });

    test('應該節流快速按鍵', (done) => {
      const directionCallback = jest.fn();
      inputHandler.on('direction', directionCallback);

      const keyDownHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'keydown'
      )[1];
      
      const event = { key: 'ArrowUp', preventDefault: jest.fn() };
      
      // 快速連續按鍵
      keyDownHandler(event);
      keyDownHandler(event);
      keyDownHandler(event);

      setTimeout(() => {
        expect(directionCallback).toHaveBeenCalledTimes(1);
        done();
      }, 150);
    });
  });

  describe('按鍵綁定', () => {
    test('應該能夠設定按鍵綁定', () => {
      const newBindings = {
        up: 'w',
        down: 's',
        left: 'a',
        right: 'd'
      };
      
      inputHandler.setKeyBindings(newBindings);
      
      expect(inputHandler.keyBindings.up).toBe('w');
      expect(inputHandler.keyBindings.down).toBe('s');
      expect(inputHandler.keyBindings.left).toBe('a');
      expect(inputHandler.keyBindings.right).toBe('d');
    });

    test('應該能夠獲取按鍵綁定', () => {
      const bindings = inputHandler.getKeyBindings();
      
      expect(bindings).toEqual(inputHandler.keyBindings);
      expect(bindings).not.toBe(inputHandler.keyBindings); // 應該是副本
    });
  });

  describe('方向檢測', () => {
    test('應該正確檢測方向鍵', () => {
      expect(inputHandler.isDirectionKey('ArrowUp')).toBe(true);
      expect(inputHandler.isDirectionKey('ArrowDown')).toBe(true);
      expect(inputHandler.isDirectionKey('ArrowLeft')).toBe(true);
      expect(inputHandler.isDirectionKey('ArrowRight')).toBe(true);
      expect(inputHandler.isDirectionKey('Space')).toBe(false);
    });

    test('應該正確檢測遊戲控制鍵', () => {
      expect(inputHandler.isGameControlKey('Space')).toBe(true);
      expect(inputHandler.isGameControlKey('r')).toBe(true);
      expect(inputHandler.isGameControlKey('ArrowUp')).toBe(false);
    });
  });

  describe('按鍵映射', () => {
    test('應該正確映射方向鍵', () => {
      expect(inputHandler.getDirectionFromKey('ArrowUp')).toBe(Direction.UP);
      expect(inputHandler.getDirectionFromKey('ArrowDown')).toBe(Direction.DOWN);
      expect(inputHandler.getDirectionFromKey('ArrowLeft')).toBe(Direction.LEFT);
      expect(inputHandler.getDirectionFromKey('ArrowRight')).toBe(Direction.RIGHT);
    });

    test('應該正確映射遊戲控制鍵', () => {
      expect(inputHandler.getGameActionFromKey('Space')).toBe('pause');
      expect(inputHandler.getGameActionFromKey('r')).toBe('restart');
    });
  });

  describe('事件系統', () => {
    test('應該能夠註冊和觸發事件', () => {
      const callback = jest.fn();
      inputHandler.on('test', callback);
      
      inputHandler.emit('test', 'data');
      
      expect(callback).toHaveBeenCalledWith('data');
    });

    test('應該能夠移除事件監聽器', () => {
      const callback = jest.fn();
      inputHandler.on('test', callback);
      inputHandler.off('test', callback);
      
      inputHandler.emit('test', 'data');
      
      expect(callback).not.toHaveBeenCalled();
    });

    test('應該能夠移除所有事件監聽器', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      inputHandler.on('test1', callback1);
      inputHandler.on('test2', callback2);
      
      inputHandler.removeAllListeners();
      
      inputHandler.emit('test1', 'data');
      inputHandler.emit('test2', 'data');
      
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
    });
  });

  describe('狀態檢查', () => {
    test('應該正確報告監聽狀態', () => {
      expect(inputHandler.isActive()).toBe(false);
      
      inputHandler.startListening();
      expect(inputHandler.isActive()).toBe(true);
      
      inputHandler.stopListening();
      expect(inputHandler.isActive()).toBe(false);
    });
  });
});
