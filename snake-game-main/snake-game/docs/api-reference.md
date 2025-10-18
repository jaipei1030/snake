# 貪吃蛇遊戲 API 參考文檔

## 概述

本文檔提供了貪吃蛇遊戲所有公開 API 的詳細說明，包括類別、方法、屬性和事件。

## 核心類別

### Position

代表二維座標位置。

#### 建構函數

```javascript
new Position(x, y)
```

**參數:**
- `x` (number): X 座標
- `y` (number): Y 座標

#### 實例方法

##### equals(other)

比較兩個位置是否相等。

```javascript
position.equals(other) → boolean
```

**參數:**
- `other` (Position): 另一個位置

**返回值:**
- `boolean`: 是否相等

##### add(other)

將兩個位置相加。

```javascript
position.add(other) → Position
```

**參數:**
- `other` (Position): 另一個位置

**返回值:**
- `Position`: 新的位置

##### subtract(other)

將兩個位置相減。

```javascript
position.subtract(other) → Position
```

**參數:**
- `other` (Position): 另一個位置

**返回值:**
- `Position`: 新的位置

##### distance(other)

計算兩個位置之間的距離。

```javascript
position.distance(other) → number
```

**參數:**
- `other` (Position): 另一個位置

**返回值:**
- `number`: 距離

##### isValid(gridSize)

檢查位置是否在網格範圍內。

```javascript
position.isValid(gridSize) → boolean
```

**參數:**
- `gridSize` (GridSize): 網格大小

**返回值:**
- `boolean`: 是否有效

#### 靜態方法

##### random(gridSize)

生成隨機位置。

```javascript
Position.random(gridSize) → Position
```

**參數:**
- `gridSize` (GridSize): 網格大小

**返回值:**
- `Position`: 隨機位置

##### fromDirection(direction)

根據方向生成位置偏移。

```javascript
Position.fromDirection(direction) → Position
```

**參數:**
- `direction` (Direction): 方向

**返回值:**
- `Position`: 位置偏移

### GridSize

定義遊戲區域的大小。

#### 建構函數

```javascript
new GridSize(width, height)
```

**參數:**
- `width` (number): 網格寬度
- `height` (number): 網格高度

#### 實例方法

##### contains(position)

檢查位置是否在網格範圍內。

```javascript
gridSize.contains(position) → boolean
```

**參數:**
- `position` (Position): 位置

**返回值:**
- `boolean`: 是否在範圍內

##### getRandomPosition()

獲取隨機位置。

```javascript
gridSize.getRandomPosition() → Position
```

**返回值:**
- `Position`: 隨機位置

##### getCenterPosition()

獲取中心位置。

```javascript
gridSize.getCenterPosition() → Position
```

**返回值:**
- `Position`: 中心位置

##### isValid()

驗證網格大小是否有效。

```javascript
gridSize.isValid() → boolean
```

**返回值:**
- `boolean`: 是否有效

### Snake

代表遊戲中的蛇。

#### 建構函數

```javascript
new Snake(startPosition, gridSize)
```

**參數:**
- `startPosition` (Position): 起始位置
- `gridSize` (GridSize): 網格大小

#### 屬性

- `head` (Position): 蛇頭位置
- `body` (Position[]): 身體節點位置陣列
- `direction` (Direction): 當前移動方向
- `length` (number): 蛇的長度

#### 實例方法

##### move()

移動蛇。

```javascript
snake.move() → void
```

##### changeDirection(newDirection)

改變方向。

```javascript
snake.changeDirection(newDirection) → boolean
```

**參數:**
- `newDirection` (Direction): 新方向

**返回值:**
- `boolean`: 是否成功改變方向

##### grow()

讓蛇成長。

```javascript
snake.grow() → void
```

##### checkCollision(gridSize)

檢查碰撞。

```javascript
snake.checkCollision(gridSize) → CollisionType
```

**參數:**
- `gridSize` (GridSize): 網格大小

**返回值:**
- `CollisionType`: 碰撞類型

##### getNextPosition()

獲取下一個位置。

```javascript
snake.getNextPosition() → Position
```

**返回值:**
- `Position`: 下一個位置

##### isAt(position)

檢查蛇是否在指定位置。

```javascript
snake.isAt(position) → boolean
```

**參數:**
- `position` (Position): 位置

**返回值:**
- `boolean`: 是否在該位置

##### contains(position)

檢查蛇是否包含指定位置。

```javascript
snake.contains(position) → boolean
```

**參數:**
- `position` (Position): 位置

**返回值:**
- `boolean`: 是否包含該位置

### Food

代表遊戲中的食物。

#### 建構函數

```javascript
new Food(position, value, type)
```

**參數:**
- `position` (Position): 食物位置
- `value` (number): 食物分數值
- `type` (FoodType): 食物類型

#### 屬性

- `position` (Position): 食物位置
- `value` (number): 食物分數值
- `type` (FoodType): 食物類型

