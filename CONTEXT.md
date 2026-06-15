# 體育班評鑑模組開發 — 專案脈絡總覽

> 最後更新：2026-06-16
> 本文件記錄開發脈絡與現況，供日後對話快速銜接

---

## 專案目標

協助右昌國小體育班評鑑作業，提供：
1. 線上文件產生工具（填表 → 下載 Word）
2. 評鑑文件總覽與上傳管理
3. 上傳紀錄追蹤

---

## 系統架構

```
GitHub Pages (靜態)
├── index.html              ← 評鑑總覽（89 筆文件）
├── pe-class-tools.html     ← 5 個文件產生模組（build.py 合併）
└── guide.html              ← 工具使用說明（含左側導覽、Q&A）

Google Apps Script (動態)
└── 體育班成果上傳系統       ← 上傳檔案到 Drive + 寫入記錄到 Sheet

Google Drive
├── 各子標「文件上傳」資料夾  ← 30 個，綠色按鈕連結到這裡
└── 各子標「參考資料」資料夾  ← 30 個，藍色按鈕連結到這裡

Google Sheets（上傳記錄）
├── 工作表「上傳記錄」        ← Apps Script 上傳系統寫入
└── 工作表「Drive掃描記錄」   ← scanDriveFolders() 每日掃描寫入
```

---

## 重要網址與 ID

| 項目 | 說明 |
|------|------|
| 評鑑總覽 | https://asics49.github.io/pe-tools/ |
| 工具頁面 | https://asics49.github.io/pe-tools/pe-class-tools.html |
| 使用說明 | https://asics49.github.io/pe-tools/guide.html |
| GitHub Repo | https://github.com/asics49/pe-tools |
| 上傳系統（Apps Script）| https://script.google.com/macros/s/AKfycbyjVAz-JmkUU78HcnSMFjdsVa7FUPlAatFUhB1Yfbp2FantL5xG0dQ9cZR7qoSymHxQBw/exec |
| Apps Script 專案 | https://script.google.com/d/1VGSrRUKxdYj2TTnykWtUQFRrfnhJA8gm0qJZ3XYNBVAUMyTR7sa7EvN-/edit |
| 上傳記錄試算表 ID | `1eC1yuWxBbo7gRCLw9-8oodRdJtOmwR7ZrluKpyYkKIo` |
| 學校網域 | yocps.kh.edu.tw |
| Apps Script 帳號 | asics49@gmail.com（個人帳號） |

---

## 檔案清單

### GitHub Pages（已部署）
| 檔案 | 說明 |
|------|------|
| `index.html` | 評鑑文件總覽，89 筆文件，含篩選、模組卡片、三色按鈕 |
| `pe-class-tools.html` | 5 模組合併頁，由 build.py 產生 |
| `guide.html` | 工具使用說明網頁，含左側導覽列、折疊 Q&A、手機響應式 |
| `build.py` | 合併腳本，偵測衝突函式並加前綴 |
| `CHANGELOG.md` | 版本紀錄 |
| `CONTEXT.md` | 本文件 |

### 本機輔助腳本（未 commit，僅本機使用）
| 檔案 | 說明 |
|------|------|
| `_get_drive_ids.py` | 讀本機 Google Drive SQLite DB，列出「文件上傳」資料夾 ID |
| `_get_ref_ids.py` | 同上，列出「參考資料」資料夾 ID |
| `_patch_drive_urls.py` | 批次將 driveUrl 填入 index.html（89 筆） |
| `_patch_ref_urls.py` | 批次將 refUrl 填入 index.html（89 筆） |
| `_schema.py` | 資料結構定義 |
| `_gen_guide.js` | 產生 Word 版使用說明（右昌國小體育班評鑑文件工具使用說明.docx） |

### 本機產出文件（未 commit）
| 檔案 | 說明 |
|------|------|
| `右昌國小體育班評鑑文件工具使用說明.docx` | Word 版使用說明，含目錄、頁首頁尾 |

