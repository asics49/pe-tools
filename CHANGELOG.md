# 右昌國小體育班評鑑文件工具 — 開發筆記

## 專案說明

各模組為獨立 HTML 單一檔案，透過 `build.py` 合併成 `pe-class-tools.html`，部署於 GitHub Pages。

- 線上網址：https://asics49.github.io/pe-tools/pe-class-tools.html
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

## 待辦 / 未來計畫

- [ ] （待補充）
