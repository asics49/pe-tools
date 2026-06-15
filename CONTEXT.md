# 體育班評鑑模組開發 — 專案脈絡總覽

> 最後更新：2026-06-15
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
└── pe-class-tools.html     ← 5 個文件產生模組（build.py 合併）

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

### Apps Script 檔案（script.google.com，asics49@gmail.com）
| 檔案 | 說明 |
|------|------|
| `Code.gs` | 上傳邏輯、Drive 掃描、記錄寫入 Sheet |
| `index.html` | 上傳系統前端介面 |

---

## Apps Script Code.gs 主要函式

| 函式 | 說明 |
|------|------|
| `doGet()` | 回傳上傳系統 HTML 頁面 |
| `getConfig()` | 回傳學年度清單給前端 |
| `getFolders(year, type, sport)` | 取得 Drive 子資料夾清單（有快取） |
| `uploadFileById(...)` | 用資料夾 ID 直接上傳（快速路徑） |
| `uploadFile(...)` | 用完整路徑上傳（相容舊版） |
| `logUpload(info)` | 上傳成功後寫入 Sheet「上傳記錄」 |
| `scanDriveFolders()` | 掃描 30 個評鑑文件資料夾，寫入「Drive掃描記錄」 |
| `setupDailyTrigger()` | 設定每日 08:00 自動執行 scanDriveFolders |
| `getOrCreateFolder(parent, name)` | 取得或建立子資料夾 |

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
