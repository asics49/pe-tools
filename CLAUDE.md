# 體育班評鑑模組開發 — 專案脈絡總覽

> 最後更新：2026-07-18（晚間）

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
├── index.html              ← 評鑑總覽（89 筆文件）+ 頂部模組卡片列 + 進度備份匯出/匯入
├── pe-class-tools.html     ← 9 個文件產生模組（build.py 合併）
├── guide.html              ← 工具使用說明（含左側導覽、Q&A）
├── file-size-check.html    ← 檔案大小檢查工具（獨立頁，webkitdirectory 本機掃描）
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
| `index.html` | 評鑑文件總覽，89 筆文件，含篩選、模組卡片列（15 張，可捲動+左右箭頭）、三色按鈕、進度備份匯出/匯入 |
| `pe-class-tools.html` | 10 模組合併頁，由 build.py 產生 |
| `guide.html` | 工具使用說明網頁，含左側導覽列、折疊 Q&A、手機響應式（模組說明已更新至 10 個模組） |
| `file-size-check.html` | 檔案大小檢查工具（獨立頁，非 build.py 合併）；webkitdirectory 就地掃描評鑑資料夾，以子標資料夾加總大小、標示總計超過 5MB 者 |
| `leave-record.html` | m5 學生公假統計表模組原始檔 |
| `grade-record.html` | m6 學習輔導補助成績登錄模組（已整合進 pe-class-tools.html）|
| `年度訓練計畫表.html` | m7 年度訓練計畫模組原始檔 |
| `器材檢核表.html` | m8 體育器材安全檢核表模組原始檔 |
| `cloud-link-page.html` | m9 雲端連結頁產生器模組原始檔 |
| `pdf-to-jpg.html` | m10 PDF轉JPG／壓縮模組原始檔 |
| `build.py` | 合併腳本，偵測衝突函式並加前綴 |
| `.nojekyll` | 讓 GitHub Pages 跳過 Jekyll 處理 |
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

已加入殼層的 CDN：JSZip、FileSaver.js、SheetJS (xlsx.full.min.js)、ExcelJS (4.4.0)、PDF.js (3.11.174)、Chart.js (4.4.1)、qrcodejs (1.0.0)、html2canvas (1.4.1)、jsPDF (2.5.1)

---

## 模組清單（pe-class-tools.html）

| ID | 名稱 | 來源檔 | 對應評鑑項目 |
|----|------|--------|------------|
| m1 | 照片佐證資料 | photo-doc-generator.html | 各子標（照片佐證） |
| m2 | 補課紀錄表 | makeup-class-record.html | 3-1-1 賽後補課 |
| m3a | 成果報告表頭 | result-report-header.html | 1-1 |
| m3b | 開課課程一覽 | course-overview.html | 體育課規劃 |
| m4 | 職業試探活動 | career-activity.html | 3-4 生涯發展 |
| m5 | 公假統計表 | leave-record.html | 2-1-3 田徑/足球團隊公假統計表 |
| m6 | 成績登錄 | grade-record.html | 學習輔導補助學生成績登錄 |
| m7 | 年度訓練計畫 | 年度訓練計畫表.html | 運動代表隊年度訓練計畫表 |
| m8 | 器材檢核表 | 器材檢核表.html | 3-1-2 體育班設備器材管理維護及更新 |
| m9 | 雲端連結頁產生器 | cloud-link-page.html | 通用（檔案超過平台上傳限制時使用） |
| m10 | PDF轉JPG／壓縮 | pdf-to-jpg.html | 通用（PDF 逐頁轉圖片／整份重新壓縮） |

---

## m1 photo-doc-generator.html 照片佐證資料（2026-07-10～16 多次擴充）

### 功能
- **每列照片數量版面**（`LAYOUT_PRESETS`）：1=每列1張大圖、2=每列2張2排、3=每列2張3排、
  4=**每頁2張（大圖）**——`cols`（每列欄數）與 `blocks`（預設區塊數）的組合已經通用支援「每頁 N 張」，
  `getMaxImgHeightEmu()` 只依 `targetBlocks/cols` 這個固定比例算圖片最大高度，**不受使用者實際新增的
  照片張數影響**，所以不管加減幾張，每頁的排版永遠正確符合一張 A4（已用 2→5 張測試，圖片高度數值不變）
- **說明文字獨立成下方儲存格**（2026-07-16 全版面統一）：不論哪種版面，說明都放在照片格「下方」另一列
  （`photoCells`／`captionCells` 兩陣列交錯成列，Word 輸出列結構為「照片列/說明列」交錯，如 PCPCPC），
  不再與照片擠在同一格
- **一次匯入多張照片**（`onBatchPhotos`，2026-07-16 新增）：多選檔案依序填入未使用區塊、不足自動新增；
  先同步「預先保留目標區塊」（`_reserved` 旗標）確保各檔非同步載入完成後仍維持選檔順序
- **匯入 Word 檔重新排版**（`importDocxFile`，2026-07-16 新增）：讀取本工具或同格式產出的 .docx，
  依 `<w:tc>` 儲存格順序解析照片（`r:embed` 對照 `document.xml.rels`）與「說明：」文字回填成區塊
  （圖片格開新區塊、文字格 FIFO 補說明、同格圖+文也支援），**頁首標題一律以檔內 header 標題覆蓋**
  文件標題欄（2026-07-16 從「只在空白時帶入」改為一律覆蓋）；匯入後可改任一版面重新排版
- **照片大小調整滑桿**（`photoScale`，2026-07-16 新增）：50%~100%，預覽與 Word 輸出共用，縮小可在
  同頁塞更多列
- **照片自動縮圖**（`MAX_IMG_EDGE=1600`，2026-07-16 效能修復）：單張/批次/Word 匯入的照片一律先縮到
  長邊 1600px（`resizeDataUrl`/`fileToResizedImage`）再存，避免手機原圖（4~8MB/張）幾十張全塞記憶體
  讓頁面卡死；說明輸入的預覽重繪改 300ms 延遲（`schedulePreview`）不再每鍵整份重畫
- **區塊操作**：旋轉（canvas 順時針 90 度，**不做自動判別方向**，一律手動）、上移、下移、
  **在此區塊下方插入**（`insertBlockAfter`，2026-07-16）、刪除；底部「新增照片區塊」旁可**一次新增
  多個區塊**（`addBlocks`，數量輸入框 1~30，2026-07-16）
- **頁首標題單行修復**（2026-07-16，同 m5 修法）：有 LOGO 時右側留白欄原本鏡射 LOGO 欄寬把標題欄擠窄，
  改右側固定 500dxa、標題欄用剩餘寬度，長標題才不會被擠成兩行
- **照片統一比例置中裁切**（2026-07-16 下午）：Word 輸出時全部照片用 OOXML `<a:srcRect>` 置中裁切成
  同一比例（值為 per-millage，100000=100%；裁切只影響顯示區域、不改原圖檔）。比例自動偵測：
  上傳照片中**直向（h>w）過半→全部 3:4**，否則全部 4:3（最初固定 4:3，直向照片被硬轉橫向很怪，
  改為多數決）
- **每頁張數強制換頁**（2026-07-16 下午）：每滿 `targetBlocks` 張在下一張照片段落加
  `<w:pageBreakBefore/>`。原因：「每列2張2排(4張/頁)」與「每列2張3排(6張/頁)」都是 cols=2，
  唯一差別靠圖片高度預算控制，但**橫向照片寬度先被欄寬卡住**（兩版面算出的圖幾乎同尺寸
  8.84 vs 8.81cm），高度差被吃掉 → 選 2排實際輸出變 3排。強制換頁後各版面每頁張數才真正不同
- **照片列最小列高＋垂直置中**（2026-07-16 下午）：承上，橫向照片實際高度（~6.6cm）遠小於每排
  可用高度預算（~10.9cm），空白全堆頁尾。照片列設 `w:trHeight`（=每排預算 `maxImgHeightEmu/635` dxa，
  `hRule="atLeast"`）+ 照片格 `w:vAlign center`，把剩餘空白平均分配到各排、版面撐滿整頁
- **清除全部按鈕**（2026-07-16 下午，`resetAllBlocks`）：一鍵清照片/說明/文件標題，區塊數回到目前
  版面初始值；有內容時先 confirm

### build.py 設定
```python
FILES: ('m1', '模組一', '照片佐證資料', 'photo-doc-generator.html')
CONFLICT_VARS m1: {'logo': 'logo_m1', 'nextId': 'nextId_m1', 'cols': 'cols_m1',
                   'targetBlocks': 'targetBlocks_m1', 'blocks': 'blocks_m1'}
```

### 已知 bug 修復記錄（皆為合併後才會出現的 class/字串撞名問題，值得記住）
- **預覽格線版面失效**：JS 用字串組合 `'preview-grid cols-' + cols` 產生 class name，`build.py` 幫
  `cols` 變數改名成 `cols_m1` 時，因為 `\bcols\b` 正規表示式把連字號視為單字邊界，連字串常數裡的
  `cols-` 都被誤判成同一個變數名稱，錯誤置換成 `cols_m1-1`，導致 CSS 選擇器 `.preview-grid.cols-1`
  完全對不上
  - **修復**：class 名稱改用不含變數字面的 `grid-c` 前綴（`grid-c1`/`grid-c2`/`grid-c3`）