### Apps Script 檔案（script.google.com，asics49@gmail.com）
| 檔案 | 說明 |
|------|------|
| `Code.gs` | 上傳邏輯、Drive 掃描、記錄寫入 Sheet、快取管理 |
| `index.html` | 上傳系統前端介面 |

---

## Apps Script Code.gs 主要函式

| 函式 | 說明 |
|------|------|
| `doGet()` | 回傳上傳系統 HTML 頁面 |
| `getConfig()` | 回傳學年度清單給前端 |
| `getFolders(year, type, sport)` | 取得 Drive 子資料夾清單（快取 5 分鐘） |
| `clearFolderCache()` | 手動清除所有資料夾快取（Drive 異動後執行） |
| `uploadFileById(...)` | 用資料夾 ID 直接上傳（快速路徑） |
| `uploadFile(...)` | 用完整路徑上傳（相容舊版） |
| `logUpload(info)` | 上傳成功後寫入 Sheet「上傳記錄」 |
| `scanDriveFolders()` | 掃描 30 個評鑑文件資料夾，寫入「Drive掃描記錄」 |
| `setupDailyTrigger()` | 設定每日 08:00 自動執行 scanDriveFolders |
| `getOrCreateFolder(parent, name)` | 取得或建立子資料夾 |

---

## Apps Script index.html 主要功能

| 功能 | 說明 |
|------|------|
| Hash 參數解析 | `parseHashParams()` + `applyHashParams()`，從評鑑總覽綠色按鈕帶入學年度/類型/子項目 |
| 檔案預覽與刪除 | 用 `selectedFiles[]` 陣列管理，每個預覽圖有 ✕ 刪除按鈕，可清除全部 |
| 精確驗證提示 | 按「開始上傳」時列出具體缺少哪些欄位，而非籠統錯誤訊息 |
| 姓名記憶 | localStorage 儲存上傳者姓名，下次自動帶入 |
| 並行上傳 | 最多 3 個檔案同時上傳（CONCURRENCY = 3） |

---

## Google Drive 資料夾權限設定

| 資料夾類型 | 權限設定 |
|-----------|---------|
| 文件上傳（30 個） | 學校網域帳號 + 知道連結可編輯 (DOMAIN_WITH_LINK + EDIT) |
| 參考資料（30 個） | 學校網域帳號 + 知道連結可檢視 (DOMAIN_WITH_LINK + VIEW) |
| asics49@gmail.com | 已加為文件上傳資料夾的 Viewer（供掃描腳本讀取） |

> 批次設定權限的 Apps Script 在評鑑資料夾根目錄的 `_set_drive_permissions.gs` 與 `_set_ref_permissions.gs`

---

## index.html 按鈕邏輯

```
每筆文件有三個按鈕：
├── 金色「使用工具」  → pe-class-tools.html#m1~m4（有對應模組才顯示）
├── 綠色「上傳文件」  → doc.uploadSystemUrl（若有）或 doc.driveUrl
└── 藍色「參考資料」  → doc.refUrl
```

目前 `uploadSystemUrl` 只有 1-1 子標的 2 筆文件有設定（測試用），其餘 87 筆仍連到 Drive 資料夾。

模組卡片列（頁面頂部）目前共 7 張：m1～m4（5 張）、體育組資料上傳（綠色）、工具使用說明（紫色）。

---

## 目前執行狀態

### 已完成
- [x] 5 個評鑑文件模組（m1～m4，共 5 分頁）
- [x] build.py 合併腳本（含 async function 衝突偵測修正）
- [x] index.html 評鑑總覽（89 筆文件、篩選、模組卡片）
- [x] 30 個子標各建立「文件上傳」與「參考資料」子資料夾
- [x] 所有資料夾設定學校網域權限
- [x] index.html 89 筆文件全部填入 driveUrl 與 refUrl
- [x] pe-class-tools.html URL hash 分頁導航
- [x] pe-class-tools.html 回評鑑總覽按鈕
- [x] 體育組資料上傳系統（Apps Script）— 介面統一深藍色系
- [x] 上傳記錄 Google Sheet（每次上傳自動寫入）
- [x] Drive 掃描腳本（scanDriveFolders）— 每日自動掃描 30 個資料夾
- [x] 負責人員標籤統一（5/6年級體育班導師→體育班導師）
- [x] 模組卡片新增「體育組資料上傳」綠色入口
- [x] **guide.html** 工具使用說明網頁（左側導覽、Q&A、手機響應式），已部署
- [x] **index.html 模組卡片** 新增「工具使用說明」紫色入口連結到 guide.html
- [x] **Word 版使用說明**（_gen_guide.js 產生，含目錄、頁首頁尾、A4 格式）
- [x] **Apps Script index.html 修正**：
  - 補回 hash 參數解析（從評鑑總覽帶入資料）
  - 驗證訊息改為精確提示缺少哪個欄位
  - 預覽圖加入 ✕ 個別刪除與「清除全部」功能
  - 用 selectedFiles[] 陣列取代唯讀 FileList
