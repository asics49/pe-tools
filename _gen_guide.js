const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, ExternalHyperlink,
  LevelFormat, TableOfContents, Bookmark, PageBreak
} = require('C:/Users/asics/AppData/Roaming/npm/node_modules/docx');
const fs = require('fs');

const DARK_NAVY = '223A52';
const GOLD = 'C9A24B';
const GREEN = '2E7A2E';
const RED_BADGE = '8B2E2E';
const BLUE = '2E5EA0';
const LIGHT_BG = 'F0EDE6';
const WHITE = 'FFFFFF';
const GRAY = 'F5F5F5';
const TEXT = '333333';
const BORDER = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };

function h(text, level, color) {
  const sizes = { 1: 40, 2: 32, 3: 28 };
  const spacing = { 1: { before: 480, after: 200 }, 2: { before: 360, after: 160 }, 3: { before: 240, after: 120 } };
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: sizes[level], color: color || DARK_NAVY, font: 'Microsoft JhengHei' })],
    spacing: spacing[level],
  });
}

function p(runs, opts = {}) {
  const children = typeof runs === 'string'
    ? [new TextRun({ text: runs, size: 22, font: 'Microsoft JhengHei', color: TEXT })]
    : runs;
  return new Paragraph({ children, spacing: { before: 80, after: 80 }, ...opts });
}

function run(text, opts = {}) {
  return new TextRun({ text, size: 22, font: 'Microsoft JhengHei', color: TEXT, ...opts });
}

function bold(text, color) {
  return run(text, { bold: true, color: color || TEXT });
}

function link(text, url) {
  return new ExternalHyperlink({
    children: [new TextRun({ text, size: 22, font: 'Microsoft JhengHei', color: BLUE, underline: {} })],
    link: url
  });
}

function bullet(text, sub = false) {
  return new Paragraph({
    numbering: { reference: sub ? 'sub-bullets' : 'bullets', level: 0 },
    children: [run(text)],
    spacing: { before: 60, after: 60 },
  });
}

function step(num, title, desc) {
  return new Paragraph({
    children: [
      new TextRun({ text: `步驟 ${num}　`, bold: true, size: 22, color: WHITE, font: 'Microsoft JhengHei',
        highlight: undefined }),
      bold(`${title}`, DARK_NAVY),
      run(desc ? `　${desc}` : ''),
    ],
    spacing: { before: 120, after: 80 },
    numbering: { reference: 'steps', level: 0 },
  });
}

function sectionDivider(title, color) {
  return new Paragraph({
    children: [new TextRun({ text: `　${title}　`, bold: true, size: 26, font: 'Microsoft JhengHei', color: WHITE })],
    shading: { fill: color || DARK_NAVY, type: ShadingType.CLEAR },
    spacing: { before: 360, after: 160 },
    indent: { left: 0 },
  });
}

function noteBox(text, color) {
  const fill = color || 'EAF3FB';
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [9026],
    rows: [new TableRow({ children: [new TableCell({
      borders: { top: { style: BorderStyle.SINGLE, size: 4, color: BLUE },
                 bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                 left: { style: BorderStyle.SINGLE, size: 8, color: BLUE },
                 right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } },
      shading: { fill, type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 160, right: 160 },
      width: { size: 9026, type: WidthType.DXA },
      children: [new Paragraph({ children: [run(text)], spacing: { before: 60, after: 60 } })]
    })]})],
  });
}

function twoColTable(rows, w1 = 2800, w2 = 6226) {
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [w1, w2],
    rows: rows.map((row, i) => new TableRow({ children: [
      new TableCell({
        borders: BORDERS,
        shading: { fill: i === 0 ? DARK_NAVY : GRAY, type: ShadingType.CLEAR },
        width: { size: w1, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: row[0], bold: true, size: 20, font: 'Microsoft JhengHei', color: i === 0 ? WHITE : TEXT })] })]
      }),
      new TableCell({
        borders: BORDERS,
        shading: { fill: i === 0 ? DARK_NAVY : WHITE, type: ShadingType.CLEAR },
        width: { size: w2, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: row[1], size: 20, font: 'Microsoft JhengHei', color: i === 0 ? WHITE : TEXT })] })]
      }),
    ]}))
  });
}

