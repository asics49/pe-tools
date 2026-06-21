# 體育班評鑑模組開發 — 專案脈絡總覽

> 最後更新：2026-06-21

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
├── pe-class-tools.html     ← 6 個文件產生模組（build.py 合併）
├── guide.html              ← 工具使用說明（含左側導覽、Q&A）
└── leave-record.html       ← m5 學生公假統計表模組原始檔

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
| `pe-class-tools.html` | 6 模組合併頁，由 build.py 產生 |
| `guide.html` | 工具使用說明網頁，含左側導覽列、折疊 Q&A、手機響應式 |
| `leave-record.html` | m5 學生公假統計表模組原始檔 |
| `build.py` | 合併腳本，偵測衝突函式並加前綴 |
| `CHANGELOG.md` | 版本紀錄 |
| `CLAUDE.md` | 本文件（專案脈絡） |

### 本機輔助腳本（未 commit，僅本機使用）
| 檔案 | 說明 |
|------|------|
| `_get_drive_ids.py` | 讀本機 Google Drive SQLite DB，列出「文件上傳」資料夾 ID |
| `_get_ref_ids.py` | 同上，列出「參考資料」資料夾 ID |
| `_patch_drive_urls.py` | 批次將 driveUrl 填入 index.html（89 筆） |
| `_patch_ref_urls.py` | 批次將 refUrl 填入 index.html（89 筆） |
| `_schema.py` | 資料結構定義 |
| `_gen_guide.js` | 產生 Word 版使用說明 |

### Apps Script 檔案（script.google.com，asics49@gmail.com）
| 檔案 | 說明 |
|------|------|
| `Code.gs` | 上傳邏輯、Drive 掃描、記錄寫入 Sheet、快取管理 |
| `index.html` | 上傳系統前端介面 |

---

## build.py 合併機制

- `FILES`：模組清單，格式 `(id, badge, name, source_html)`
- `CONFLICT_VARS`：各模組需重新命名的變數，如 `{'rows': 'rows_m5'}`
- `SHARED_CONSTS`：跨模組共用的 `const`，`dedup_consts()` 只保留第一份（僅支援 `const`，不支援 `var`）
- `apply_renames()`：對整個模組原始碼做字串取代（含 HTML onclick 屬性）
- 外部 CDN 腳本需加在 build.py 殼層 HTML 的 `<head>` 裡（模組的 `<script src>` 會被忽略）

已加入殼層的 CDN：JSZip、FileSaver.js、SheetJS (xlsx.full.min.js)

---

## 模組清單（pe-class-tools.html）

| ID | 名稱 | 來源檔 | 對應評鑑項目 |
|----|------|--------|------------|
| m1 | 成果報告書頁首 | result-report-header.html | 1-1 |
| m2 | 照片成果文件 | photo-doc.html | 各子標 |
| m3a | 課程規劃表 | curriculum-plan.html | 體育課規劃 |
| m3b | 訓練計畫 | training-plan.html | 術科訓練 |
| m4 | 學習護照 | learning-passport.html | 學生紀錄 |
| m5 | 公假統計表 | leave-record.html | 2-1-3 田徑/足球團隊公假統計表 |

---

## m5 學生公假統計表（2026-06-21 新增）

### 功能
- **基本資訊**：學年度、運動類別（田徑/足球）
- **Excel 匯入**（SheetJS）：自動偵測欄位（年級、姓名、比賽名稱、日期等）
- **日期區間解析**：`2025/10/7-10/9`、ROC 年（< 1000 自動 +1911）
- **全選/批次刪除**：表頭 checkbox + 刪除選取按鈕
- **學校 LOGO**：預設右昌國小校徽，可自訂上傳；Word 頁首左側顯示
- **Word 輸出**：
  - 頁首（每頁自動重複）：LOGO 置左 + 大標題置中（高雄市右昌國小體育班學生公假統計表）
  - 依年級分頁，每頁含副標題（學年度/類別/年級）與統計表格

