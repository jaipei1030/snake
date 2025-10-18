/**
 * Direction 枚舉 - 定義移動方向
 */
export const Direction = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
};

/**
 * GameState 枚舉 - 定義遊戲狀態
 */
export const GameState = {
  READY: 'READY',         // 準備開始
  RUNNING: 'RUNNING',     // 運行中
  PAUSED: 'PAUSED',       // 暫停
  GAME_OVER: 'GAME_OVER', // 遊戲結束
  ERROR: 'ERROR'          // 錯誤狀態
};

/**
 * FoodType 枚舉 - 定義食物類型
 */
export const FoodType = {
  NORMAL: 'NORMAL',       // 普通食物
  SPECIAL: 'SPECIAL'      // 特殊食物 (未來擴展)
};

/**
 * CollisionType 枚舉 - 定義碰撞類型
 */
export const CollisionType = {
  NONE: 'NONE',           // 無碰撞
  SELF: 'SELF',           // 撞到自己
  WALL: 'WALL',           // 撞到牆壁
  FOOD: 'FOOD'            // 吃到食物
};

/**
 * GameEvent 枚舉 - 定義遊戲事件
 */
export const GameEvent = {
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
};

/**
 * ErrorCode 枚舉 - 定義錯誤代碼
 */
export const ErrorCode = {
  INVALID_POSITION: 'INVALID_POSITION',
  INVALID_DIRECTION: 'INVALID_DIRECTION',
  INVALID_STATE: 'INVALID_STATE',
  RENDER_ERROR: 'RENDER_ERROR',
  INPUT_ERROR: 'INPUT_ERROR',
  CONFIG_ERROR: 'CONFIG_ERROR'
};