#### 實例方法

##### generateNewPosition(snake, gridSize)

生成新的食物位置。

```javascript
food.generateNewPosition(snake, gridSize) → void
```

**參數:**
- `snake` (Snake): 蛇物件
- `gridSize` (GridSize): 網格大小

##### isEatenBy(snake)

檢查是否被蛇吃掉。

```javascript
food.isEatenBy(snake) → boolean
```

**參數:**
- `snake` (Snake): 蛇物件

**返回值:**
- `boolean`: 是否被吃掉

##### isAt(position)

檢查食物是否在指定位置。

```javascript
food.isAt(position) → boolean
```

**參數:**
- `position` (Position): 位置

**返回值:**
- `boolean`: 是否在該位置

### GameEngine

遊戲的核心引擎。

#### 建構函數

```javascript
new GameEngine(config)
```

**參數:**
- `config` (GameConfig): 遊戲配置

#### 實例方法

##### start()

開始遊戲。

```javascript
gameEngine.start() → void
```

##### pause()

暫停遊戲。

```javascript
gameEngine.pause() → void
```

##### resume()

恢復遊戲。

```javascript
gameEngine.resume() → void
```

##### reset()

重置遊戲。

```javascript
gameEngine.reset() → void
```

##### stop()

停止遊戲。

```javascript
gameEngine.stop() → void
```

##### changeDirection(direction)

改變蛇的方向。

```javascript
gameEngine.changeDirection(direction) → void
```

**參數:**
- `direction` (Direction): 新方向

#### 事件監聽

##### on(event, callback)

註冊事件監聽器。

```javascript
gameEngine.on(event, callback) → void
```

**參數:**
- `event` (GameEvent): 事件名稱
- `callback` (Function): 回調函數

##### off(event, callback)

移除事件監聽器。

```javascript
gameEngine.off(event, callback) → void
```

**參數:**
- `event` (GameEvent): 事件名稱
- `callback` (Function): 回調函數

#### 狀態查詢

##### getState()

獲取遊戲狀態。

```javascript
gameEngine.getState() → GameState
```

**返回值:**
- `GameState`: 遊戲狀態

##### getScore()

獲取當前分數。

```javascript
gameEngine.getScore() → number
```

**返回值:**
- `number`: 當前分數

##### getHighScore()

獲取最高分數。

```javascript
gameEngine.getHighScore() → number
```

**返回值:**
- `number`: 最高分數

##### getLevel()

獲取當前等級。

```javascript
gameEngine.getLevel() → number
```

**返回值:**
- `number`: 當前等級

##### getSpeed()

獲取遊戲速度。

```javascript
gameEngine.getSpeed() → number
```

**返回值:**
- `number`: 遊戲速度

### GameRenderer

負責遊戲畫面的渲染。

#### 建構函數

```javascript
new GameRenderer(canvas, config)
```

**參數:**
- `canvas` (HTMLCanvasElement): Canvas 元素
- `config` (GameConfig): 遊戲配置

#### 實例方法

##### render(gameState)

渲染遊戲狀態。

```javascript
renderer.render(gameState) → void
```

**參數:**
- `gameState` (Object): 遊戲狀態

##### clear()

清除畫布。

```javascript
renderer.clear() → void
```

##### drawSnake(snake)

繪製蛇。

```javascript
renderer.drawSnake(snake) → void
```

**參數:**
- `snake` (Snake): 蛇物件

##### drawFood(food)

繪製食物。

```javascript
renderer.drawFood(food) → void
```

**參數:**
- `food` (Food): 食物物件

##### drawGrid()

繪製網格。

```javascript
renderer.drawGrid() → void
```

##### drawUI(gameState)

繪製 UI 資訊。

```javascript
renderer.drawUI(gameState) → void
```

**參數:**
- `gameState` (Object): 遊戲狀態

##### drawGameOver(score, highScore)

繪製遊戲結束畫面。

```javascript
renderer.drawGameOver(score, highScore) → void
```

**參數:**
- `score` (number): 分數
- `highScore` (number): 最高分數

### InputHandler

處理使用者輸入。

#### 建構函數

```javascript
new InputHandler()
```

#### 實例方法

##### startListening()

開始監聽輸入。

```javascript
inputHandler.startListening() → void
```

##### stopListening()

停止監聽輸入。

```javascript
inputHandler.stopListening() → void
```

##### handleKeyPress(key)

處理按鍵按下。

```javascript
inputHandler.handleKeyPress(key) → void
```

**參數:**
- `key` (string): 按鍵

##### setKeyBindings(bindings)

設定按鍵綁定。

```javascript
inputHandler.setKeyBindings(bindings) → void
```

**參數:**
- `bindings` (Object): 按鍵綁定

#### 事件監聽

##### on(event, callback)

註冊事件監聽器。

```javascript
inputHandler.on(event, callback) → void
```