### Word XML 重點
- 頁首使用 `word/header1.xml` + `word/_rels/header1.xml.rels`
- 圖片 content type 需在 `[Content_Types].xml` 宣告（`jpeg`/`png`）
- EMU → DXA 換算：除以 635（非 914.4）
- `w:hdr` 需宣告 `xmlns:a` 與 `xmlns:pic` namespace

### build.py 設定
```python
FILES: ('m5', '模組五', '公假統計表', 'leave-record.html')
CONFLICT_VARS m5: {'rows': 'rows_m5', 'nextId': 'nextId_m5'}
SHARED_CONSTS: DEFAULT_LOGO_DATAURL, DEFAULT_LOGO_WIDTH, DEFAULT_LOGO_HEIGHT
```

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

## index.html 按鈕邏輯

```
每筆文件有三個按鈕：
├── 金色「使用工具」  → pe-class-tools.html#m1~m5（有對應模組才顯示）
├── 綠色「上傳文件」  → doc.uploadSystemUrl（若有）或 doc.driveUrl
└── 藍色「參考資料」  → doc.refUrl
```

目前 `uploadSystemUrl` 只有 1-1 子標的 2 筆文件有設定（測試用），其餘 87 筆仍連到 Drive 資料夾。

模組卡片列（頁面頂部）目前共 8 張：m1～m5（6 張）、體育組資料上傳（綠色）、工具使用說明（紫色）。

---

## Google Drive 資料夾權限設定

| 資料夾類型 | 權限設定 |
|-----------|---------|
| 文件上傳（30 個） | 學校網域帳號 + 知道連結可編輯 |
| 參考資料（30 個） | 學校網域帳號 + 知道連結可檢視 |
| asics49@gmail.com | 已加為文件上傳資料夾的 Viewer（供掃描腳本讀取） |

---

## 目前執行狀態

### 已完成
- [x] 6 個評鑑文件模組（m1～m5）
- [x] build.py 合併腳本（含 async function 衝突偵測、CDN 殼層）
- [x] index.html 評鑑總覽（89 筆文件、篩選、模組卡片）
- [x] 30 個子標各建立「文件上傳」與「參考資料」子資料夾
- [x] index.html 89 筆文件全部填入 driveUrl 與 refUrl
- [x] pe-class-tools.html URL hash 分頁導航
- [x] 體育組資料上傳系統（Apps Script）
- [x] 上傳記錄 Google Sheet
- [x] Drive 掃描腳本（每日自動掃描 30 個資料夾）
- [x] guide.html 工具使用說明網頁
- [x] m5 學生公假統計表（Excel 匯入、日期解析、全選刪除、Word 頁首 LOGO）

### 待辦
- [ ] **Drive 掃描權限**：需用學校帳號執行 `grantAccessToGmail`（目前掃描結果全為「無法存取資料夾」）
- [ ] **參考資料夾權限**：`setRefFolderPermissions` 尚未執行
- [ ] **測試版確認**：1-1 子標兩筆文件的上傳系統流程，確認後全面套用至 87 筆
- [ ] **新年度更新腳本**：撰寫 `new-year-setup.py`

---

## 已知問題與決策記錄

| 問題 | 原因 | 解法 |
|------|------|------|
| Drive 掃描顯示「無法存取資料夾」 | Apps Script 用個人帳號，資料夾限學校網域 | 用學校帳號執行 grantAccessToGmail |
| PowerShell 讀 UTF-8 檔案中文損毀 | PS 5.1 Get-Content 預設 cp950 編碼 | 一律改用 node 腳本讀寫含中文的檔案 |
| build.py `dedup_consts` 只支援 `const` | 正規表示式只抓 `const` 宣告 | 跨模組共用常數必須用 `const`（不能用 `var`） |
| Word 下載按鈕失效 | async function 未被衝突偵測抓到 | build.py 正則改為 `^(?:async\s+)?function\s+` |
| 模組外部 CDN 不生效 | build.py 只取內聯 `<script>`，忽略 `<script src>` | CDN 加到 build.py 殼層 HTML 的 `<head>` |
| Word 頁首圖片不顯示 | EMU→DXA 算錯（/914.4 應為 /635）；缺 jpeg content type | 修正換算；補 `[Content_Types].xml` |

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
