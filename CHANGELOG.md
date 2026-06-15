# 右昌國小體育班評鑑文件工具 — 開發筆記

## 專案說明

各模組為獨立 HTML 單一檔案，透過 `build.py` 合併成 `pe-class-tools.html`，部署於 GitHub Pages。

- 評鑑總覽：https://asics49.github.io/pe-tools/
- 工具頁面：https://asics49.github.io/pe-tools/pe-class-tools.html
- GitHub Repo：https://github.com/asics49/pe-tools

---

## 模組清單

| 模組ID | 標籤 | 檔案 |
|--------|------|------|
| m1 | 照片佐證資料 | photo-doc-generator.html |
| m2 | 補課紀錄表 | makeup-class-record.html |
| m3a | 成果報告表頭 | result-report-header.html |
| m3b | 開課課程一覽 | course-overview.html |
| m4 | 職業試探活動 | career-activity.html |

---

## 版本紀錄

### v1.3 — 2026-06-15
- **新增：評鑑總覽頁面（index.html）**
  - 依壹/貳/肆大指標分組，列出 89 筆評鑑文件
  - 負責人員篩選列，點選人員只顯示該人負責的項目
  - 頂部模組卡片列，快速開啟各工具分頁
  - 每筆文件提供三個按鈕：金色「使用工具」、綠色「上傳文件」、藍色「參考資料」
- **新增：Google Drive 資料夾整合**
  - 在評鑑資料夾下各子標新建「文件上傳」與「參考資料」子資料夾（共 34 × 2 = 68 個）
  - 使用 `_get_drive_ids.py` 從本機 Google Drive SQLite 資料庫自動讀取資料夾 ID
  - 使用 `_patch_drive_urls.py` / `_patch_ref_urls.py` 批次填入 index.html
  - 提供 `_set_drive_permissions.gs` / `_set_ref_permissions.gs`（Google Apps Script）
    批次設定上傳資料夾（編輯）與參考資料夾（檢視）限學校網域帳號存取
- **新增：工具頁面回首頁按鈕**
  - pe-class-tools.html 左上角加入「← 回評鑑總覽」按鈕
- **新增：URL hash 分頁導航**
  - pe-class-tools.html 支援 `#m1`～`#m4` hash，從總覽頁點「使用工具」直接跳到對應分頁

### v1.1 — 2026-06-15
- **修正：下載 Word 檔按鈕無效**
  - 症狀：各模組填好資料後，點「下載 Word 檔」無反應或下載錯誤模組的內容
  - 原因：`build.py` 偵測衝突函式的正則 `^function\s+` 只抓同步函式，`generateDocx` 宣告為 `async function`，因此未被偵測為衝突函式，合併後 5 個模組共用同一個函式名稱，點任何模組的按鈕都只執行第一個模組的邏輯
  - 修正：將正則改為 `^(?:async\s+)?function\s+`，使 `async function` 也納入衝突偵測，重新 build 後各模組按鈕正確對應 `m1_generateDocx`、`m2_generateDocx`… 等獨立函式
  - 修改檔案：`build.py` 第 141 行

### v1.0 — 2026-06-15
- 初版發布
- 包含模組 m1～m4（共 5 個分頁）
- 部署至 GitHub Pages

---

## 新增模組步驟

1. 把新模組 HTML 放在同一目錄
2. 在 `build.py` 的 `FILES` 清單新增一行
3. 在 `CONFLICT_VARS` 新增該模組的衝突變數
4. 執行 `python build.py`
5. `git add → commit → push`

---

## 換年度更新步驟

每學年度開始時執行以下步驟更新所有 Drive 連結：

1. 在新年度資料夾下依子標建立「文件上傳」與「參考資料」子資料夾
2. 更新 `_patch_drive_urls.py` 與 `_patch_ref_urls.py` 的父資料夾路徑
3. 執行 `python _get_drive_ids.py` 取得新資料夾 ID
4. 執行 `python _patch_drive_urls.py` 與 `python _patch_ref_urls.py` 更新 index.html
5. `git add → commit → push`
6. 在 Google Apps Script 執行 `setFolderPermissions` 與 `setRefFolderPermissions` 設定權限

## 待辦 / 未來計畫

- [ ] 撰寫一鍵換年度腳本（`new-year-setup.py`），整合建資料夾、讀 ID、更新 HTML、產出 .gs 全流程
