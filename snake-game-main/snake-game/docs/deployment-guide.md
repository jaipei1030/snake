# 貪吃蛇遊戲部署指南

## 概述

本指南提供了貪吃蛇遊戲的部署說明，包括建置、測試和部署到各種平台的詳細步驟。

## 環境需求

### 開發環境

- Node.js 16.0.0 或更高版本
- npm 7.0.0 或更高版本
- 現代瀏覽器（Chrome 60+, Firefox 55+, Safari 12+, Edge 79+）

### 生產環境

- 靜態檔案伺服器
- HTTPS 支援（建議）
- 現代瀏覽器支援

## 建置流程

### 1. 安裝依賴

```bash
# 安裝專案依賴
npm install

# 或使用 yarn
yarn install
```

### 2. 開發模式

```bash
# 啟動開發伺服器
npm run dev

# 或
yarn dev
```

開發伺服器將在 `http://localhost:3000` 啟動，支援熱重載。

### 3. 執行測試

```bash
# 執行所有測試
npm test

# 執行測試並生成覆蓋率報告
npm run test:coverage

# 監聽模式執行測試
npm run test:watch
```

### 4. 程式碼品質檢查

```bash
# 程式碼檢查
npm run lint

# 自動修復程式碼問題
npm run lint:fix

# 程式碼格式化
npm run format

# 檢查程式碼格式
npm run format:check
```

### 5. 建置生產版本

```bash
# 建置生產版本
npm run build

# 或
yarn build
```

建置完成後，所有檔案將輸出到 `dist/` 目錄。

## 部署選項

### 1. 靜態檔案託管

#### GitHub Pages

1. 建置專案：
   ```bash
   npm run build
   ```

2. 將 `dist/` 目錄內容推送到 GitHub Pages 分支

3. 在 GitHub 設定中啟用 Pages

#### Netlify

1. 建置專案：
   ```bash
   npm run build
   ```

2. 將 `dist/` 目錄拖拽到 Netlify 部署區域

3. 或連接 GitHub 儲存庫進行自動部署

#### Vercel

1. 安裝 Vercel CLI：
   ```bash
   npm i -g vercel
   ```

2. 建置專案：
   ```bash
   npm run build
   ```

3. 部署：
   ```bash
   vercel --prod
   ```

### 2. 傳統 Web 伺服器

#### Apache

1. 建置專案：
   ```bash
   npm run build
   ```

2. 將 `dist/` 目錄內容上傳到 Apache 的 `htdocs` 目錄

3. 配置 `.htaccess` 檔案：
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

#### Nginx

1. 建置專案：
   ```bash
   npm run build
   ```

2. 將 `dist/` 目錄內容上傳到 Nginx 的 `html` 目錄

3. 配置 Nginx：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/html;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

### 3. CDN 部署

#### AWS CloudFront

1. 建置專案：
   ```bash
   npm run build
   ```

2. 將 `dist/` 目錄內容上傳到 S3 儲存桶

3. 建立 CloudFront 分發

4. 配置快取行為和錯誤頁面

#### Cloudflare

1. 建置專案：
   ```bash
   npm run build
   ```

2. 將 `dist/` 目錄內容上傳到 Cloudflare Pages

3. 配置自定義域名和 SSL 憑證

## 環境變數

### 開發環境

建立 `.env.development` 檔案：

```env
NODE_ENV=development
PUBLIC_URL=http://localhost:3000
```

### 生產環境

建立 `.env.production` 檔案：

```env
NODE_ENV=production
PUBLIC_URL=https://your-domain.com
```

## 效能優化

### 1. 建置優化

- 啟用程式碼分割
- 壓縮 JavaScript 和 CSS
- 優化圖片資源
- 啟用 Gzip 壓縮

### 2. 快取策略

- 設定適當的 HTTP 快取標頭
- 使用 Service Worker 進行離線快取
- 實作資源版本控制

### 3. 監控

- 設定效能監控
- 追蹤錯誤和異常
- 監控使用者體驗指標

## 安全考量

### 1. HTTPS

- 使用 HTTPS 保護使用者資料
- 設定 HSTS 標頭
- 使用安全的 SSL 憑證

### 2. 內容安全政策

設定 CSP 標頭：

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
```

### 3. 其他安全標頭

```http
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

## 監控和日誌

### 1. 錯誤監控

- 使用 Sentry 或其他錯誤監控服務
- 設定錯誤警報
- 追蹤錯誤趨勢

### 2. 效能監控

- 使用 Google Analytics 或其他分析工具
- 監控頁面載入時間
- 追蹤使用者互動

### 3. 日誌記錄

- 設定適當的日誌級別
- 記錄重要事件
- 定期清理日誌檔案

## 備份和恢復

### 1. 程式碼備份

- 使用 Git 進行版本控制
- 定期推送到遠端儲存庫
- 建立備份分支

### 2. 資料備份

- 備份使用者設定和最高分數
- 定期匯出重要資料
- 測試恢復流程

## 故障排除

### 1. 建置問題

**問題**: 建置失敗
**解決方案**:
- 檢查 Node.js 版本
- 清除 node_modules 並重新安裝
- 檢查 package.json 依賴

**問題**: 記憶體不足
**解決方案**:
- 增加 Node.js 記憶體限制
- 使用 `--max-old-space-size=4096`

### 2. 部署問題

**問題**: 頁面無法載入
**解決方案**:
- 檢查檔案路徑
- 確認伺服器配置
- 檢查瀏覽器控制台錯誤

**問題**: 資源載入失敗
**解決方案**:
- 檢查檔案權限
- 確認 MIME 類型設定
- 檢查網路連線

### 3. 效能問題

**問題**: 載入速度慢
**解決方案**:
- 啟用 Gzip 壓縮
- 使用 CDN
- 優化圖片大小

**問題**: 記憶體洩漏
**解決方案**:
- 檢查事件監聽器清理
- 使用記憶體分析工具
- 優化物件生命週期

## 維護指南

### 1. 定期更新

- 更新依賴套件
- 修復安全漏洞
- 更新瀏覽器支援

### 2. 效能監控

- 定期檢查效能指標
- 優化慢速查詢
- 監控記憶體使用

### 3. 使用者回饋

- 收集使用者意見
- 修復回報的問題
- 實作新功能

## 自動化部署

### 1. CI/CD 流程

使用 GitHub Actions 範例：

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm install
      
    - name: Run tests
      run: npm test
      
    - name: Build
      run: npm run build
      
    - name: Deploy
      run: |
        # 部署指令
```

### 2. 自動化測試

- 在部署前執行測試
- 檢查程式碼品質
- 驗證建置結果

### 3. 自動化部署

- 自動部署到測試環境
- 手動批准生產部署
- 回滾機制

---

*最後更新: 2025-01-17*