const EVAL_URL = 'https://asics49.github.io/pe-tools/';
const TOOL_URL = 'https://asics49.github.io/pe-tools/pe-class-tools.html';
const UPLOAD_URL = 'https://script.google.com/macros/s/AKfycbyjVAz-JmkUU78HcnSMFjdsVa7FUPlAatFUhB1Yfbp2FantL5xG0dQ9cZR7qoSymHxQBw/exec';

const doc = new Document({
  numbering: {
    config: [
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•',
          alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } }] },
      { reference: 'sub-bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '◦',
          alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 240 } } } }] },
      { reference: 'steps', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.',
          alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 520, hanging: 280 } } } }] },
    ]
  },
  styles: {
    default: { document: { run: { font: 'Microsoft JhengHei', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 40, bold: true, font: 'Microsoft JhengHei', color: DARK_NAVY },
        paragraph: { spacing: { before: 480, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, font: 'Microsoft JhengHei', color: DARK_NAVY },
        paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 26, bold: true, font: 'Microsoft JhengHei', color: DARK_NAVY },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4
        margin: { top: 1440, right: 1134, bottom: 1440, left: 1134 }
      }
    },
    headers: {
      default: new Header({ children: [
        new Paragraph({
          children: [
            new TextRun({ text: '右昌國小體育班評鑑文件工具　使用說明', size: 18, font: 'Microsoft JhengHei', color: WHITE }),
          ],
          shading: { fill: DARK_NAVY, type: ShadingType.CLEAR },
          alignment: AlignmentType.CENTER,
        })
      ]})
    },
    footers: {
      default: new Footer({ children: [
        new Paragraph({
          children: [
            new TextRun({ text: '右昌國小體育組　　', size: 18, font: 'Microsoft JhengHei', color: '888888' }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, font: 'Microsoft JhengHei', color: '888888' }),
            new TextRun({ text: ' / ', size: 18, color: '888888' }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, font: 'Microsoft JhengHei', color: '888888' }),
          ],
          alignment: AlignmentType.CENTER,
        })
      ]})
    },
    children: [

      // ── 封面 ──────────────────────────────────────────────
      new Paragraph({ children: [], spacing: { before: 1200, after: 0 } }),
      new Paragraph({
        children: [new TextRun({ text: '右昌國小　體育班評鑑', bold: true, size: 56, font: 'Microsoft JhengHei', color: DARK_NAVY })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 160 },
      }),
      new Paragraph({
        children: [new TextRun({ text: '文件工具使用說明', bold: true, size: 48, font: 'Microsoft JhengHei', color: GOLD })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 800 },
      }),
      new Paragraph({
        children: [new TextRun({ text: '本說明適用對象：體育班各科任課教師、班導師、體育組行政人員', size: 22, font: 'Microsoft JhengHei', color: '555555' })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 120 },
      }),
      new Paragraph({
        children: [new TextRun({ text: '版本：115 學年度　　製作：右昌國小體育組', size: 20, font: 'Microsoft JhengHei', color: '888888' })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 1200 },
      }),

      // ── 目錄 ──────────────────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new Bookmark({ id: 'toc', children: [new TextRun({ text: '目　錄', bold: true, size: 40, font: 'Microsoft JhengHei', color: DARK_NAVY })] })],
      }),
      new TableOfContents('目錄', { hyperlink: true, headingStyleRange: '1-3' }),

      // ── 第一章 系統簡介 ───────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new Bookmark({ id: 'ch1', children: [new TextRun({ text: '一、系統簡介', bold: true, size: 40, font: 'Microsoft JhengHei', color: DARK_NAVY })] })],
      }),

      p([run('右昌國小體育班評鑑文件工具包含兩個主要頁面，協助全體評鑑相關人員完成文件準備與上傳作業：')]),
      new Paragraph({ spacing: { before: 120, after: 120 } }),

      twoColTable([
        ['頁面', '功能說明'],
        ['評鑑總覽', '列出所有 89 筆評鑑文件，可篩選負責人員，並快速開啟對應工具、上傳資料夾或參考資料'],
        ['文件產生工具', '提供 5 種常用表單的線上填寫與 Word 下載功能（照片佐證、補課記錄、成果報告等）'],
      ]),

      new Paragraph({ spacing: { before: 200, after: 80 } }),
      p([run('系統網址：')]),
      p([run('  評鑑總覽　'), link(EVAL_URL, EVAL_URL)]),
      p([run('  工具頁面　'), link(TOOL_URL, TOOL_URL)]),
      p([run('  上傳系統　'), link(UPLOAD_URL, UPLOAD_URL)]),

      // ── 第二章 評鑑總覽網頁 ──────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new Bookmark({ id: 'ch2', children: [new TextRun({ text: '二、如何使用評鑑總覽網頁', bold: true, size: 40, font: 'Microsoft JhengHei', color: DARK_NAVY })] })],
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: '2.1　開啟頁面', bold: true, size: 32, font: 'Microsoft JhengHei', color: DARK_NAVY })],
      }),
      p([run('在瀏覽器（建議使用 Chrome）輸入以下網址，或掃描 QR Code 開啟評鑑總覽：')]),
      p([link(EVAL_URL, EVAL_URL)]),
      noteBox('提示：建議將此頁面加入瀏覽器書籤，方便日後快速開啟。'),
      new Paragraph({ spacing: { before: 100 } }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: '2.2　頁面結構說明', bold: true, size: 32, font: 'Microsoft JhengHei', color: DARK_NAVY })],
      }),
      p('頁面由上到下分為三個區塊：'),
      bullet('頂部模組卡片列：快速開啟各種工具（文件產生、資料上傳）'),
      bullet('負責人員篩選列：點選姓名，只顯示該人員負責的項目'),
      bullet('評鑑文件清單：依大指標（壹、貳、肆）分組列出所有 89 筆文件'),
      new Paragraph({ spacing: { before: 120 } }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: '2.3　篩選負責人員', bold: true, size: 32, font: 'Microsoft JhengHei', color: DARK_NAVY })],
      }),
      p('頁面頂端有負責人員的篩選按鈕列，可依需求篩選：'),
      bullet('點選自己的名字或身份（如：體育班導師、體育老師），頁面會只顯示您負責的評鑑項目'),
      bullet('點選「全部」可還原顯示所有項目'),
      bullet('可直接點選任一人員名稱，系統自動過濾'),
      new Paragraph({ spacing: { before: 120 } }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: '2.4　三種功能按鈕說明', bold: true, size: 32, font: 'Microsoft JhengHei', color: DARK_NAVY })],
      }),
      p('每筆評鑑文件右側有最多三個顏色按鈕：'),
      new Paragraph({ spacing: { before: 80 } }),

      twoColTable([
        ['按鈕顏色', '功能說明'],
        ['金色　使用工具', '開啟對應的文件產生工具（填表後可下載 Word 檔）'],
        ['綠色　上傳文件', '開啟 Google Drive 上傳資料夾，或開啟體育組上傳系統'],
        ['藍色　參考資料', '開啟 Google Drive 參考資料資料夾（範本、參考文件）'],
      ], 2800, 6226),

      new Paragraph({ spacing: { before: 120 } }),
      noteBox('注意：部分文件沒有對應的產生工具，金色按鈕不會出現。若按鈕為灰色或無反應，表示該項目尚未建立連結。'),
      new Paragraph({ spacing: { before: 80 } }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: '2.5　模組卡片快速導航', bold: true, size: 32, font: 'Microsoft JhengHei', color: DARK_NAVY })],
      }),
      p('頁面頂部有工具模組卡片，點選可快速開啟對應工具分頁：'),
      bullet('照片佐證資料（m1）'),
      bullet('補課紀錄表（m2）'),
      bullet('成果報告表頭（m3a）'),
      bullet('開課課程一覽（m3b）'),
      bullet('職業試探活動（m4）'),
      bullet('體育組資料上傳系統'),

      // ── 第三章 上傳評鑑文件 ──────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new Bookmark({ id: 'ch3', children: [new TextRun({ text: '三、如何上傳評鑑文件', bold: true, size: 40, font: 'Microsoft JhengHei', color: DARK_NAVY })] })],
      }),

      p('上傳評鑑文件有兩種方式，依情況選用：'),
      new Paragraph({ spacing: { before: 80 } }),

      twoColTable([
        ['方式', '適用情境'],
        ['方式 A　透過上傳系統', '需要記錄上傳者姓名、自動分類存放時使用'],
        ['方式 B　直接存入資料夾', '已有完整檔案，直接上傳到指定 Drive 資料夾'],
      ], 2800, 6226),

      new Paragraph({ spacing: { before: 240 } }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: '3.1　方式 A：使用體育組上傳系統', bold: true, size: 32, font: 'Microsoft JhengHei', color: DARK_NAVY })],
      }),
      p('從評鑑總覽點選綠色「上傳文件」按鈕，若連結到上傳系統，請依以下步驟操作：'),
      new Paragraph({ spacing: { before: 80 } }),

      new Paragraph({ numbering: { reference: 'steps', level: 0 },
        children: [bold('選擇學年度'), run('　從下拉選單選擇「115學年度」')],
        spacing: { before: 80, after: 40 } }),
      new Paragraph({ numbering: { reference: 'steps', level: 0 },
        children: [bold('選擇資料類型'), run('　選擇「文件」、「成果」或「計畫」')],
        spacing: { before: 80, after: 40 } }),
      new Paragraph({ numbering: { reference: 'steps', level: 0 },
        children: [bold('選擇體育項目'), run('　選擇對應的體育班項目')],
        spacing: { before: 80, after: 40 } }),
      new Paragraph({ numbering: { reference: 'steps', level: 0 },
        children: [bold('輸入評鑑子項目'), run('　填入對應子標號，例如：1-1 體育班發展委員會')],
        spacing: { before: 80, after: 40 } }),
      new Paragraph({ numbering: { reference: 'steps', level: 0 },
        children: [bold('選擇檔案'), run('　點選上傳區域，選取要上傳的檔案（可多選）')],
        spacing: { before: 80, after: 40 } }),
      new Paragraph({ numbering: { reference: 'steps', level: 0 },
        children: [bold('填入姓名'), run('　輸入您的姓名（系統會記住，下次自動帶入）')],
        spacing: { before: 80, after: 40 } }),
      new Paragraph({ numbering: { reference: 'steps', level: 0 },
        children: [bold('選擇上傳日期'), run('　預設為今天，可依需求修改')],
        spacing: { before: 80, after: 40 } }),
      new Paragraph({ numbering: { reference: 'steps', level: 0 },
        children: [bold('點選「開始上傳」'), run('　等待上傳完成，系統會顯示成功訊息')],
        spacing: { before: 80, after: 40 } }),

      new Paragraph({ spacing: { before: 120 } }),
      noteBox('小提示：若從評鑑總覽點選綠色按鈕進入上傳系統，學年度、評鑑子項目等欄位會自動帶入，只需填入姓名並選取檔案即可。'),
      new Paragraph({ spacing: { before: 80 } }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: '3.2　方式 B：直接存入 Drive 資料夾', bold: true, size: 32, font: 'Microsoft JhengHei', color: DARK_NAVY })],
      }),
      p('若要直接上傳到 Google Drive，請依以下步驟：'),
      new Paragraph({ spacing: { before: 80 } }),
      new Paragraph({ numbering: { reference: 'steps', level: 0 },
        children: [bold('開啟評鑑總覽'), run('　前往 ' + EVAL_URL)],
        spacing: { before: 80, after: 40 } }),
      new Paragraph({ numbering: { reference: 'steps', level: 0 },
        children: [bold('找到對應文件'), run('　篩選負責人員後找到對應的評鑑項目')],
        spacing: { before: 80, after: 40 } }),
      new Paragraph({ numbering: { reference: 'steps', level: 0 },
        children: [bold('點選綠色「上傳文件」'), run('　會開啟該項目的 Google Drive 資料夾')],
        spacing: { before: 80, after: 40 } }),
      new Paragraph({ numbering: { reference: 'steps', level: 0 },
        children: [bold('登入學校帳號'), run('　需使用 @yocps.kh.edu.tw 帳號登入，才有上傳權限')],
        spacing: { before: 80, after: 40 } }),
      new Paragraph({ numbering: { reference: 'steps', level: 0 },
        children: [bold('上傳檔案'), run('　在 Drive 資料夾中直接拖曳或點選「新增」上傳檔案')],
        spacing: { before: 80, after: 40 } }),

      new Paragraph({ spacing: { before: 120 } }),
      noteBox('注意：上傳文件資料夾限學校網域帳號（@yocps.kh.edu.tw）使用，個人 Gmail 帳號無法上傳。若出現「沒有存取權限」，請確認是否已登入學校帳號。'),

      // ── 第四章 文件產生工具 ──────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new Bookmark({ id: 'ch4', children: [new TextRun({ text: '四、如何使用文件產生工具', bold: true, size: 40, font: 'Microsoft JhengHei', color: DARK_NAVY })] })],
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: '4.1　開啟工具頁面', bold: true, size: 32, font: 'Microsoft JhengHei', color: DARK_NAVY })],
      }),
      p('文件產生工具有兩種開啟方式：'),
      bullet('從評鑑總覽點選金色「使用工具」按鈕（會直接跳到對應分頁）'),
      bullet('直接輸入網址：' + TOOL_URL),

      new Paragraph({ spacing: { before: 160 } }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: '4.2　工具分頁說明', bold: true, size: 32, font: 'Microsoft JhengHei', color: DARK_NAVY })],
      }),
      p('工具頁面共有 5 個分頁，以下分別說明：'),
      new Paragraph({ spacing: { before: 80 } }),

      twoColTable([
        ['模組', '功能'],
        ['m1　照片佐證資料', '填入活動資訊與照片說明，產生照片佐證資料表 Word 檔'],
        ['m2　補課紀錄表', '填入補課日期、課程內容等，產生補課紀錄表 Word 檔'],
        ['m3a　成果報告表頭', '填入成果報告標題與基本資料，產生表頭 Word 檔'],
        ['m3b　開課課程一覽', '填入開課資訊，產生開課課程一覽表 Word 檔'],
        ['m4　職業試探活動', '填入活動資料，產生職業試探活動紀錄 Word 檔'],
      ], 2400, 6626),

      new Paragraph({ spacing: { before: 160 } }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: '4.3　使用步驟', bold: true, size: 32, font: 'Microsoft JhengHei', color: DARK_NAVY })],
      }),
      new Paragraph({ numbering: { reference: 'steps', level: 0 },
        children: [bold('選擇分頁'), run('　點選頁面頂部對應的模組標籤（m1～m4）')],
        spacing: { before: 80, after: 40 } }),
      new Paragraph({ numbering: { reference: 'steps', level: 0 },
        children: [bold('填寫表單'), run('　依欄位填入相關資料，標示 * 的為必填欄位')],
        spacing: { before: 80, after: 40 } }),
      new Paragraph({ numbering: { reference: 'steps', level: 0 },
        children: [bold('點選「下載 Word 檔」'), run('　系統自動產生並下載 .docx 格式文件')],
        spacing: { before: 80, after: 40 } }),
      new Paragraph({ numbering: { reference: 'steps', level: 0 },
        children: [bold('確認文件內容'), run('　用 Word 或 Google 文件開啟，確認內容是否正確')],
        spacing: { before: 80, after: 40 } }),
      new Paragraph({ numbering: { reference: 'steps', level: 0 },
        children: [bold('上傳至 Drive'), run('　確認無誤後，依第三章步驟上傳到對應資料夾')],
        spacing: { before: 80, after: 40 } }),

      new Paragraph({ spacing: { before: 120 } }),
      noteBox('提示：使用工具時建議開啟對應的「參考資料」資料夾（藍色按鈕），可對照範本填寫，確保格式正確。'),

      // ── 第五章 常見問題 ──────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new Bookmark({ id: 'ch5', children: [new TextRun({ text: '五、常見問題（Q&A）', bold: true, size: 40, font: 'Microsoft JhengHei', color: DARK_NAVY })] })],
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun({ text: 'Q1：點選綠色按鈕後顯示「沒有存取權限」？', bold: true, size: 26, font: 'Microsoft JhengHei', color: RED_BADGE })],
      }),
      p('A：請確認您已用學校帳號（@yocps.kh.edu.tw）登入 Google。開啟 Google Drive 後切換到學校帳號，再重新點選按鈕。'),
      new Paragraph({ spacing: { before: 80 } }),

      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun({ text: 'Q2：下載的 Word 檔打開是亂碼？', bold: true, size: 26, font: 'Microsoft JhengHei', color: RED_BADGE })],
      }),
      p('A：請確認使用支援 .docx 格式的軟體開啟，建議使用 Microsoft Word 2016 以上版本，或用 Google 文件開啟。'),
      new Paragraph({ spacing: { before: 80 } }),

      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun({ text: 'Q3：上傳後找不到檔案？', bold: true, size: 26, font: 'Microsoft JhengHei', color: RED_BADGE })],
      }),
      p('A：透過上傳系統上傳的檔案會存放在對應的評鑑子項目資料夾中。可從評鑑總覽點選對應項目的綠色按鈕，直接開啟 Drive 資料夾查看。'),
      new Paragraph({ spacing: { before: 80 } }),

      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun({ text: 'Q4：可以用手機上傳嗎？', bold: true, size: 26, font: 'Microsoft JhengHei', color: RED_BADGE })],
      }),
      p('A：可以。評鑑總覽和上傳系統都支援手機瀏覽器，但建議使用電腦操作以獲得最佳體驗。'),
      new Paragraph({ spacing: { before: 80 } }),

      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun({ text: 'Q5：同一個子項目可以上傳多個檔案嗎？', bold: true, size: 26, font: 'Microsoft JhengHei', color: RED_BADGE })],
      }),
      p('A：可以。上傳系統支援一次選取多個檔案，也可以分多次上傳，所有檔案都會存放在同一個資料夾中。'),
      new Paragraph({ spacing: { before: 80 } }),

      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun({ text: 'Q6：如何查看藍色參考資料？', bold: true, size: 26, font: 'Microsoft JhengHei', color: RED_BADGE })],
      }),
      p('A：點選評鑑項目旁的藍色「參考資料」按鈕，即可開啟 Google Drive 上的參考資料資料夾。同樣需要使用學校帳號登入方可瀏覽。'),
      new Paragraph({ spacing: { before: 80 } }),

      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun({ text: 'Q7：忘記自己負責哪些項目？', bold: true, size: 26, font: 'Microsoft JhengHei', color: RED_BADGE })],
      }),
      p('A：在評鑑總覽頁面頂端點選您的姓名或身份（如「體育班導師」），頁面會只顯示您負責的評鑑文件。'),
      new Paragraph({ spacing: { before: 200 } }),

      // ── 聯絡與支援 ───────────────────────────────────────
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new Bookmark({ id: 'ch6', children: [new TextRun({ text: '六、聯絡與支援', bold: true, size: 40, font: 'Microsoft JhengHei', color: DARK_NAVY })] })],
      }),
      p('若遇到本說明未涵蓋的問題，請聯絡體育組行政人員，或直接在學校信箱傳送截圖說明問題情況。'),
      new Paragraph({ spacing: { before: 80 } }),
      p([bold('體育組信箱：'), run('asics49@yocps.kh.edu.tw')]),
      p([bold('系統網址（評鑑總覽）：'), link(EVAL_URL, EVAL_URL)]),
      p([bold('文件產生工具：'), link(TOOL_URL, TOOL_URL)]),
      new Paragraph({ spacing: { before: 400 } }),
      new Paragraph({
        children: [new TextRun({ text: '右昌國小體育組　115 學年度', size: 20, font: 'Microsoft JhengHei', color: '888888' })],
        alignment: AlignmentType.CENTER,
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('右昌國小體育班評鑑文件工具使用說明.docx', buf);
  console.log('Done');
});