- **旋轉／上移／下移／刪除按鈕全部隱形**：`.icon-btn` 這個 class 名稱同時被 career-activity.html
  （m4）定義了一份完全不同用途的樣式（白色圖示 + 半透明白底，是設計給 m4 自己的深色卡片背景用），
  build.py 把所有模組 CSS 串接成同一份，m4 排在 m1 後面，層疊時 m4 的版本蓋掉 m1 的，導致這幾個按鈕
  變成「白色圖示疊在白色背景」，實質上完全隱形（用 `getComputedStyle` 量測 color/background 皆為
  `rgb(255,255,255)` 才抓到，肉眼／看程式碼都看不出來）
  - **修復**：改用模組專屬的 `.m1-icon-btn`，避免撞名
  - **教訓**：合併版裡任何「通用命名」的 class（`.icon-btn`、`.card`、`.wrap`……）都有撞名風險；
    純外觀異常（顏色錯、看不到東西）不一定是渲染 bug，優先懷疑 CSS 層疊被其他模組覆蓋，直接用
    `getComputedStyle` 量測實際套用的顏色/背景，不要用肉眼或字元編碼去猜

---

## m5 學生公假統計表（2026-06-21 新增）

### 功能
- **基本資訊**：學年度、運動類別（田徑/足球）
- **Excel 匯入**（SheetJS）：自動偵測欄位（年級、姓名、比賽名稱、日期等）；**下載 Excel 範例檔**
  （2026-07-11 新增，`downloadTemplate()`）產生含正確欄位標題、西元/民國年範例列、填寫說明的
  `.xlsx`，已測試匯入回系統可正確解析兩種年份格式
- **日期區間解析**：`2025/10/7-10/9`、ROC 年（< 1000 自動 +1911）
- **全選/批次刪除**：表頭 checkbox + 刪除選取按鈕
- **學校 LOGO**：預設右昌國小校徽，可自訂上傳；Word 頁首左側顯示
- **各年級統計列與核章欄**（2026-07-11 新增，參考「115年度…公假統計表 足球.docx」範例格式）：
  - **班級學生總數**：無法從公假名單反推（沒請假的學生不會出現在名單裡），由使用者在預覽區塊
    手動輸入，存進 `gradeTotals[grade]`
  - **公假人數**：依「學生姓名」自動去重計算（`computeLeaveSummary()`），同一學生多筆競賽紀錄只算一人
  - **公假比率**：有輸入總人數才自動算百分比，否則顯示範例中的公式提示文字（不會出現 NaN）
  - 統計列在 Word 表格最下方用 `gridSpan` 合併 3 組儲存格（學生總數/公假人數/比率各佔 2 欄）
  - 每個年級表格下方新增核章列「體育組長　　學務主任　　校長」，文字與間距比照範例
- **Word 輸出**：
  - 頁首（每頁自動重複）：LOGO 置左 + 大標題置中（高雄市右昌國小體育班學生公假統計表）
  - 依年級分頁，每頁含副標題（學年度/類別/年級）、統計表格（含統計列）、核章列

### Word XML 重點
- 頁首使用 `word/header1.xml` + `word/_rels/header1.xml.rels`
- 圖片 content type 需在 `[Content_Types].xml` 宣告（`jpeg`/`png`）
- EMU → DXA 換算：除以 635（非 914.4）
- `w:hdr` 需宣告 `xmlns:a` 與 `xmlns:pic` namespace
- 頁首標題「高雄市右昌國小體育班學生公假統計表」（17字）原本用左右對稱留白欄置中標題，
  可用寬度只有 4538dxa，20pt 下 17 字需要 6800dxa，必定跑兩行；**修復**：右側留白欄改用小固定
  寬度（500dxa，不再鏡射 LOGO 寬度）+ 字級微調（40→34半點），標題欄可用寬度變成 6588dxa，
  已用 canvas 量測實際字型寬度（385px）確認在欄寬（439px）內能一行顯示完畢

### build.py 設定
```python
FILES: ('m5', '模組五', '公假統計表', 'leave-record.html')
CONFLICT_VARS m5: {'rows': 'rows_m5', 'nextId': 'nextId_m5'}
SHARED_CONSTS: DEFAULT_LOGO_DATAURL, DEFAULT_LOGO_WIDTH, DEFAULT_LOGO_HEIGHT
```

---

## m6 grade-record.html 學習輔導補助成績登錄（2026-06-24 整合為 m6，2026-07-12 大幅擴充）

### 功能
- **基本設定**：補助計畫學年度（114 起下拉，含「其他」自行填入）
- **4 個評量期別**：上學期期中（s1m）、上學期期末（s1f）、下學期期中（s2m）、下學期期末（s2f）
- **成績檔批次匯入**（`importScoreFiles`，2026-07-12 改寫）：PDF／Excel 混合皆可拖放，依檔名自動判斷
  期別（上/下 + 期中/期末，`detectEvalKey`）；兩種格式共用 `matchScoreHeaderRow()` 標題列比對邏輯——
  掃描前幾列找出含「姓名」的標題列，依標題文字（姓名/年級/國文/英文/數學/社會/自然）定位各欄，
  欄位順序不拘、欄名可帶「-1」等後綴（用 `.test()` 子字串比對）
- **拖放區自動辨識全學年檔**（2026-07-18 新增）：拖放的 Excel 若檔名判斷不出期別
  （`detectEvalKey` 回 null），`importScoreFiles` 自動改走 `parseFullYearExcel` 全學年格式解析
  （合併邏輯抽成共用 `applyFullYearEntries`），成功即匯入、失敗才警告「無法判斷期別…也不符合
  全學年成績檔格式」。緣起：使用者把本工具匯出的「114學年度6年級成績登錄.xlsx」拖進拖放區被拒收
  （檔名無上/下+期中/期末），又誤按「Excel 匯入名單」（只讀姓名年級）以為成績匯入壞掉
- **全學年成績檔匯入**（`importFullYearFile`／`parseFullYearExcel`，2026-07-12 新增）：可直接匯入已含
  四期成績的整年度 Excel（格式同本工具匯出檔：學生姓名/年級 + 四期×國文英文數學社會自然/班名次/年名次
  寬表格）。解析邏輯：先找出含「姓名」的標題列（該列同時含合併儲存格的期別名稱，如「上學期期中評量」），
  對該列做「向右填補」把合併儲存格的期別名稱套用到其後所有欄，再用下一列（科目標題列）比對各欄對應的
  科目/名次欄位，組出 `{ci: {evalKey, field}}` 的欄位映射表，逐列讀取資料
- **手動新增**：輸入姓名 + 年級，Enter 快速新增
- **成績輸入**：每位學生 4 組各 7 欄（國文、英文、數學、社會、自然、班名次、年名次），輸入框皆有專屬
  `id="sf-{studentId}-{evalKey}-{field}"` 方便程式直接更新單一欄位（不必整份重繪，避免打字時失焦）
- **班名次／年名次自動計算**（`computeRanks(evalKey)`，2026-07-12 新增）：成績檔本身不含名次資料，
  改由系統依五科總分（國文+英文+數學+社會+自然，需全數為有效數字才列入排名）計算：
  - 班名次＝全部目前名單（不分年級）排名
  - 年名次＝依 `grade` 分組後組內排名
  - 皆採標準名次規則（同分並列同名次，下一名次跳號，如 1,1,3）
  - 匯入成績後自動對受影響的 `evalKey` 重新計算（會覆蓋檔案內原有名次數字）；分數輸入框
    `oninput` 若欄位是五科之一也會觸發重算；另提供「🔄 重新計算名次」按鈕手動觸發全部 4 期
- **未達 60 分標示**（2026-07-12 新增）：預覽表任何五科分數 < 60 的儲存格加紅底樣式（`td.low`），
  並在表格上方 `#lowScoreBox` 列出所有未達 60 分紀錄（姓名＋期別＋科目＋分數），方便掌握需輔導名單
- **即時預覽**：輸入後表格即時更新
- **Excel 輸出**（SheetJS）：3 列標題（學年度合併、4 期別分組、科目）+ 資料列
- **成績預警通知單 Word 下載**（2026-07-17 新增，`downloadWarningNotices`／`collectWarningNotices`）：
  掃描全部學生×4期別，任一科（國英數社自）<60 即產生一份獨立通知單（**單次評量獨立發放、
  不跨考次合併**），文字比照「體育班成績預警通知單」範例（參賽基準說明／輔導機制3項／
  導師+教練簽章欄），同頁下方含 ✂ 家長回執聯（勾選意願、意見欄、家長簽章）；標題「**成績未達預警通知單**」
  （2026-07-18 從原「學力支持與輔導專案預警通知單」改；`<title>`/檔名仍用「體育班成績預警通知單」）；
  考次名稱用 `EXAM_LABEL` 對照（上學期→「114學年度**第一學期**期中/期末評量」、下學期→「**第二學期**」，
  與 m6 分頁上顯示的 EVALS 標籤「上學期／下學期」不同）；.doc（HTML 格式）標楷體 A4，年級自動轉中文
  （六年級體育班），檔名含學年度與「N生M份」；用原生 anchor 下載——**單機版 grade-record.html 沒載
  FileSaver，不能用 saveAs**