- [x] **Apps Script Code.gs 修正**：
  - CACHE_TTL 從 3600 改為 300（5 分鐘）
  - 新增 clearFolderCache() 供手動清除快取

### 待辦
- [ ] **Drive 掃描權限**：需用學校帳號執行 `grantAccessToGmail`，讓 asics49@gmail.com 可讀取 30 個資料夾（目前掃描結果全為「無法存取資料夾」）
- [ ] **參考資料夾權限**：`_set_ref_permissions.gs` 的 `setRefFolderPermissions` 尚未執行
- [ ] **測試版確認**：1-1 子標兩筆文件的綠色按鈕已改連上傳系統，待測試確認流程正確後全面套用至 87 筆
- [ ] **新年度更新腳本**：撰寫 `new-year-setup.py`，整合建資料夾、讀 ID、更新 HTML、產出 .gs 全流程

---

## 已知問題與決策記錄

| 問題 | 原因 | 解法 |
|------|------|------|
| Drive 掃描顯示「無法存取資料夾」| Apps Script 用個人帳號，資料夾限學校網域 | 用學校帳號執行 grantAccessToGmail 授權 |
| 上傳系統空白頁 | 修改 index.html 後未重新部署 | Code.gs 存檔即生效；index.html 修改需重新部署 |
| 資料夾清單出現重複項目 | 上傳失敗時重試建立了重複資料夾，加上快取 TTL 過長（3600s）未更新 | 在 Drive 刪除多餘資料夾後執行 clearFolderCache()；CACHE_TTL 改為 300s |
| 上傳出現「請填寫完整資訊」但已選檔案 | subCat 欄位為空（未點選或輸入資料夾名稱）；且原本 hash 參數解析函式遺失 | 補回 parseHashParams/applyHashParams；驗證改為精確列出缺少欄位 |
| Word 下載按鈕失效 | async function 未被衝突偵測抓到，5 模組共用同一函式 | build.py 正則改為 `^(?:async\s+)?function\s+` |
| Drive MCP 找不到資料夾 | MCP 連接的帳號非資料夾擁有者 | 改用本機 SQLite DB 讀取資料夾 ID |
| Windows /tmp/ 路徑錯誤 | build.py 寫死 Linux 路徑 | 改用 `os.environ.get('TEMP', '.')` |
| PowerShell 不支援 `&&` | Windows PowerShell 5.1 限制 | 改用 `;` 或分開執行 |

---

## 換年度更新步驟（下次參考）

1. 在新年度 Google Drive 資料夾下，依 30 個子標各建「文件上傳」與「參考資料」
2. 更新 `_patch_drive_urls.py` 與 `_patch_ref_urls.py` 的父資料夾路徑
3. 執行 `python _get_drive_ids.py` 取得新資料夾 ID
4. 執行 `python _patch_drive_urls.py` 與 `python _patch_ref_urls.py` 更新 index.html
5. `git add → commit → push`
6. 用學校帳號在 Apps Script 執行 `setFolderPermissions` 與 `setRefFolderPermissions`
7. 更新 `SCAN_FOLDERS` 裡的 30 個資料夾 ID
8. 執行 `setupDailyTrigger` 重設觸發器
9. 更新 Code.gs 的 `CONFIG.YEARS` 加入新學年度
