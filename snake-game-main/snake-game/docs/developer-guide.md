# 貪吃蛇遊戲開發者指南

## 專案概述

貪吃蛇遊戲是一個使用 HTML5 Canvas 和 JavaScript 開發的經典遊戲，採用模組化架構設計，遵循 TDD 和 BDD 開發原則。

## 技術架構

### 技術堆疊

- **前端**: HTML5 Canvas + JavaScript (ES6+)
- **測試框架**: Jest + Testing Library
- **建置工具**: Webpack 5
- **程式碼品質**: ESLint + Prettier
- **版本控制**: Git

### 專案結構

```
snake-game/
├── src/                    # 原始碼
│   ├── core/              # 核心遊戲邏輯
│   │   ├── Position.js    # 位置類別
│   │   ├── GridSize.js    # 網格大小類別
│   │   ├── Enums.js       # 枚舉定義
│   │   ├── Snake.js       # 蛇類別
│   │   ├── Food.js        # 食物類別
│   │   ├── GameEngine.js  # 遊戲引擎
│   │   ├── EventSystem.js # 事件系統
│   │   └── GameError.js   # 錯誤處理
│   ├── render/            # 渲染系統
│   │   └── GameRenderer.js
│   ├── input/             # 輸入處理
│   │   └── InputHandler.js
│   ├── utils/             # 工具類別
│   │   ├── GameConfig.js  # 遊戲配置
│   │   └── PerformanceOptimizer.js
│   ├── Game.js            # 主遊戲類別
│   └── index.js           # 入口檔案
├── tests/                 # 測試檔案
│   ├── core/             # 核心邏輯測試
│   ├── render/           # 渲染測試
│   ├── input/            # 輸入測試
│   ├── e2e/              # 端對端測試
│   └── setup.js          # 測試設定
├── public/               # 靜態資源
│   ├── index.html        # HTML 模板
│   └── style.css         # CSS 樣式
├── docs/                 # 文檔
├── dist/                 # 建置輸出
└── package.json          # 專案配置
```

## 核心類別設計

### 1. Position 類別

代表二維座標位置，提供位置計算和驗證功能。

```javascript
class Position {
  constructor(x, y)
  equals(other)
  add(other)
  subtract(other)
  distance(other)
  isValid(gridSize)
  static random(gridSize)
  static fromDirection(direction)
}
```

### 2. Snake 類別

代表遊戲中的蛇，處理移動、成長和碰撞檢測。

```javascript
class Snake {
  constructor(startPosition, gridSize)
  move()
  changeDirection(newDirection)
  grow()
  checkCollision(gridSize)
  getNextPosition()
  isAt(position)
  contains(position)
}
```

### 3. GameEngine 類別

遊戲的核心引擎，管理遊戲狀態、分數和事件。

```javascript
class GameEngine extends EventSystem {
  constructor(config)
  start()
  pause()
  resume()
  reset()
  changeDirection(direction)
  update()
  gameOver()
}
```

### 4. GameRenderer 類別

負責遊戲畫面的渲染，使用 Canvas API 繪製遊戲元素。

```javascript
class GameRenderer {
  constructor(canvas, config)
  render(gameState)
  clear()
  drawSnake(snake)
  drawFood(food)
  drawGrid()
  drawUI(gameState)
  drawGameOver(score, highScore)
}
```

### 5. InputHandler 類別

處理使用者輸入，支援鍵盤事件和按鍵綁定。

```javascript
class InputHandler {
  constructor()
  startListening()
  stopListening()
  handleKeyPress(key)
  setKeyBindings(bindings)
  on(event, callback)
  off(event, callback)
}
```

## 事件系統

遊戲使用觀察者模式實現事件系統，支援以下事件：

### 遊戲事件

- `GAME_START`: 遊戲開始
- `GAME_PAUSE`: 遊戲暫停
- `GAME_RESUME`: 遊戲恢復
- `GAME_OVER`: 遊戲結束
- `GAME_RESET`: 遊戲重置
- `SCORE_UPDATE`: 分數更新
- `LEVEL_UP`: 等級提升
- `SNAKE_MOVE`: 蛇移動
- `FOOD_EATEN`: 食物被吃
- `COLLISION`: 碰撞事件
- `ERROR`: 錯誤事件

### 使用範例

```javascript
gameEngine.on(GameEvent.SCORE_UPDATE, (data) => {
  console.log(`分數更新: ${data.newScore}`);
});

gameEngine.on(GameEvent.GAME_OVER, (data) => {
  console.log(`遊戲結束，最終分數: ${data.score}`);
});
```

## 配置系統

### GameConfig 類別

管理遊戲的所有配置參數，支援本地儲存。

```javascript
const config = new GameConfig({
  gridSize: new GridSize(20, 20),
  initialSpeed: 200,
  speedIncrement: 20,
  minSpeed: 50,
  foodValue: 10,
  keyBindings: {
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    pause: 'Space',
    restart: 'r'
  },
  renderSettings: {
    snakeColor: '#00ff00',
    foodColor: '#ff0000',
    gridColor: '#333333',
    backgroundColor: '#000000',
    cellSize: 20,
    showGrid: true
  }
});
```