- **一份一頁不跨頁**（2026-07-18 修，兩階段）：①單份內容過高溢頁 → 版面壓緊（頁邊 16→12mm、
  字級/行距/段距/回執聯收斂、簽章列與意願項改單行），離屏 iframe 依 A4 內容寬（178mm）量測最壞情況
  （五科全不及格）渲染高 215mm < 可用高 273mm；②**div 上的 page-break CSS 在 Word 會把整份拆散**
  （`<div style="page-break-before:always">` + `page-break-inside:avoid` 實測：Word 把 break 錯套到
  div 內多個段落，第二份起變成標題一頁、考次表一頁、說明又一頁）→ 改用 Word 標準換頁寫法：份與份
  之間插 `<br clear=all style='mso-special-character:line-break;page-break-before:always'>`，
  div 完全不掛 page-break。**教訓：.doc（HTML）要換頁只能用 mso br 或 `<p>` 層級的
  page-break-before，千萬別放在 `<div>` 容器上**
- **回執聯勾選項與版面加大填滿**（2026-07-18 新增）：家長勾選意願項目增至 3 項（新增「無法配合，
  擬自行補救加強」），每項獨立一列；本文字級/行距/段距整體放寬（12pt、行距1.6、標題17pt）填滿頁面
  留白。**勾選項文字被拉散成「家　長　勾　選…」**：原因是 `.body` 用 `text-align:justify`，Word
  對「以換行符結尾的行」會強制左右對齊、把整行字距撐開——修法是勾選項改獨立的 `.opt`（靠左對齊），
  不共用 `.body` 的 justify。家長意見回饋欄（`.write`，行距2.4，兩行）與簽章列（`.sign`，上距8pt）
  分開設定行距，書寫空間足夠；每次調整都用離屏 iframe 依 A4 內容寬（178mm）量測最壞情況（五科全
  不及格）確認 ≤ 273mm 可用高，未跨頁
- **自動儲存**（2026-07-18 新增，key `peGradeRecordData`）：讓老師**每次段考匯入即累積、不必年底
  一次彙整**。`saveGradeState()` 掛在 `renderPreview()` 開頭（所有資料異動的匯流點，含 customYear
  oninput），debounce 400ms 寫 localStorage；重開頁面 `loadGradeState()`（script 尾端頂層呼叫）自動
  還原學年度＋學生成績；名單清空時改為移除 key（不存空資料）。`_gradeLoaded` 旗標防止「還原完成前
  的 render 把舊資料蓋成空」。基本設定卡片有儲存狀態提示（含時間）＋「📤 匯出備份／📥 匯入備份
  （JSON，覆蓋前 confirm）／🗑 清除全部資料」；跨電腦搬移用備份檔（localStorage 依網址+瀏覽器隔離，
  同 index.html 追蹤功能的已知特性）

### 設計決策
- 所有學生統一顯示 4 期別欄位（不區分前後測新舊生）
- `detectEvalKey(filename)` 依「上+期中/上+期末/下+期中/下+期末」判斷 s1m/s1f/s2m/s2f；全學年匯入則另有
  `detectPeriodKeyFromText(text)` 比對儲存格內容（而非檔名）中的同組關鍵字
- SheetJS 免費版，合併儲存格可用但無法設定儲存格樣式（顏色、框線）
- 「班」與「年」在資料模型中沒有獨立的班級欄位（只有 `grade`），因此若只匯入單一班級的資料，
  班名次與年名次數值會相同；只有當名單裡混合多個年級（多班合併）時兩者才會出現差異

### build.py 設定
```python
FILES: ('m6', '模組六', '成績登錄', 'grade-record.html')
CONFLICT_VARS m6: {'students': 'students_m6', 'nextId': 'nextId_m6', 'FIELDS': 'FIELDS_m6', 'EVALS': 'EVALS_m6'}
CONFLICT_IDS（2026-07-12 新增）: lowScoreBox, fullYearFile
CDN 殼層：PDF.js (cdnjs 3.11.174)
```

### 已知 bug 修復記錄
- leave-record.html 缺少 1 個 `</div>`（`.wrap` 未閉合）→ panel_m5 未正確關閉 → panel_m6 嵌套在 panel_m5 內 → m6 分頁空白
  - **修復**：在 `</div>` (line 198) 後補一個 `</div>` 閉合 `.wrap`
- **PDF 成績解析完全套用錯誤欄位格式**（2026-07-12）：原本 `parsePdfFile` 假設「3碼班級代碼+2碼座號+
  小數成績」的版面，是憑空設計、從未拿真實檔案測試過；實際校方 PDF 是「座號/姓名/年級/國文/英文/數學/
  社會/自然」整數成績表，欄位完全對不上，導致用真實檔案匯入必定「未找到成績資料」
  - **修復**：PDF 與 Excel 改用同一套 `matchScoreHeaderRow()` 標題列比對邏輯，不再假設固定欄位順序
  - **教訓**：任何檔案解析邏輯（PDF/Excel/CSV）務必用「使用者實際會上傳的真實檔案」測試，不能只憑
    欄位命名合理猜測版面；沒有真實樣本前，寧可先問使用者要一份範例檔
- **PDF 逐行分組過嚴導致部分學生列被拆成亂碼列**（2026-07-12）：`parsePdfFile` 原本用「y 座標四捨五入
  到 3 的倍數」把文字方塊分組成表格列，但同一列不同欄位的文字基線常相差 2~3 單位（例如姓名和其後的
  分數落在 y=687 與 y=684），四捨五入邊界不穩定，導致部分列被誤拆成兩列（姓名獨立一列、分數獨立一列），
  解析出「98」「5」等亂碼姓名，且學生總數少於實際筆數（26 筆漏抓成 19 筆）
  - **修復**：改用「鄰近值分群」（依 y 由大到小排序後，逐一比較與目前分組的 y 差距，若 <= 8 視為同一
    列，否則另開新群），大幅提高容錯，測試 22 筆真實資料全部正確分組
  - **教訓**：PDF.js 抽取的文字方塊座標即使邏輯上同一列，也可能有數個單位的浮動誤差；分組容錯值抓太緊
    （如四捨五入到很小的倍數）在邊界情況下比抓寬鬆更容易出錯，應優先用「與目前群集的差距」而非「四捨五入
    到固定格點」來判斷是否同一列

---

## m7 年度訓練計畫表（2026-06-28 整合為 m7）

### 功能
- **工具列**：縣市/學校、運動、學年度、第一週週一輸入；自動生成 52 週日期
- **計畫主表**（55 欄）：3 個標籤欄 + 52 個週次欄（各佔 1.731%），全表 `contenteditable`
- **Chart.js 混合圖**（4 柱狀堆疊 + 3 折線）：
  - 柱狀：體能/技術/戰術/心理（y 軸，堆疊）
  - 折線：訓練量/訓練強度/競技狀態（y2 軸，獨立）
- **互動編輯**：點擊柱狀或折線圓點開啟統一輸入 Modal；拖拉圓點即時調整折線值（`dragMoved` 旗標防止拖後誤觸 click）
- **批次套用**：柱狀/折線各自可套用至「僅此週 / 指定範圍 / 全部 52 週」
- **訓練內容**：4 列可編輯表格（體能/技術/戰術/心理）
- **列印**：B4 橫式（364mm × 257mm）`@page` 設定
- **Word 匯出**：`.doc`（HTML 格式），含計畫主表 + 離屏 Canvas 1200×320px PNG 圖表 + 訓練內容

### 頁面版面
```
toolbar（工具列）
main-area（flex column，三等分）
  card 1：計畫主表（可橫向捲動，55 欄）
  card 2：Chart.js 混合圖（.chart-box flex:1）
  card 3：訓練內容與手段（4 列 contenteditable）
```

### build.py 設定
```python
FILES: ('m7', '模組七', '年度訓練計畫', '年度訓練計畫表.html')
CONFLICT_VARS m7: {'chart': 'chart_m7', 'D': 'D_m7', 'BD': 'BD_m7', 'BIG': 'BIG_m7',
                   'HT': 'HT_m7', 'WEEKS': 'WEEKS_m7', 'MONTHS': 'MONTHS_m7',
                   'INIT_VAL': 'INIT_VAL_m7', '_editModalWeek': '_editModalWeek_m7'}
CONFLICT_IDS: editModal, editModalTitle, mainTitle, planTable, mainChart, contentTable,
              inSchool, inSport, inYear, inStartDate, em_ty/js/zs/xl/sum/vol/int/perf,
              em_bar_from/to, em_line_from/to
CDN 殼層：Chart.js 4.4.1
```

