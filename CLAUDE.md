# 體育班評鑑模組開發 — 專案脈絡總覽

> 最後更新：2026-07-12

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
| `grade-record.html` | m6 學習輔導補助成績登錄模組（已整合進 pe-class-tools.html）|
| `年度訓練計畫表.html` | m7 年度訓練計畫模組原始檔 |
| `器材檢核表.html` | m8 體育器材安全檢核表模組原始檔 |
| `cloud-link-page.html` | m9 雲端連結頁產生器模組原始檔 |
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

---

## m1 photo-doc-generator.html 照片佐證資料（2026-07-10～11 新增「每頁2張」版面）

### 功能
- **每列照片數量版面**（`LAYOUT_PRESETS`）：1=每列1張大圖、2=每列2張2排、3=每列2張3排、
  4=**每頁2張（大圖）**——`cols`（每列欄數）與 `blocks`（預設區塊數）的組合已經通用支援「每頁 N 張」，
  `getMaxImgHeightEmu()` 只依 `targetBlocks/cols` 這個固定比例算圖片最大高度，**不受使用者實際新增的
  照片張數影響**，所以不管加減幾張，每頁的排版永遠正確符合一張 A4（已用 2→5 張測試，圖片高度數值不變）
- **每頁2張版面的說明文字**：獨立成一個儲存格，放在照片格「下方」（另一列 `<w:tr>`），不是同一格疊放、
  也不是側邊並排（曾誤解為側邊並排，已修正回下方）
- **手動旋轉照片**：區塊操作列的「旋轉」按鈕，用 canvas 順時針轉 90 度並更新 `dataUrl/width/height`；
  **不做自動判別方向**——EXIF 只能反映拍照當下手機朝向，無法可靠判斷內容「應該」呈現的方向，故意
  不做自動旋轉，一律靠使用者手動控制
- 旋轉按鈕一律顯示（未上傳照片時呈 disabled 樣式），避免使用者誤以為沒有這個功能

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

模組卡片列（頁面頂部）目前共 11 張：m1～m9（9 張）、體育組資料上傳（綠色）、工具使用說明（紫色）。

### 文件完成追蹤（2026-07-05 新增，2026-07-06 調整）
- 每筆文件的「追蹤」欄位有「已完成」勾選框，狀態存 `localStorage['peEvalTracking115']`（key 為 `子標id::文件索引::文件名稱`）
- **子標層級備忘**（非每筆文件）：`textarea` 支援換行、自動依內容調整高度，存 `localStorage['peEvalSubNotes115']`（key 為 `大標題::子標id`）
- 子標旁另有獨立的「已完成」勾選（`localStorage['peEvalSubDone115']`），勾選後會**自動清空該子標的備忘內容**
- 統計列新增「已完成」/「未完成」筆數；「只顯示未完成」篩選按鈕可與原本的「篩選負責人員」同時套用（AND 邏輯）
- 純瀏覽器本機資料，不會同步到雲端；**若之後調整文件清單順序或改文件名稱，逐筆文件的勾選 key 可能對不上而遺失**（子標層級的備忘/已完成則只要大標題與子標編號不變就不受影響）
- **匯出/匯入進度備份**（2026-07-11 新增）：因追蹤資料是純瀏覽器 localStorage、換電腦或換瀏覽器不會
  自動同步，新增「匯出進度備份」/「匯入進度備份」按鈕，把 `TRACKING`/`SUB_NOTES`/`SUB_DONE` 三份
  資料打包成 JSON 檔下載，換電腦時匯入即可還原；可搭配專案本身就在 Google 雲端硬碟同步的資料夾
  手動搬移備份檔

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