## 測試策略

### 測試金字塔

- **單元測試 (80%)**: 測試個別函數和方法
- **整合測試 (15%)**: 測試模組間互動
- **端對端測試 (5%)**: 測試完整使用者流程

### 測試覆蓋率目標

- 程式碼覆蓋率: ≥ 80%
- 分支覆蓋率: ≥ 70%
- 功能覆蓋率: 100%

### 測試範例

```javascript
describe('Snake', () => {
  test('應該能夠移動', () => {
    const snake = new Snake(new Position(10, 10), gridSize);
    snake.move();
    expect(snake.head.x).toBe(11);
  });
});
```

## 效能優化

### 1. 渲染優化

- 使用 `requestAnimationFrame` 控制幀率
- 實作髒矩形更新，只重繪變化的區域
- 使用離屏 Canvas 預渲染靜態元素

### 2. 記憶體管理

- 使用物件池模式管理蛇身節點
- 避免頻繁建立和銷毀物件
- 及時清理事件監聽器

### 3. 計算優化

- 快取常用計算結果
- 使用位運算優化碰撞檢測
- 減少不必要的 DOM 操作

## 錯誤處理

### GameError 類別

自定義錯誤類別，提供詳細的錯誤資訊和上下文。

```javascript
try {
  // 遊戲邏輯
} catch (error) {
  const gameError = new GameError(
    '蛇移動失敗',
    ErrorCode.INVALID_POSITION,
    { position: snake.head }
  );
  gameError.log();
}
```

### 錯誤處理策略

1. **預防性檢查**: 在操作前驗證輸入
2. **優雅降級**: 錯誤發生時提供替代方案
3. **錯誤記錄**: 記錄錯誤資訊供除錯使用
4. **使用者友善**: 顯示易懂的錯誤訊息

## 跨瀏覽器相容性

### 支援的瀏覽器

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### 相容性處理

- 使用 Babel 轉譯 ES6+ 語法
- 使用 Polyfill 支援舊版瀏覽器
- 進行多瀏覽器測試驗證

## 開發工作流程

### 1. 環境設定

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 執行測試
npm test

# 程式碼檢查
npm run lint
```

### 2. 開發流程

1. **建立功能分支**
2. **撰寫測試** (TDD)
3. **實作功能**
4. **執行測試**
5. **程式碼檢查**
6. **提交變更**

### 3. 程式碼規範

- 使用 ESLint 進行程式碼檢查
- 使用 Prettier 進行程式碼格式化
- 遵循 ES6+ 語法規範
- 撰寫清晰的註解

## 部署指南

### 1. 建置生產版本

```bash
npm run build
```

### 2. 部署到靜態主機

將 `dist/` 目錄的內容上傳到靜態主機即可。

### 3. 環境變數

- `NODE_ENV`: 環境模式 (development/production)
- `PUBLIC_URL`: 公開 URL 路徑

## 擴展指南

### 1. 添加新功能

1. 在對應的模組中實作功能
2. 撰寫單元測試
3. 更新文檔
4. 進行整合測試

### 2. 自定義主題

修改 `GameConfig` 中的 `renderSettings` 參數：

```javascript
const customConfig = new GameConfig({
  // ... 其他配置
  renderSettings: {
    snakeColor: '#ff00ff',
    foodColor: '#ffff00',
    gridColor: '#666666',
    backgroundColor: '#111111',
    cellSize: 25,
    showGrid: false
  }
});
```

### 3. 添加新事件

1. 在 `Enums.js` 中定義新事件
2. 在相關類別中觸發事件
3. 在 UI 中監聽事件
4. 撰寫測試驗證

## 除錯技巧

### 1. 使用開發者工具

- 開啟瀏覽器開發者工具
- 使用 `console.log` 輸出除錯資訊
- 使用斷點除錯

### 2. 遊戲狀態檢查

```javascript
// 在控制台中檢查遊戲狀態
console.log(game.getState());
console.log(game.getStats());
```

### 3. 效能分析

```javascript
// 檢查效能統計
console.log(globalPerformanceOptimizer.getStats());
console.log(globalMemoryManager.getMemoryUsage());
```

## 常見問題

### Q: 如何修改遊戲速度？
A: 修改 `GameConfig` 中的 `initialSpeed` 和 `speedIncrement` 參數。

### Q: 如何添加新的按鍵綁定？
A: 修改 `GameConfig` 中的 `keyBindings` 參數。

### Q: 如何自定義遊戲區域大小？
A: 修改 `GameConfig` 中的 `gridSize` 參數。

### Q: 如何添加音效？
A: 在 `GameEngine` 中添加音效播放邏輯，並在相應事件中觸發。

## 貢獻指南

### 1. 提交變更

1. Fork 專案
2. 建立功能分支
3. 實作功能並撰寫測試
4. 提交 Pull Request

### 2. 程式碼審查

- 確保所有測試通過
- 遵循程式碼規範
- 提供清晰的提交訊息
- 更新相關文檔

---

*最後更新: 2025-01-17*