### 技術重點
- `generateMonths(startDateStr)` → 從起始週一每次 +7 天，依年月分組，共 52 週
- 圖表 PNG 改用離屏 Canvas 2D（固定 1200×320px）解決 Word 匯出因 devicePixelRatio 造成尺寸錯誤
- 計畫主表欄寬：3% + 3% + 4% + 52×1.731% ≈ 100%
- `// init` 標記讓 `buildTable()` + `buildChart()` 在分頁第一次啟動時才執行（避免 Canvas 尺寸為 0）
- 圖表 click 事件用 `'index' + intersect:false`，點擊任意 x 位置即可找到週次（`'nearest'+intersect:true` 需精確命中圖元，在合併版面下容易失效）
- **版面模式（2026-07-10 調整）**：`.m7-main-area` 從 `height:calc(100vh-56px);overflow:hidden` 改為 `min-height` 各卡片，讓頁面可往下捲動且欄位大小正常
- **計畫表格子統一高度**：`buildTable()` 結尾用 `tbl.querySelectorAll('tr')` 強制第 3 列後每列 `height:20px`；注意必須用 element 相對查詢（不能用 `querySelectorAll('#planTable tr')`，因為 build.py 的 `prefix_ids` 不處理 querySelector 以外的 CSS 選擇器）

---

## m8 器材檢核表（2026-07-05 新增）

### 功能
- **4 個月份分頁**（9月/1月/3月/6月檢查），各自獨立儲存勾選狀態
- **檢核清單**：49 筆項目，涵蓋 7 大區（操場、樂活運動站、桌球教室、風雨球場、活動中心、詠清球場、其他場域）
- **是/否互動**：點擊切換勾選，「否」自動列紅底
- **重設本月檢核**：確認後清空目前月份的勾選/待改進/複檢/日期/期別/簽名
- **Word 匯出**：`@page WordSection1` A4 直式、大區欄直式文字（`writing-mode:vertical-rl`）、colgroup 百分比欄寬
- **Excel 匯出**：改用 **ExcelJS**（SheetJS 免費版不支援儲存格樣式），比照校方範本呈現框線、色塊、是/否底色

### build.py 設定
```python
FILES: ('m8', '模組八', '器材檢核表', '器材檢核表.html')
CONFLICT_VARS m8: {'MONTHS': 'MONTHS_m8', 'CHECKS': 'CHECKS_m8', 'curMonth': 'curMonth_m8', 'monthData': 'monthData_m8'}
CONFLICT_IDS: inDay, monthTabs, monthLabel, checkTable, checkBody, sigRow, sig1~5
CDN 殼層：ExcelJS 4.4.0
```

### 已知 bug 修復記錄
- m7 頂層（非函式內）的 `addEventListener` 語句在合併後會於頁面載入時立即執行；其中 `forEach(id => getElementById(id))` 因 `prefix_ids` 只替換字面字串、無法處理變數形式的 id，導致 `null.addEventListener` 拋錯，中斷後續腳本執行（m8 常數因此卡在 TDZ）
  - **修復**：把該段 `addEventListener` 移進 `// init` 區段（延遲到分頁啟動時才執行），並把 `forEach` 動態 id 拆成逐一明確呼叫

---

## m9 雲端連結頁產生器（2026-07-05 新增）

### 動機
評鑑平台單檔大小限制（如 5MB），部分大型檔案/網站只能改放 Google 雲端硬碟並開放檢視連結。此模組讓使用者填標題、雲端連結、上傳/貼上截圖，批次產生含 QR Code 的「連結頁」上傳至平台，取代原檔案。

### 功能
- **多筆項目管理**：新增/刪除，每筆各自一頁
- **截圖**：可直接 `Ctrl+V` 貼上剪貼簿截圖，或選擇檔案；一律用 canvas 縮放到 1280×960 內並轉 JPEG 壓縮
- **QR Code**：qrcodejs 產生，方便委員現場掃描
- **Word 匯出**：真正的 `.docx`（OOXML zip），每筆項目各自一個 section、各自的 `word/headerN.xml`，LOGO+標題落在 Word 真正的「頁首」區域（比照 m5 的做法，而非 HTML `mso-element:header` 技巧——後者在實測中對真正 Word 無效）
- **PDF 匯出**：html2canvas 把每頁渲染成圖片後用 jsPDF 組成多頁 PDF；另外用 `pdf.link()` 在連結文字位置疊加可點擊區塊
- **下載檔名**：依項目標題命名（多筆時用「首筆標題等N筆」），不再固定檔名

### build.py 設定
```python
FILES: ('m9', '模組九', '雲端連結頁產生器', 'cloud-link-page.html')
CONFLICT_VARS m9: {'entries': 'entries_m9', 'nextId': 'nextId_m9'}
CONFLICT_IDS: school, year, entryList
CDN 殼層：qrcodejs 1.0.0、html2canvas 1.4.1、jsPDF 2.5.1
```

### 已知 bug 修復記錄（皆為深層 debug 案例，值得記住）
- **PDF 截圖/連結框跑出頁面**：離屏渲染容器原本直接掛在 `pe-class-tools.html` 主文件內，因而繼承到 m7 模組殘留的全域樣式 `table{width:100% !important;table-layout:auto !important;}`，導致內部表格寬度失控（實測跑到 900px，超出 793px 版面）
  - **修復**：改用獨立 `<iframe>` 承載離屏渲染內容，徹底隔絕主文件的全域 CSS 污染；表格寬度改用明確 px（非 `%`），並加 `table-layout:fixed` + `colgroup`
- **PDF 連結在 Chrome/pdf.js 正常但 Adobe Acrobat/Reader 不可點擊**：用 pdf.js 解析出的 annotation 看似正常，但比對「原始 PDF bytes」才發現 jsPDF 的 `link()` 把 `/Rect` 的 y 座標順序寫反了（`lly > ury`，違反 PDF 規格要求 `lly ≤ ury`）。Chrome/pdf.js 會自動容錯校正座標順序，Adobe 較嚴格、判定為無效區域
  - **修復**：呼叫 `pdf.link(x, y+h, w, -h, opts)` 取代 `pdf.link(x, y, w, h, opts)`，讓 jsPDF 內部運算後產生的 Rect 座標順序正確
  - **教訓**：驗證 PDF 產出「不能只看某個 PDF 函式庫解析結果」，因為多數函式庫（含 pdf.js）對不規範座標會自動容錯；務必直接檢查原始 PDF bytes 或用目標軟體（Adobe）實測
- **Word LOGO/標題沒有真正落在「頁首」**：最初用 HTML `mso-element:header` + `@page mso-header:hN` 技巧（免建立真正 docx），但實測在真正 Word 中無效（仍顯示在內文區塊）
  - **修復**：改用跟 m5 相同的真 `.docx`（JSZip 組 OOXML），每筆項目各自一個 section + 專屬 `word/headerN.xml`

---

## m10 pdf-to-jpg.html PDF轉JPG／壓縮（2026-07-16 新增）

### 動機
評鑑平台上傳有單檔大小限制，掃描件/圖片型公文 PDF 常超過；此模組完全在瀏覽器內
（不上傳）把 PDF 逐頁轉 JPG 或重新壓縮成小很多的 PDF。

### 功能
- **多檔拖放/選擇**，逐檔顯示進度條、逐頁縮圖與單頁檔案大小
- **壓縮程度快速預設**（`PRESETS`）：輕度(scale2/85%)、中度(1.5/75%，預設)、重度(1/50%)、自訂；
  手動調「輸出解析度」或「JPG品質」任一欄位自動切回「自訂」
- **目標單檔大小上限**（MB）：`canvasToBlobUnderSize()` 逐次 -10% 品質重試直到單張圖 <= 上限（最低 10%）
- **打包下載 JPG（ZIP）**：檔名「原檔名_頁碼.jpg」（頁碼補零）
- **下載壓縮 PDF**（`buildCompressedPdfBlob`）：每頁 JPG 用 jsPDF 依原頁面 pt 尺寸
  （`page.getViewport({scale:1})` 的寬高）組回同版面 PDF；1 個檔案直接下載 `原檔名_壓縮.pdf`，
  多檔打包 ZIP。**注意**：點陣化壓縮，文字不能再反白/搜尋；純文字 PDF 反而可能變大
- **自選儲存位置**（`saveBlobAs`）：支援 File System Access API（Chrome/Edge）跳「另存新檔」視窗；
  使用者取消（AbortError）不重複下載，其他錯誤或不支援（Firefox/Safari）退回 FileSaver `saveAs`
- **清除全部**（`resetAll`）：清空清單與結果；已有轉換結果先 confirm；清單空時按鈕 disabled

### build.py 設定
```python
FILES: ('m10', '模組十', 'PDF轉JPG壓縮', 'pdf-to-jpg.html')
CONFLICT_VARS：無（變數名皆唯一：pdfFilesList、nextPdfId）
CDN：共用殼層既有的 PDF.js、JSZip、FileSaver、jsPDF
```

### 開發時已知事項
- pdf.js 的 `page.render()` 在**不可見分頁**（`document.visibilityState==='hidden'`，如自動化預覽工具）
  會卡住不 resolve——瀏覽器對隱藏分頁節流 canvas 渲染，不是程式 bug；真人開的可見分頁正常
- 換設定（預設/解析度/品質）會把所有已轉檔案標回 pending，需重新轉換

---

## file-size-check.html 檔案大小檢查（2026-07-16 新增，獨立頁非 build.py 合併）

### 動機
評鑑系統每個子標的上傳有大小上限（如 5MB），超過就要改用 m9 的雲端連結頁。使用者需要一次看出「哪些子標
資料夾的檔案總計超過 5MB」。

