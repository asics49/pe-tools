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