**參數:**
- `event` (string): 事件名稱
- `callback` (Function): 回調函數

##### off(event, callback)

移除事件監聽器。

```javascript
inputHandler.off(event, callback) → void
```

**參數:**
- `event` (string): 事件名稱
- `callback` (Function): 回調函數

### Game

主遊戲類別，整合所有組件。

#### 建構函數

```javascript
new Game(canvas, config)
```

**參數:**
- `canvas` (HTMLCanvasElement): Canvas 元素
- `config` (GameConfig): 遊戲配置

#### 實例方法

##### initialize()

初始化遊戲。

```javascript
game.initialize() → void
```

##### start()

開始遊戲。

```javascript
game.start() → void
```

##### togglePause()

暫停/恢復遊戲。

```javascript
game.togglePause() → void
```

##### restart()

重新開始遊戲。

```javascript
game.restart() → void
```

##### stop()

停止遊戲。

```javascript
game.stop() → void
```

##### render()

渲染遊戲。

```javascript
game.render() → void
```

##### updateConfig(config)

更新遊戲配置。

```javascript
game.updateConfig(config) → void
```

**參數:**
- `config` (GameConfig): 新配置

##### getState()

獲取遊戲狀態。

```javascript
game.getState() → Object
```

**返回值:**
- `Object`: 遊戲狀態

##### getStats()

獲取遊戲統計資訊。

```javascript
game.getStats() → Object
```

**返回值:**
- `Object`: 統計資訊

##### destroy()

銷毀遊戲。

```javascript
game.destroy() → void
```

##### isReady()

檢查遊戲是否已初始化。

```javascript
game.isReady() → boolean
```

**返回值:**
- `boolean`: 是否已初始化

## 枚舉類型

### Direction

移動方向。

```javascript
Direction = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
}
```

### GameState

遊戲狀態。

```javascript
GameState = {
  READY: 'READY',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER',
  ERROR: 'ERROR'
}
```

### FoodType

食物類型。

```javascript
FoodType = {
  NORMAL: 'NORMAL',
  SPECIAL: 'SPECIAL'
}
```

### CollisionType

碰撞類型。

```javascript
CollisionType = {
  NONE: 'NONE',
  SELF: 'SELF',
  WALL: 'WALL',
  FOOD: 'FOOD'
}
```

### GameEvent

遊戲事件。

```javascript
GameEvent = {
  GAME_START: 'gameStart',
  GAME_PAUSE: 'gamePause',
  GAME_RESUME: 'gameResume',
  GAME_OVER: 'gameOver',
  GAME_RESET: 'gameReset',
  SCORE_UPDATE: 'scoreUpdate',
  LEVEL_UP: 'levelUp',
  SNAKE_MOVE: 'snakeMove',
  FOOD_EATEN: 'foodEaten',
  COLLISION: 'collision',
  ERROR: 'error'
}
```

### ErrorCode

錯誤代碼。

```javascript
ErrorCode = {
  INVALID_POSITION: 'INVALID_POSITION',
  INVALID_DIRECTION: 'INVALID_DIRECTION',
  INVALID_STATE: 'INVALID_STATE',
  RENDER_ERROR: 'RENDER_ERROR',
  INPUT_ERROR: 'INPUT_ERROR',
  CONFIG_ERROR: 'CONFIG_ERROR'
}
```

## 事件資料結構

### GameStartEvent

遊戲開始事件資料。

```javascript
{
  timestamp: Date,
  initialScore: number
}
```

### ScoreUpdateEvent

分數更新事件資料。

```javascript
{
  newScore: number,
  previousScore: number,
  pointsGained: number
}
```

### CollisionEvent

碰撞事件資料。

```javascript
{
  type: CollisionType,
  position: Position,
  timestamp: Date
}
```

### FoodEatenEvent

食物被吃事件資料。

```javascript
{
  foodPosition: Position,
  foodValue: number,
  newScore: number
}
```

## 使用範例

### 基本遊戲初始化

```javascript
import { Game } from './src/Game.js';
import { GameConfig } from './src/utils/GameConfig.js';

const canvas = document.getElementById('gameCanvas');
const config = new GameConfig();
const game = new Game(canvas, config);

game.initialize();
game.start();
```

### 事件監聽

```javascript
game.gameEngine.on(GameEvent.SCORE_UPDATE, (data) => {
  console.log(`分數更新: ${data.newScore}`);
});

game.gameEngine.on(GameEvent.GAME_OVER, (data) => {
  console.log(`遊戲結束，最終分數: ${data.score}`);
});
```

### 自定義配置

```javascript
const customConfig = new GameConfig({
  gridSize: new GridSize(30, 30),
  initialSpeed: 150,
  foodValue: 20,
  renderSettings: {
    snakeColor: '#ff00ff',
    foodColor: '#ffff00',
    cellSize: 15
  }
});
```

---

*最後更新: 2025-01-17*