### 功能
- **webkitdirectory 就地掃描**：使用者選一次評鑑「最上層資料夾」（電腦上同步的 Google 雲端硬碟資料夾），
  `<input type="file" webkitdirectory>` 一次讀入整個樹（`File.size` + `webkitRelativePath`），**完全在
  瀏覽器內讀取、不上傳任何檔案**
- **以子標資料夾為單位加總**：以「檔案所在資料夾」（`webkitRelativePath` 去檔名）為子標資料夾分組，
  加總其直屬檔案大小
- **排除子資料夾**：路徑任一層是「文件上傳／上傳文件／參考資料／參考檔案」（`EXCLUDE_SUBFOLDERS`）的檔案
  一律不列入（只算子標資料夾最外層要上傳的檔案）
- **判斷邏輯**：以「子標**總計** > 上限」標紅（多檔加總可能超過即使每個單檔都 <5MB，如真實 1-1-3 資料夾
  四檔共 8.85MB）；個別單檔超過另加「單檔就超過5MB」提示。上限預設 5MB、可即時調整
- **呈現**：統計（子標資料夾數／檔案總數／總計超過的子標數／總容量）、每個子標顯示 leaf 名+完整路徑、
  超過的排最前、可「只顯示總計超過的子標」、點標題展開檔案清單
- index.html 快速開啟工具列有紅色「檔案大小檢查」卡片連到此頁

### 為何沒整合進評鑑總覽頁（重要決策）
使用者原希望在 index.html 每個子標後面直接顯示大小，但**實際 Drive 資料夾的編號/名稱與 index.html 的
DATA 子標不一致**——例如 Drive「1-1-3」=「體育班課程規劃」，但總覽頁「1-1-3」=「課業成績出賽基準」；
總覽頁用「1-1」而 Drive 用「1-1-1」。以 id 硬比對會把不同資料夾的檔案混算成錯誤數字，故改做成獨立工具
（依實際資料夾名稱分組才準）。若日後要整合進總覽頁，需先統一 Drive 資料夾與 DATA 的子標編號/名稱。

### 實際 Drive 資料夾結構（掃描依據）
```
🔥115年度體育班評鑑/
├── 1.壹、設班現況/  2.貳、運作情形/  3.參、訓練績效/  4.肆、其他特色加分/   ← 大標層
│   └── 1-1-3 體育班課程規劃/                                              ← 子標層
│       ├── (最外層檔案 = 要上傳的檔案，計入加總)
│       ├── 文件上傳/   ← 排除
│       └── 參考資料/   ← 排除
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

模組卡片列（頁面頂部）目前共 15 張：m1～m10 共 11 張（m3a/m3b 各一張）、體育組資料上傳（綠色）、競賽獎狀資料（金色，
連 114學年度競賽成績獎狀掃描 Drive 資料夾）、檔案大小檢查（紅色，連 file-size-check.html）、
**工具使用說明（紫色，一律放最後一張）**。
**注意**：新模組加進 build.py 後，index.html 的 `MODULES` 陣列是**另外手動維護**的清單，
要記得同步加，否則首頁卡片列看不到（m10 就曾漏加造成「沒上線」的錯覺）；guide.html 模組
說明表也要同步。

- **卡片列橫向捲動**（2026-07-16）：卡片多到超出畫面時顯示金色細捲軸與左右圓形箭頭按鈕
  （`scrollModules`／`updateModuleArrows`，依捲動位置自動顯示/隱藏對應箭頭）；CSS 不用
  `scroll-behavior:smooth`（會讓拖曳/滾輪也被強制平滑而互相干擾），僅箭頭按鈕的 `scrollBy` 指定平滑
- **「工具使用說明」卡片固定在最後**：程式碼把該卡片放在所有 `mc.appendChild` 之後才加入，
  新增模組時只要別加在它後面就會維持在最末（已加註解提醒）

### 文件完成追蹤（2026-07-05 新增，2026-07-06 調整）
- 每筆文件的「追蹤」欄位有「已完成」勾選框，狀態存 `localStorage['peEvalTracking115']`（key 為 `子標id::文件索引::文件名稱`）
- **子標層級備忘**（非每筆文件）：`textarea` 支援換行、自動依內容調整高度，存 `localStorage['peEvalSubNotes115']`（key 為 `大標題::子標id`）
- 子標旁另有獨立的「已完成」勾選（`localStorage['peEvalSubDone115']`），勾選後會**自動清空該子標的備忘內容**
- 統計列新增「已完成」/「未完成」筆數；「只顯示未完成」篩選按鈕可與原本的「篩選負責人員」同時套用（AND 邏輯）
- 純瀏覽器本機資料，不會同步到雲端；**若之後調整文件清單順序或改文件名稱，逐筆文件的勾選 key 可能對不上而遺失**（子標層級的備忘/已完成則只要大標題與子標編號不變就不受影響）
- **匯出/匯入進度備份**（2026-07-11 新增，2026-07-16 加強顯眼度）：因追蹤資料是純瀏覽器 localStorage、
  換電腦或換瀏覽器不會自動同步，「匯出進度備份」/「匯入進度備份」按鈕把 `TRACKING`/`SUB_NOTES`/`SUB_DONE`
  三份資料打包成 JSON 檔下載，換電腦時匯入即可還原；可搭配專案本身就在 Google 雲端硬碟同步的資料夾
  手動搬移備份檔。2026-07-16 把兩顆按鈕包進金色虛線框群組、加「換電腦記得備份 →」提示與 📤/📥 圖示、
  匯出鈕改金色實心，避免使用者以為沒有此功能
- **關於「自動同步」**：使用者曾詢問雲端自動同步（免手動匯出匯入）。可用現有 Apps Script 加存/讀端點做到，
  但需重新部署且會變成全體共用一份進度；使用者 2026-07-16 決定**維持手動匯出/匯入**，暫不做自動同步

### `DATA` 子標與官方評鑑指標比對／重構（2026-07-18）

比對 https://peclass.perdc.ntnu.edu.tw （高級中等以下學校體育班資料系統，官方線上訪視指標表，
需登入）「壹～肆」四頁實際評分項目，發現 index.html 的 `DATA` 子標結構與官方打分項有落差，已修正：

**壹、設班現況重構**：
- **委員會拆分**：官方「一.1 體育班發展委員會設立」「一.2 體育班發展委員會運作」是兩個獨立評分項，
  原本合併成一個子標 `1-1`（名稱「體育班發展委員會設立與運作」）。拆成 `1a-1`（設立，文件：體發會
  委員組織辦法）／`1a-2`（運作，文件：體育班發展委員會會議紀錄）
- **`1-1-3` 課業成績出賽基準之訂定情形**：官方系統沒有獨立打分項，「出賽基準」只在「一.2 委員會運作」
  的檢核說明裡被列為會議討論範例之一 → 已移除此子標，兩份文件（體育班參賽基準／第一次體發會通過紀錄）
  併入 `1a-2`
- **師資聘任拆分**：官方「二.1 一般學科課程師資聘任情形」「二.2 體育專業學科課程師資聘任情形」是兩個
  獨立評分項，原本合併成一個子標 `2-1-1`。拆成 `1b-1`（一般學科）／`1b-2`（體育專業學科）
- **`2-1-2` 體育專項術科師資聘任情形移除**：這個子標名稱在官方系統找不到對應評分項，內容其實誤置——
  兩份文件「體育班課表與授課師資名單」「專任運動教練聘書（掃描件）」分別對應官方「二.3 教師教練種類
  是否相符」（需班級課表佐證）與「二.4 學校聘任專任運動教練情形」（需教練聘約佐證），已移除此子標並
  將文件併入對應的 `1b-3`（原 `2-1-3`）／`1b-4`（原 `2-1-4`）
- **設施設備（`3-1-1`/`3-1-2`/`3-2-1`/`3-2-2`）維持不變**：比對官方「三、發展運動種類之設施設備」四項
  完全對應，無需調整

**貳、運作情形核對**：原以為「經費編列及使用情形」「課程規劃與執行情形」完全沒被收錄（比對時只看了
壹的內容就下錯誤結論），完整重讀後確認**貳大標下 `1-1-1`／`1-1-2`／`1-1-3`（經費）與 `2-1-1`／`2-1-2`／
`2-1-3`（課程規劃執行）其實早已存在且文件齊全**，不需新增。**教訓：比對前務必完整讀取目標檔案的
對應區塊，不要只憑片段記憶或部分 grep 結果下結論**

**參、訓練績效**：官方這一大項（20分）完全是連結「學生基本資料／運動體能紀錄／技術測驗紀錄／運動
訓練日記／比賽紀錄管理」等其他系統模組自動計算成績，不是文件上傳類指標，index.html 沒有對應大標
是正確的，不需新增

**肆、其他特色加分**（`4-1`~`4-4`：設班/運作/訓練/其他特色）：與官方四項完全對應，無需調整

**id 撞號問題已於 2026-07-18 晚間徹底修復**（見下方「id 全面重編＋Drive 資料夾同步改名」），
不再是待辦事項

**新增「官方指標分組」顯示層**（2026-07-18 下午）：使用者要求畫面階層要對齊官方指標表的「大標／一二三四
分組／1234子標」三層結構，而不只是「大標／子標」兩層。做法：`DATA` 每個 sub 物件新增 `group` 欄位
（例如 `group: '一、體育班發展委員會招生執行情形'`），只加在壹（3組）與貳（4組）共 26 個子標；肆的
4 個子標維持不設 `group`（官方頁面本身就是平鋪 4 項，無分組）。渲染邏輯（`DATA.forEach` 主迴圈）逐一
比較前後 sub 的 `group` 是否變動，變動時關閉前一個 `.group-section`、開啟新的（用 `sub.group||null` 統一
比較，避免 `undefined!==null` 導致無分組的大標也被誤判成「每個 sub 都要開關一次」）；`applyFilters()`
比照既有 `.sub-section`／`.major-section` 的「子層全隱藏則本層隱藏」邏輯，多加一層 `.group-section` 判斷，
確保「只顯示未完成」篩選在整組都已完成時能連分組標題一起藏起來。**用 Python 腳本批次寫入 group 欄位**
（而非手動 26 處 Edit）：依「先比對 `major:` 行切換目前大標、再用 regex 比對 `id: 'X', name: 'Y',` 行」
逐行處理，這樣即使 `id`（如 `1-1-2`、`3-1-1`、`3-1-2`）在壹貳兩個大標間本來就撞號重複，也不會用全域
字串取代誤改到另一個大標的同名 id——**這正是本文件前面「既有 id 撞號問題」提到的那批重複 id，分組
欄位的加入方式必須讓大標邊界明確才安全**

### id 全面重編＋Drive 資料夾同步改名（2026-07-18 晚間）

使用者要求子標 id 改用「壹-一-1」（大標-分組-序號）格式，順便問「這樣會撞號嗎」「要不要連本地端
資料夾一起改」。處理過程與結果：

- **id 全面重編**：30 個子標（壹12＋貳14＋肆4）全部改成 `壹-一-1`／`貳-三-6`／`肆-1` 這種格式，
  用 Python 腳本依「先認 `major:` 行界定目前大標、再 regex 比對 `id: 'X'` 行」逐行改寫（跟前面
  group 欄位用同一套安全手法），改完 `grep` 驗證**全檔案零撞號**，JS 語法與子標/文件總數（30／89）
  皆守恆
- **意外發現**：核對每個子標的 driveUrl 對應哪個實際 Drive 資料夾時，先用本機 Google Drive 的
  SQLite 中繼資料快取（`_get_drive_ids.py` 手法）反查資料夾名稱，結果同一個資料夾名稱查到**好幾個
  不同的舊 ID**（快取裡有歷史殘影/重複項），判定為不可靠，**放棄用 ID 反查驗證連結是否正確**，
  改用**本機檔案總管路徑直接 `mv` 改名**（Google Drive Desktop 會自動同步改名，不需要知道 ID，
  也不受快取髒資料影響）
- **Drive 資料夾改名結果**：壹（12個）／貳（14個）／肆（4個）共 30 個資料夾，比照新 id 逐一改名，
  例如 `1-1-1 體育班發展委員會設立` → `壹-一-1 體育班發展委員會設立`。**壹的師資聘任 2 個舊資料夾
  例外**（`2-1-1 一般學科及體育專業學科課程師資聘任情形`、`2-1-2 體育專項術科師資聘任情形`）：
  這兩個資料夾內部**沒有**依指標拆開的子資料夾，只有標準的「文件上傳／參考資料」+ 幾個編號檔案
  （檔名看得出對應哪個指標，但檔案物理上還混在一起），index.html 這兩個舊資料夾對應的子標已經
  拆成 4 個新子標（`壹-二-1`~`壹-二-4`），先**只改名成涵蓋整組的名稱**（`壹-二-1及2 ……（尚未拆分
  1、2項，待評鑑結束後整理）`、`壹-二-3及4 ……（原體育專項術科師資聘任情形，尚未拆分3、4項，
  待評鑑結束後整理）`），真正把檔案分流到 4 個獨立資料夾**留待評鑑結束後、使用者自己確認每份檔案
  歸屬**再處理（怕評鑑衝刺期間自動搬移正式佐證檔案誤置）
- **教訓**：①資料夾改名務必用「本機路徑 `mv`」而非嘗試解析 Google Drive 中繼資料快取反查 ID——
  快取會有歷史殘影/重複項，不可靠；②資料夾/檔案名稱裡**不能用半形 `/`**（會被當路徑分隔符，
  `mv` 回報 `No such file or directory`），改名文字若要表達「1、2項」要用頓號或全形，不能用半形斜線；
  ③batch rename 腳本務必檢查每個 `mv` 的 exit code 再判定成功與否，不要無條件印出「✔ 成功」訊息
  （這次第一輪就因為含半形 `/` 的 2 個改名實際失敗、但腳本仍誤報成功，靠事後 `ls` 核對才抓到）


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
- [x] **m6 grade-record.html** 學習輔導補助成績登錄（2026-06-24，4 期別、PDF 批次匯入、已整合進 pe-class-tools.html）
- [x] pe-class-tools.html 切換分頁時同步更新 URL hash（`history.replaceState`）
- [x] **m7 年度訓練計畫表.html** 互動式年度訓練計畫（2026-06-28，Chart.js 混合圖、拖拉折線、Word 匯出、已整合進 pe-class-tools.html）
- [x] **m8 器材檢核表.html** 體育器材安全檢核表（2026-07-05，4 月份分頁、Word/ExcelJS 匯出、重設本月檢核）
- [x] **m9 cloud-link-page.html** 雲端連結頁產生器（2026-07-05，貼上截圖自動縮放、真 docx 頁首、PDF 可點擊連結、QR Code）
- [x] index.html 文件完成追蹤（2026-07-05～06，已完成勾選 + 子標層級備忘 + 只顯示未完成篩選）
- [x] 新增 `.nojekyll` 解決 GitHub Pages Jekyll 建置偶發失敗問題（2026-07-06）
- [x] index.html 追蹤進度匯出/匯入備份，方便跨電腦搬移（2026-07-11）
- [x] **m1 photo-doc-generator.html** 新增「每頁2張（大圖）」版面、說明獨立成下方儲存格、
      手動旋轉照片按鈕（2026-07-10～11）
- [x] **m5 leave-record.html** 新增 Excel 範例檔下載、班級總人數/公假人數/比率統計列、
      核章簽名列、頁首標題單行修復（2026-07-11）
- [x] **m6 grade-record.html** 成績檔匯入大幅改寫（2026-07-12）：PDF／Excel 共用標題列比對邏輯
      取代原本猜測版面的解析方式、修正 PDF 逐行分組容錯過嚴問題、新增全學年成績檔匯入、
      班名次/年名次依五科總分自動計算、未達 60 分標示與名單
- [x] **m1 photo-doc-generator.html** 大幅擴充（2026-07-16）：一次匯入多張照片、匯入 Word 檔重新排版
      （頁首標題一律覆蓋）、照片大小滑桿、照片自動縮圖至 1600px（解決多頁卡死）、區塊下方插入/
      一次新增多個區塊、說明統一改為照片下方獨立列、頁首標題單行修復
- [x] **index.html**（2026-07-16）：模組卡片列可捲動+左右箭頭、進度備份按鈕加強顯眼度、
      新增競賽獎狀資料卡片、新增檔案大小檢查卡片、工具使用說明卡片固定放最後
- [x] **guide.html** 模組說明更新至 9 個模組（2026-07-16）
- [x] **file-size-check.html** 檔案大小檢查工具（2026-07-16）：webkitdirectory 本機掃描、以子標資料夾
      加總、排除文件上傳/參考資料子資料夾、標示總計超過 5MB 者
- [x] **m10 pdf-to-jpg.html** PDF轉JPG／壓縮（2026-07-16 下午）：逐頁轉 JPG 打包 ZIP、壓縮 PDF
      重組下載、壓縮程度預設、目標大小上限、另存新檔自選位置、清除全部；index.html 卡片列與
      guide.html 已同步至 10 個模組
- [x] **m1 photo-doc-generator.html** Word 版面修正（2026-07-16 下午）：照片統一比例置中裁切
      （srcRect，依多數方向自動選 4:3/3:4）、每頁張數強制換頁（修正 2排/3排 輸出相同）、
      照片列最小列高+垂直置中（修正頁尾大片空白）、清除全部按鈕
- [x] **清除誤入的體適能常模對照工具**（2026-07-17）：`fitness-check.html`/`fitness_data.json` 於
      b52817c（m5 commit）搭便車混入本 repo 且與評鑑無關，已 git rm 移除（b55de5b）；
      `fitness.html`/`_fitness_json.py`/`_fitness_report.py` 三個未追蹤檔搬回獨立 repo
      `G:\我的雲端硬碟\fitness-check\` 並 commit（faf4d66）。體適能工具開發一律在該獨立 repo 進行
- [x] **m6 grade-record.html** 成績預警通知單 Word 下載＋自動儲存（2026-07-17～18）：任一科<60
      即產生一份獨立通知單＋家長回執聯（含勾選意願3項、意見欄、簽章），一份一頁不跨頁（改用 mso
      br 換頁避開 Word 對 div page-break 的支援問題）；拖放區自動辨識全學年成績檔；成績資料自動
      存進瀏覽器（每次段考匯入即累積，不必年底一次彙整），附匯出/匯入 JSON 備份
- [x] **版本控制補齊**（2026-07-20）：新增 `.gitignore` 排除 `node_modules/`、`.claude/`、
      `.DS_Store`；先前散落本機、從未進 git 的工具腳本（`_check_idx.js`、`_gen_guide.js`、
      `_get_drive_ids.py`、`_patch_drive_urls.py` 等）、`package.json`/`package-lock.json` 一併
      commit 推送至 GitHub（`asics49/pe-tools`），確保 GitHub 為版本歷史唯一真實來源

### 待辦
- [ ] **Drive 掃描權限**：需用學校帳號執行 `grantAccessToGmail`（目前掃描結果全為「無法存取資料夾」）
- [ ] **參考資料夾權限**：`setRefFolderPermissions` 尚未執行
- [ ] **測試版確認**：1-1 子標兩筆文件的上傳系統流程，確認後全面套用至 87 筆
- [ ] **新年度更新腳本**：撰寫 `new-year-setup.py`
- [ ] **評鑑平台資料夾搬移**：等本年度評鑑內容完成後執行「歸檔→驗證→搬移→清空」
      （詳見下方「評鑑平台資料夾搬移計畫」章節，2026-07-16 已評估定案）
- [ ] **壹-二-1及2／壹-二-3及4 資料夾拆分**：評鑑結束後，人工核對這兩個合併資料夾內每份檔案
      實際對應哪個新子標（`壹-二-1`一般學科／`壹-二-2`體育專業學科／`壹-二-3`教師教練相符／
      `壹-二-4`專任教練聘任），拆成 4 個獨立資料夾並更新 index.html 對應子標的 driveUrl/refUrl

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
| m6 分頁空白 | leave-record.html `.wrap` 少一個 `</div>`，panel_m5 未閉合，panel_m6 被嵌套在 panel_m5 內 | 補上 `</div>` 閉合 `.wrap`（leave-record.html line 198 後）|
| build.py `get_body` 抓到 `</head><body>` | grade-record.html `<style>` 在 `<head>` 內，`</style>` 後緊接 `</head><body>` | `get_body` 加 regex 濾除 `</head>`、`<body>`、`</body>`、`</html>` |
| m7 點擊柱狀圖無反應 | `'nearest'+intersect:true` 在合併版面需精確命中圖元 | click handler 改用 `'index'+intersect:false` |
| m8/m9 合併後模組互相干擾（TDZ、CSS 污染） | 所有模組 CSS/JS 合併進同一份文件，任一模組的「頂層執行語句」或「未加前綴的全域選擇器樣式」都會影響其他模組 | 新模組的初始化邏輯務必放進 `// init` 區段；CSS 盡量加模組專屬 class，避免裸的 `table{}`、`div{}` 等全域選擇器 |
| GitHub Pages 建置失敗（Page build failed） | Repo 預設用 Jekyll 處理靜態頁面，複雜 HTML/JS 內容偶爾被 Jekyll 誤判 | 新增根目錄 `.nojekyll` 空檔案，跳過 Jekyll 處理 |
| jsPDF `link()` 產生的連結在 Adobe 不可點擊 | jsPDF 把 `/Rect` 的 y 座標順序寫反（`lly>ury`），Adobe 嚴格判定無效，Chrome/pdf.js 會自動容錯 | 呼叫 `pdf.link(x, y+h, w, -h, opts)` 取代 `(x, y, w, h)` 抵銷 jsPDF 內部的反轉 |
| 所有模組頁面無法捲動 | m7 的 `html,body{height:100%;overflow:hidden}` 合併後污染全域，導致任何分頁都無法捲動 | 從 m7 源頭移除該規則；`build.py get_css()` 加負向 lookbehind `(?<![.#\w-])` 防止誤刪 `.s-body{}` 等含 `body` 字串的選擇器 |
| m7 合併後 class 污染其他模組（`.card{overflow:hidden}`）| m7 用通用 class 名稱（`.card`、`.main-area`、`.toolbar`）與其他模組的 CSS 互相覆蓋 | m7 所有自訂 class 統一加 `m7-` 前綴 |
| m7 計畫表格子高度不一致 | 空的 `contenteditable` td 瀏覽器插入隱形 `<br>` 導致比有內容的格子高；且 `querySelectorAll('#planTable tr')` 在合併版中 ID 已被改名為 `planTable_m7`，fix 完全無效 | `buildTable()` 結尾改用 `tbl.querySelectorAll('tr')` element 相對查詢，強制第 3 列後每列 `style.height='20px'` |
| m1 預覽格線版面失效 | `build.py` 幫 `cols` 變數改名時，`\bcols\b` 正規表示式誤判字串常數 `'cols-'+cols` 裡的字面文字也是同一變數，錯誤置換 | class 名稱改用不含變數字面的 `grid-c` 前綴，避免字串跟變數名稱撞在一起 |
| m1 旋轉/上移/下移/刪除按鈕全部隱形 | `.icon-btn` class 同時被 m4（career-activity.html）定義成白色圖示+半透明白底（給它自己的深色卡片背景用），CSS 合併後層疊蓋掉 m1 版本，變成白圖示疊白底 | 改用模組專屬的 `.m1-icon-btn`；純外觀異常優先用 `getComputedStyle` 量測實際套用顏色，不要用肉眼或猜編碼問題 |
| m6 用真實 PDF/Excel 匯入必定「未找到成績資料」 | `parsePdfFile` 是憑空設計的欄位版面（3碼班級代碼+2碼座號+小數成績），從未拿真實檔案測過，跟校方實際格式（座號/姓名/年級/國文/英文/數學/社會/自然）完全對不上 | PDF 與 Excel 改用共用的 `matchScoreHeaderRow()`，掃描標題列比對文字定位欄位，不假設固定欄位順序 |
| m6 PDF 匯入部分學生變亂碼、學生數少於實際筆數 | 逐行分組用「y 座標四捨五入到 3 的倍數」，但同一列不同欄位文字基線常差 2~3 單位，四捨五入邊界不穩定，誤把姓名與分數拆成兩列 | 改用「鄰近值分群」（與目前群集 y 差距 <=8 視為同列），不用四捨五入到固定格點 |
| m1 照片多（6~7 頁）後瀏覽器卡死 | 照片以原始解析度 dataURL 全存記憶體（手機原圖 4~8MB/張，幾十張數百 MB），且每次說明打字都用完整大圖重繪整個預覽 | 匯入時一律縮到長邊 1600px（`resizeDataUrl`）；說明預覽重繪改 300ms 延遲（`schedulePreview`）|
| 檔案大小檢查無法整合進評鑑總覽頁 | 實際 Drive 資料夾編號/名稱與 index.html DATA 子標不一致（Drive「1-1-3」=體育班課程規劃 vs 總覽「1-1-3」=課業成績出賽基準；總覽「1-1」vs Drive「1-1-1」），以 id 硬比對會混算成錯誤數字 | 改做成獨立工具 file-size-check.html，依實際資料夾名稱分組；要整合總覽頁須先統一編號 |
| index.html 卡片列箭頭捲動失靈/測量不準 | CSS `scroll-behavior:smooth` 讓每次 scrollLeft 變更都動畫化，程式化連續捲動互相干擾 | 移除 CSS `scroll-behavior:smooth`，只在箭頭按鈕的 `scrollBy` 指定 `behavior:'smooth'` |
| m1 選「2排」輸出卻是 3 排 | 2排/3排都是 cols=2，只靠圖片高度預算差異控制每頁張數，但橫向照片寬度先被欄寬卡住，兩版面算出的圖片尺寸幾乎相同 | 每滿 targetBlocks 張在下一張照片段落加 `<w:pageBreakBefore/>` 強制換頁 |
| m1 每列2張版面頁尾留大片空白 | 橫向照片實際高度遠小於每排可用高度預算，剩餘空白全堆頁尾 | 照片列設 `w:trHeight`（每排預算、hRule=atLeast）+ 照片格 `w:vAlign center`，空白平均分散 |
| m1 直向照片被硬裁成橫向 4:3 | 固定 4:3 置中裁切對直向照片等於強制轉橫向 | srcRect 比例改多數決：直向照片過半全部用 3:4，否則 4:3 |
| 新模組已進 build.py 但首頁看不到 | index.html 的 `MODULES` 卡片清單是手動維護、不會自動同步 | 新增模組時記得同步改 index.html `MODULES` 與 guide.html 說明表 |
| 匯入進度備份後畫面沒更新 | localStorage 依「來源網址+瀏覽器」隔離：在 file:/// 開的本機 index.html 匯入，GitHub Pages 網址上看不到（反之亦然） | 匯入與檢視務必用同一網址（https://asics49.github.io/pe-tools/）與同一瀏覽器 |
| pdf.js 在自動化預覽工具中 render 卡住 | 分頁不可見（visibilityState=hidden）時瀏覽器節流 canvas 渲染，`page.render()` 不會 resolve | 非程式 bug；驗證 pdf.js 轉檔需在真人可見分頁測，或只驗證後段純邏輯（如 jsPDF 組裝） |
| m10 拖曳 PDF 無效 | m5 與 m10 都有 `id="dropZone"`，getElementById 只取得 DOM 第一個（m5 的），m10 的拖曳監聽全綁錯元素 | 改模組專屬 id `m10PdfDropZone`；注意 `closest('#id')` 選擇器 prefix_ids 蓋不到，撞名 id 優先從源頭改名而非加 CONFLICT_IDS |
| m3a 分頁 init 全掛（radio 群組/經費表沒渲染） | `renderRadioGroup('reportTypeGroup',…)` 把 id 當**字串參數**傳遞、`querySelector('#fundTable tbody')` 是**複合選擇器**——兩者 prefix_ids 都改寫不到，而這些 id 又列在 CONFLICT_IDS（HTML 端被改名），兩邊對不上 → null | 唯一 id 從 CONFLICT_IDS 移除（radio 群組 4 個 id）；複合選擇器改 `getElementById('fundTable').querySelector('tbody')` |
| m7 編輯視窗總和 crash、Word 匯出訓練內容為空 | `['em_ty',…].reduce((a,id)=>getElementById(id)…)` 動態 id、`querySelectorAll('#contentTable tr')` 複合選擇器，prefix_ids 皆改寫不到 | 動態 id 拆成逐一字面呼叫；複合選擇器改 `getElementById('contentTable').querySelectorAll('tr')` |
| m7 `#planTable`/`#contentTable` CSS 失效 | CSS 的 `#id` 選擇器 prefix_ids 不處理，合併版 id 已改名 m7_planTable，樣式全滅（先前靠其他模組污染的通用樣式碰巧撐著） | table 加 `m7-plan-table`/`m7-content-table` class，CSS 改用 class 選擇器 |
| repo 內出現與評鑑無關的 fitness-check.html，還在其上重複開發 | 該檔於 b52817c（m5 commit）被連同 `git add` 搭便車混入且 commit 訊息未提及；體適能工具真正的主線在獨立 repo `G:\我的雲端硬碟\fitness-check\`（index.html），pe-tools 這份是凍結的舊快照，後續工作階段不知情、在舊分叉上重造了獨立 repo 早已有的功能（逐函式比對：獨立 repo 為嚴格超集，多 14 個函式） | 已於 2026-07-17 移除（b55de5b），獨佔的 Python 腳本搬回獨立 repo（faf4d66）。教訓：①commit 前檢查 `git status`，勿把工作目錄裡不相干的檔案一起 add；②在陌生檔案上開工前先 `git log --follow` 查身世，確認它不是別的專案誤入的分叉 |
| `node_modules/` 曾一起被同步進 Google Drive、且沒有 `.gitignore` 排除，差點被 `git add -A` 整包提交 | 專案直接在 Google Drive 同步資料夾內開發，npm 安裝的套件與零散工具腳本長期只存在本機/雲端硬碟，沒有 `.gitignore` 把 `node_modules/` 擋在 git 之外 | 2026-07-20 新增 `.gitignore`（`node_modules/`、`.claude/`、`.DS_Store`），`node_modules` 靠 `package.json` 重裝即可，不需要進版本控制；同時把之前漏掉的工具腳本一併補進 git |

**prefix_ids 四大盲區（新模組/改 CONFLICT_IDS 前必讀）**：它只改寫 `id="X"`、`for="X"`、`getElementById('X')`、`querySelector('#X')` 四種**完全相符**的字面樣式。以下寫法一律改寫不到：①id 當字串參數傳遞 ②`querySelector('#X tbody')` 等複合選擇器 ③`['X','Y'].map(id=>getElementById(id))` 動態 id ④CSS/`closest()` 的 `#X` 選擇器。原則：模組內唯一的 id 不要放進 CONFLICT_IDS；真撞名的 id 優先從源頭改成模組專屬名稱。

---

## 評鑑平台資料夾搬移計畫（2026-07-16 評估定案，尚未執行）

### 決策
使用者決定採**方案 B：等本年度評鑑內容全部完成後**再執行「歸檔 → 搬移」，評鑑衝刺期間不動資料夾結構。
目標：把 `🔥115年度體育班評鑑` 從 `🎾體育組\114學年度體育組\` 搬到 `🎾體育組\` 底下，
改造成**每年重用的評鑑平台資料夾**；當年度內容則複製到 `114學年度體育組\` 下的歸檔資料夾保存。

### 為什麼安全（可行性評估結論）
- Google Drive 同一個「我的雲端硬碟」內的**搬移只是改父資料夾的中繼資料**：資料夾 ID 不變、
  檔案本體不動、不重新上傳
- 因此 index.html 的 **89 筆 driveUrl/refUrl（都是資料夾 ID 連結）搬移後全部照常有效**；
  直接設定在「文件上傳/參考資料」資料夾上的共用權限也跟著走；Apps Script 掃描用的資料夾 ID 不受影響
- **平台化最大好處**：資料夾 ID 永遠不變 → 之後換年度不用再重建 30 個資料夾、不用重打 89 條網址，
  只要「歸檔當年檔案 + 清空」即可（可大幅簡化下方「換年度更新步驟」的 1~5 步）

### 現況資料量（2026-07-16 量測）
| 資料夾 | 大小 | 檔案數 |
|--------|------|--------|
| 1.壹、設班現況 | 427 MB | 314 |
| 2.貳、運作情形 | 3,681 MB | 1,318 |
| 3.參、訓練績效 | 1 MB | 8 |
| 4.肆、其他特色加分 | 34 MB | 15 |
| 合計 | 約 4.1 GB | 1,655 |

### 執行步驟（評鑑完成後）
1. **歸檔**：在 `114學年度體育組\` 下建「114學年度評鑑歸檔」資料夾，把 1、2、3、4 四個指標資料夾
   **複製**進去（本機檔案總管複製＝下載+上傳約 4.1GB 較慢；或用 Apps Script 伺服器端複製較快，
   需注意 6 分鐘執行上限、大樹要分批）
2. **驗證備份**：用腳本比對兩邊「檔案數與總大小」一致才繼續（複製出來的是全新 ID，不影響原連結，
   這正是歸檔要的）
3. **搬移**：到 **drive.google.com 網頁版**把 `🔥115年度體育班評鑑` 右鍵→移動到 `🎾體育組\`
   （伺服器端原子操作，最安全；本機檔案總管拖曳通常也會轉成伺服器端搬移，但同步中斷時可能出現
   重複/延遲，網頁版最穩）。搬移前確認 Drive 桌面版同步已完成（圖示閒置）
4. **改名**（建議）：去掉「115年度」字樣（如「體育班評鑑平台」），年度改用內容物或歸檔區分
5. **驗證**：抽查 index.html 幾筆「上傳文件/參考資料」按鈕連結正常；測一次上傳系統（1-1 測試子標）
6. **清空平台**：確認歸檔無誤後，刪除平台資料夾內當年度檔案（保留 30 個子標資料夾與其
   「文件上傳/參考資料」子資料夾——**資料夾本身不能刪**，ID 要留給下年度用）

### 注意事項
- 「同步」認知：Google Drive 沒有資料夾對資料夾自動同步，歸檔是**當下快照**，之後兩邊不互相更新
- **Apps Script 檢查**：Code.gs 的 `uploadFile()`（路徑式舊版）若寫死完整路徑，搬移後會失效；
  `uploadFileById()` 用 ID 不受影響。搬移後要實測上傳系統一次
- **權限繼承**：若 `🎾體育組` 資料夾本身有共用給其他人，搬進去會**多繼承**那些權限，要確認
- **本機路徑改變**：`G:\...\114學年度體育組\🔥115年度體育班評鑑` → `G:\...\🎾體育組\...`，
  本機捷徑/釘選要重新指；`_patch_drive_urls.py`、`_get_drive_ids.py` 的父路徑下次使用時要更新
- 搬移本身與評鑑內容做完與否無關（隨時可搬、工作不中斷），但**歸檔一定要等內容做完**才拷，
  否則半成品快照之後還要重拷

---

## 換年度更新步驟（下次參考）

> ⚠️ 若上方「評鑑平台資料夾搬移計畫」已執行，步驟 1~5 可大幅簡化：
> 資料夾與 ID 沿用平台既有的，只需清空當年檔案，index.html 的網址不用重打。

1. 在新年度 Google Drive 資料夾下，依 30 個子標各建「文件上傳」與「參考資料」
2. 更新 `_patch_drive_urls.py` 與 `_patch_ref_urls.py` 的父資料夾路徑
3. 執行 `python _get_drive_ids.py` 取得新資料夾 ID
4. 執行 `python _patch_drive_urls.py` 與 `python _patch_ref_urls.py` 更新 index.html
5. `git add → commit → push`
6. 用學校帳號在 Apps Script 執行 `setFolderPermissions` 與 `setRefFolderPermissions`
7. 更新 `SCAN_FOLDERS` 裡的 30 個資料夾 ID
8. 執行 `setupDailyTrigger` 重設觸發器
9. 更新 Code.gs 的 `CONFIG.YEARS` 加入新學年度
