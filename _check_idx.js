
const TOOL_URL = 'pe-class-tools.html';

const MODULES = [
  { id: 'm1',  badge: '模組一',   name: '照片佐證資料' },
  { id: 'm2',  badge: '模組二',   name: '補課紀錄表' },
  { id: 'm3a', badge: '模組三A',  name: '成果報告表頭' },
  { id: 'm3b', badge: '模組三B',  name: '開課課程一覽' },
  { id: 'm4',  badge: '模組四',   name: '職業試探活動' },
];

// ── Render module cards ──
var mc = document.getElementById('moduleCards');
MODULES.forEach(function(m){
  var a = document.createElement('a');
  a.className = 'module-card';
  a.href = TOOL_URL + '#' + m.id;
  a.target = '_blank';
  a.innerHTML = '<span class="module-card-badge">'+m.badge+'</span>'
    + '<span class="module-card-name">'+m.name+'</span>'
    + '<span class="module-card-arrow">開啟工具 →</span>';
  mc.appendChild(a);
});

const DATA = [
  {
    major: '壹、設班現況',
    subs: [
      {
        id: '1-1', name: '體育班發展委員會設立與運作',
        docs: [
          { name: '體育班發展委員會會議紀錄', person: '學務主任/體育組長', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1ivl6OTNuDMxlyWKy_-3TXDi6LpeCLgad', refUrl: 'https://drive.google.com/drive/folders/1XmFy7IWNUBdHExNu7V3vNoT7WVC69RH2' },
          { name: '體發會委員組織辦法', person: '學務主任/體育組長', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/1ivl6OTNuDMxlyWKy_-3TXDi6LpeCLgad', refUrl: 'https://drive.google.com/drive/folders/1XmFy7IWNUBdHExNu7V3vNoT7WVC69RH2' },
        ]
      },
      {
        id: '1-1-2', name: '體育班課程規劃程序',
        docs: [
          { name: '課發會會議紀錄', person: '教務處', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1Y-kJN1f86ke-97VeBhh8-Fty31_ou7yr', refUrl: 'https://drive.google.com/drive/folders/1gvRmSFhCwDpKgaWsaUPT2mMappYSu6Gk' },
          { name: '課發會組織設置要點', person: '教務處', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/1Y-kJN1f86ke-97VeBhh8-Fty31_ou7yr', refUrl: 'https://drive.google.com/drive/folders/1gvRmSFhCwDpKgaWsaUPT2mMappYSu6Gk' },
          { name: '12年國教校定課程計畫', person: '教務處', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/1Y-kJN1f86ke-97VeBhh8-Fty31_ou7yr', refUrl: 'https://drive.google.com/drive/folders/1gvRmSFhCwDpKgaWsaUPT2mMappYSu6Gk' },
          { name: '5年級專長課程計畫（上下學期）', person: '體育專長教師', type: '需制式範本', module: 'm3b', driveUrl: 'https://drive.google.com/drive/folders/1Y-kJN1f86ke-97VeBhh8-Fty31_ou7yr', refUrl: 'https://drive.google.com/drive/folders/1gvRmSFhCwDpKgaWsaUPT2mMappYSu6Gk' },
          { name: '6年級專長課程計畫（上下學期）', person: '體育專長教師', type: '需制式範本', module: 'm3b', driveUrl: 'https://drive.google.com/drive/folders/1Y-kJN1f86ke-97VeBhh8-Fty31_ou7yr', refUrl: 'https://drive.google.com/drive/folders/1gvRmSFhCwDpKgaWsaUPT2mMappYSu6Gk' },
        ]
      },
      {
        id: '1-1-3', name: '課業成績出賽基準之訂定情形',
        docs: [
          { name: '體育班參賽基準', person: '學務主任/體育組長', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1R64hkSB1zp3F6sXugg2V4v7kw1-RDAYF', refUrl: 'https://drive.google.com/drive/folders/1E4gJ0SmBC0GEch8bwrHIdaROtVpijhZn' },
          { name: '第一次體發會通過紀錄', person: '學務主任/體育組長', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1R64hkSB1zp3F6sXugg2V4v7kw1-RDAYF', refUrl: 'https://drive.google.com/drive/folders/1E4gJ0SmBC0GEch8bwrHIdaROtVpijhZn' },
        ]
      },
      {
        id: '1-1-4', name: '體育班設班運動種類、招生人數、方式',
        docs: [
          { name: '招生簡章', person: '學務主任/體育組長', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/1U7OLUlZlo_Hv6VDg_fGOyJuooewJAey7', refUrl: 'https://drive.google.com/drive/folders/1gsF93O2q8XVpZWeDBS6yzZT8X7BPuH4X' },
          { name: '體育班錄取名單', person: '學務主任/體育組長', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1U7OLUlZlo_Hv6VDg_fGOyJuooewJAey7', refUrl: 'https://drive.google.com/drive/folders/1gsF93O2q8XVpZWeDBS6yzZT8X7BPuH4X' },
        ]
      },
      {
        id: '2-1-1', name: '一般學科及體育專業學科課程師資聘任',
        docs: [
          { name: '體育班專科授課師資一覽表', person: '學務主任/體育組長/人事室', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1oXvo9Vu3yWkjOkDGBuCTh1sRTeP0QGSj', refUrl: 'https://drive.google.com/drive/folders/1WXVu4bPtYe9rs0M0TnCDCI4viW8Uml7b' },
          { name: '師資證明文件（掃描件）', person: '人事室', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/1oXvo9Vu3yWkjOkDGBuCTh1sRTeP0QGSj', refUrl: 'https://drive.google.com/drive/folders/1WXVu4bPtYe9rs0M0TnCDCI4viW8Uml7b' },
          { name: '體育專項科目授課師資一覽表', person: '體育組長', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1oXvo9Vu3yWkjOkDGBuCTh1sRTeP0QGSj', refUrl: 'https://drive.google.com/drive/folders/1WXVu4bPtYe9rs0M0TnCDCI4viW8Uml7b' },
        ]
      },
      {
        id: '2-1-2', name: '體育專項術科師資聘任情形',
        docs: [
          { name: '體育班課表與授課師資名單', person: '體育組長', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1YXqHTLrvvldqk7h1owgUcCB-ispxyW75', refUrl: 'https://drive.google.com/drive/folders/1faJAe_KGbbg5d52YwQN4eLJ3SpuFCxn7' },
          { name: '專任運動教練聘書（掃描件）', person: '人事室', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/1YXqHTLrvvldqk7h1owgUcCB-ispxyW75', refUrl: 'https://drive.google.com/drive/folders/1faJAe_KGbbg5d52YwQN4eLJ3SpuFCxn7' },
        ]
      },
      {
        id: '2-1-3', name: '體育教師與設班種類是否相符',
        docs: [
          { name: '體育專科授課師資一覽表', person: '體育組長', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1CMFFtc7o93iPSFmdFofW8WAyzG5CAsSp', refUrl: 'https://drive.google.com/drive/folders/1_lLP6V2MkOi-uJFWo0eNxAVNoj5EKvyt' },
        ]
      },
      {
        id: '2-1-4', name: '學校聘任專任運動教練情形',
        docs: [
          { name: '田徑/足球教練專長證照（掃描件）', person: '體育組長', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/1jNhgHvRtm3rSzQGO8WncoDV30Q7wevas', refUrl: 'https://drive.google.com/drive/folders/154L74raJgiu_v3-UvtA9sA6NuJ_oZ-D7' },
          { name: '專任運動教練聘書', person: '人事室', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/1jNhgHvRtm3rSzQGO8WncoDV30Q7wevas', refUrl: 'https://drive.google.com/drive/folders/154L74raJgiu_v3-UvtA9sA6NuJ_oZ-D7' },
          { name: '專任運動教練審議委員會會議紀錄', person: '學務主任', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1jNhgHvRtm3rSzQGO8WncoDV30Q7wevas', refUrl: 'https://drive.google.com/drive/folders/154L74raJgiu_v3-UvtA9sA6NuJ_oZ-D7' },
        ]
      },
      {
        id: '3-1-1', name: '體育班訓練專用場地、空間',
        docs: [
          { name: '學校運動場館資訊說明', person: '學務主任/體育組長', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1gWSYnJp1rHlm-zpCZu0TDKHU3rvNcDIN', refUrl: 'https://drive.google.com/drive/folders/170c3sBysJ9o725ZjGN3y8xnz_4g3lCjW' },
          { name: '運動場館資料（含照片）', person: '體育組長', type: '照片佐證', module: 'm1', driveUrl: 'https://drive.google.com/drive/folders/1gWSYnJp1rHlm-zpCZu0TDKHU3rvNcDIN', refUrl: 'https://drive.google.com/drive/folders/170c3sBysJ9o725ZjGN3y8xnz_4g3lCjW' },
        ]
      },
      {
        id: '3-1-2', name: '體育班設備器材管理、維護及更新',
        docs: [
          { name: '場地維護紀錄表', person: '總務主任/事務組長', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1QlgFQPpP-saEgrya7UI4zAnYq1vAkaCQ', refUrl: 'https://drive.google.com/drive/folders/1H8mc4Dy7XPNqS_xWoDUq-bqsWAYU3j2X' },
          { name: '體育設施檢核表', person: '總務主任', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1QlgFQPpP-saEgrya7UI4zAnYq1vAkaCQ', refUrl: 'https://drive.google.com/drive/folders/1H8mc4Dy7XPNqS_xWoDUq-bqsWAYU3j2X' },
          { name: '場館損壞自評及訪視意見表', person: '總務主任', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1QlgFQPpP-saEgrya7UI4zAnYq1vAkaCQ', refUrl: 'https://drive.google.com/drive/folders/1H8mc4Dy7XPNqS_xWoDUq-bqsWAYU3j2X' },
          { name: '場館管理注意事項/使用守則', person: '體育組長', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/1QlgFQPpP-saEgrya7UI4zAnYq1vAkaCQ', refUrl: 'https://drive.google.com/drive/folders/1H8mc4Dy7XPNqS_xWoDUq-bqsWAYU3j2X' },
        ]
      },
      {
        id: '3-2-1', name: '運動防護措施',
        docs: [
          { name: '運動意外傷害處理程序', person: '護理師', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/1UNPLzf5DzQHMAntGcbUslNiINzBnQ18L', refUrl: 'https://drive.google.com/drive/folders/1O_kNR3dlJfnjvVsX1vEpU5NJTayFAsuy' },
          { name: '教師健康促進研習活動成果', person: '護理師/體育組長', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1UNPLzf5DzQHMAntGcbUslNiINzBnQ18L', refUrl: 'https://drive.google.com/drive/folders/1O_kNR3dlJfnjvVsX1vEpU5NJTayFAsuy' },
          { name: '運動傷害與防護教學（照片）', person: '各團隊教師', type: '照片佐證', module: 'm1', driveUrl: 'https://drive.google.com/drive/folders/1UNPLzf5DzQHMAntGcbUslNiINzBnQ18L', refUrl: 'https://drive.google.com/drive/folders/1O_kNR3dlJfnjvVsX1vEpU5NJTayFAsuy' },
          { name: '校園緊急傷病事件處理要點', person: '護理師', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/1UNPLzf5DzQHMAntGcbUslNiINzBnQ18L', refUrl: 'https://drive.google.com/drive/folders/1O_kNR3dlJfnjvVsX1vEpU5NJTayFAsuy' },
          { name: '體育班與醫療院所簽訂契約', person: '學務主任', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/1UNPLzf5DzQHMAntGcbUslNiINzBnQ18L', refUrl: 'https://drive.google.com/drive/folders/1O_kNR3dlJfnjvVsX1vEpU5NJTayFAsuy' },
          { name: '運動防護相關證照（掃描件）', person: '護理師/教練', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/1UNPLzf5DzQHMAntGcbUslNiINzBnQ18L', refUrl: 'https://drive.google.com/drive/folders/1O_kNR3dlJfnjvVsX1vEpU5NJTayFAsuy' },
        ]
      },
      {
        id: '3-2-2', name: '運動防護紀錄',
        docs: [
          { name: '體育班學生傷害防護日誌', person: '護理師', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/17ghVUlzLSnahPLcVY9tEzojIcxqUPnAc', refUrl: 'https://drive.google.com/drive/folders/18cw-dhmvogQ4XYUxMceP1bahY8QRuiNn' },
          { name: '運動防護教學記錄', person: '體育組', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/17ghVUlzLSnahPLcVY9tEzojIcxqUPnAc', refUrl: 'https://drive.google.com/drive/folders/18cw-dhmvogQ4XYUxMceP1bahY8QRuiNn' },
          { name: '體育班健康適能評估表', person: '護理師', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/17ghVUlzLSnahPLcVY9tEzojIcxqUPnAc', refUrl: 'https://drive.google.com/drive/folders/18cw-dhmvogQ4XYUxMceP1bahY8QRuiNn' },
          { name: '聯合醫院合作備忘錄', person: '學務主任', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/17ghVUlzLSnahPLcVY9tEzojIcxqUPnAc', refUrl: 'https://drive.google.com/drive/folders/18cw-dhmvogQ4XYUxMceP1bahY8QRuiNn' },
          { name: '運動防護員契約', person: '學務主任', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/17ghVUlzLSnahPLcVY9tEzojIcxqUPnAc', refUrl: 'https://drive.google.com/drive/folders/18cw-dhmvogQ4XYUxMceP1bahY8QRuiNn' },
        ]
      },
    ]
  },
  {
    major: '貳、運作情形',
    subs: [
      {
        id: '1-1-1', name: '公部門經費編列情形',
        docs: [
          { name: '學年度經費支出明細表', person: '會計室', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1rmOaquV5do-YCjCL6Qt5rxnods-KWkvu', refUrl: 'https://drive.google.com/drive/folders/1anV90dnuW7_g499pwEIlyaD9Cy-ZmCBk' },
          { name: '各項經費申請核定表', person: '會計室', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/1rmOaquV5do-YCjCL6Qt5rxnods-KWkvu', refUrl: 'https://drive.google.com/drive/folders/1anV90dnuW7_g499pwEIlyaD9Cy-ZmCBk' },
        ]
      },
      {
        id: '1-1-2', name: '籌措社會資源情形',
        docs: [
          { name: '對外籌募經費支出明細表', person: '會計室/體育組', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1MSPkFG2xQxrjsAAbUsdHltACh1gcCWm5', refUrl: 'https://drive.google.com/drive/folders/1hJ5iG6ZMQmQNWP88IGQwxuIQDOJeiTOO' },
          { name: '對外比賽經費補助辦法', person: '學務主任', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/1MSPkFG2xQxrjsAAbUsdHltACh1gcCWm5', refUrl: 'https://drive.google.com/drive/folders/1hJ5iG6ZMQmQNWP88IGQwxuIQDOJeiTOO' },
        ]
      },
      {
        id: '1-1-3', name: '公部門經費預算之執行情形',
        docs: [
          { name: '體育班經費支用明細表', person: '會計室', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1lD3sWTdXBwcWyNHtNg2aVfASimhw3bY7', refUrl: 'https://drive.google.com/drive/folders/1s2Gt6AYKTnzcVC4IjbcQwjXDdo3LhA_H' },
        ]
      },
      {
        id: '2-1-1', name: '課程及訓練計畫規劃情形',
        docs: [
          { name: '體育班課表及訓練規劃表', person: '體育組', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1Zq-UBfJD_kKDB_YtmsbdjUndsQsK_fyS', refUrl: 'https://drive.google.com/drive/folders/1zBPPF0BkvTpqvGlIsXpHgesrx1tHDcTt' },
          { name: '課程架構說明', person: '教學組', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1Zq-UBfJD_kKDB_YtmsbdjUndsQsK_fyS', refUrl: 'https://drive.google.com/drive/folders/1zBPPF0BkvTpqvGlIsXpHgesrx1tHDcTt' },
          { name: '5-6年級專長課程計畫', person: '體育班導師', type: '需制式範本', module: 'm3b', driveUrl: 'https://drive.google.com/drive/folders/1Zq-UBfJD_kKDB_YtmsbdjUndsQsK_fyS', refUrl: 'https://drive.google.com/drive/folders/1zBPPF0BkvTpqvGlIsXpHgesrx1tHDcTt' },
        ]
      },
      {
        id: '2-1-2', name: '課程實施情形',
        docs: [
          { name: '5年級班級日誌（上下學期連續4周）', person: '體育班導師', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/11nUFp5RZ4Wou1pRNpQxZNvuzB6Nhn4QN', refUrl: 'https://drive.google.com/drive/folders/1FRukI_hvD9xtKRgU0ji82MJpF9I9vb15' },
          { name: '6年級班級日誌（上下學期連續4周）', person: '體育班導師', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/11nUFp5RZ4Wou1pRNpQxZNvuzB6Nhn4QN', refUrl: 'https://drive.google.com/drive/folders/1FRukI_hvD9xtKRgU0ji82MJpF9I9vb15' },
          { name: '田徑隊訓練日誌（上下學期連續4周）', person: '田徑教練', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/11nUFp5RZ4Wou1pRNpQxZNvuzB6Nhn4QN', refUrl: 'https://drive.google.com/drive/folders/1FRukI_hvD9xtKRgU0ji82MJpF9I9vb15' },
          { name: '足球隊訓練日誌（上下學期連續4周）', person: '足球教練', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/11nUFp5RZ4Wou1pRNpQxZNvuzB6Nhn4QN', refUrl: 'https://drive.google.com/drive/folders/1FRukI_hvD9xtKRgU0ji82MJpF9I9vb15' },
        ]
      },
      {
        id: '2-1-3', name: '體育專項術科訓練規劃執行情形',
        docs: [
          { name: '田徑/足球訓練計畫', person: '田徑/足球教練', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1M_-hM7ynz2gPrgFVWhOeasSdWjm5sLEG', refUrl: 'https://drive.google.com/drive/folders/1HtVPEp2OFtBshMyjHuJW2-XKW-rGkj7k' },
          { name: '田徑/足球團隊公假統計表', person: '田徑/足球教練', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1M_-hM7ynz2gPrgFVWhOeasSdWjm5sLEG', refUrl: 'https://drive.google.com/drive/folders/1HtVPEp2OFtBshMyjHuJW2-XKW-rGkj7k' },
          { name: '體育班學生參賽日數統計表', person: '體育組', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1M_-hM7ynz2gPrgFVWhOeasSdWjm5sLEG', refUrl: 'https://drive.google.com/drive/folders/1HtVPEp2OFtBshMyjHuJW2-XKW-rGkj7k' },
          { name: '體育班競賽行事曆', person: '體育組', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1M_-hM7ynz2gPrgFVWhOeasSdWjm5sLEG', refUrl: 'https://drive.google.com/drive/folders/1HtVPEp2OFtBshMyjHuJW2-XKW-rGkj7k' },
        ]
      },
      {
        id: '3-1-1', name: '是否安排賽後補課情形',
        docs: [
          { name: '體育班生活輔導及課業輔導管理辦法', person: '體育組', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/1K6LYuoAgU0Hk8imz0Z6d6UXmn8CslzNm', refUrl: 'https://drive.google.com/drive/folders/1SEL73ltF2xoOkjMda6if9ebPJoOnYQQJ' },
          { name: '課業輔導實施計畫', person: '體育組', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/1K6LYuoAgU0Hk8imz0Z6d6UXmn8CslzNm', refUrl: 'https://drive.google.com/drive/folders/1SEL73ltF2xoOkjMda6if9ebPJoOnYQQJ' },
          { name: '5年級賽後補課紀錄表', person: '5年級體育班導師', type: '需制式範本', module: 'm2', driveUrl: 'https://drive.google.com/drive/folders/1K6LYuoAgU0Hk8imz0Z6d6UXmn8CslzNm', refUrl: 'https://drive.google.com/drive/folders/1SEL73ltF2xoOkjMda6if9ebPJoOnYQQJ' },
          { name: '6年級賽後補課紀錄表', person: '6年級體育班導師', type: '需制式範本', module: 'm2', driveUrl: 'https://drive.google.com/drive/folders/1K6LYuoAgU0Hk8imz0Z6d6UXmn8CslzNm', refUrl: 'https://drive.google.com/drive/folders/1SEL73ltF2xoOkjMda6if9ebPJoOnYQQJ' },
          { name: '補救教學測驗歷程記錄', person: '輔導室', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1K6LYuoAgU0Hk8imz0Z6d6UXmn8CslzNm', refUrl: 'https://drive.google.com/drive/folders/1SEL73ltF2xoOkjMda6if9ebPJoOnYQQJ' },
          { name: '課業輔導照片', person: '課輔教師', type: '照片佐證', module: 'm1', driveUrl: 'https://drive.google.com/drive/folders/1K6LYuoAgU0Hk8imz0Z6d6UXmn8CslzNm', refUrl: 'https://drive.google.com/drive/folders/1SEL73ltF2xoOkjMda6if9ebPJoOnYQQJ' },
          { name: '體育班課業輔導日誌', person: '課輔教師', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1K6LYuoAgU0Hk8imz0Z6d6UXmn8CslzNm', refUrl: 'https://drive.google.com/drive/folders/1SEL73ltF2xoOkjMda6if9ebPJoOnYQQJ' },
          { name: '體育班寒暑訓課表', person: '體育組', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1K6LYuoAgU0Hk8imz0Z6d6UXmn8CslzNm', refUrl: 'https://drive.google.com/drive/folders/1SEL73ltF2xoOkjMda6if9ebPJoOnYQQJ' },
        ]
      },
      {
        id: '3-1-2', name: '學業成績未達參賽基準執行情形',
        docs: [
          { name: '體育班學習輔助學生定期評量成績', person: '5/6年級導師', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1afEGk3w4lu2z7DdKTI0EA8eInCmABl1k', refUrl: 'https://drive.google.com/drive/folders/10u-Bn6KpRd_S8ipkVIGVeoxztC81klQj' },
          { name: '課業輔導照片', person: '課輔教師', type: '照片佐證', module: 'm1', driveUrl: 'https://drive.google.com/drive/folders/1afEGk3w4lu2z7DdKTI0EA8eInCmABl1k', refUrl: 'https://drive.google.com/drive/folders/10u-Bn6KpRd_S8ipkVIGVeoxztC81klQj' },
        ]
      },
      {
        id: '3-1-3', name: '課業輔導情形',
        docs: [
          { name: '體育班課業輔導課表', person: '體育組', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1m2ypMdKLFSCrTu6pv9bPwSNTowVLODK3', refUrl: 'https://drive.google.com/drive/folders/1H-gvptt5dNDe-JsP7e1cixbqSfxfAkGh' },
          { name: '（其餘資料同3-1-1）', person: '—', type: '—', module: null, driveUrl: 'https://drive.google.com/drive/folders/1m2ypMdKLFSCrTu6pv9bPwSNTowVLODK3', refUrl: 'https://drive.google.com/drive/folders/1H-gvptt5dNDe-JsP7e1cixbqSfxfAkGh' },
        ]
      },
      {
        id: '3-2', name: '生活輔導情形',
        docs: [
          { name: '5/6年級體育班輔導紀錄表', person: '體育班導師', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1n1DX46RgGs4m8c6U1PzOPY0odxKtyW9n', refUrl: 'https://drive.google.com/drive/folders/17BHglR9UArBoxhfsDsIsU2M3qmVuZYyj' },
          { name: '性別平等/家庭教育宣導佐證資料', person: '體育班導師', type: '照片佐證', module: 'm1', driveUrl: 'https://drive.google.com/drive/folders/1n1DX46RgGs4m8c6U1PzOPY0odxKtyW9n', refUrl: 'https://drive.google.com/drive/folders/17BHglR9UArBoxhfsDsIsU2M3qmVuZYyj' },
          { name: '春暉/反毒/反霸凌相關佐證照片', person: '體育班導師', type: '照片佐證', module: 'm1', driveUrl: 'https://drive.google.com/drive/folders/1n1DX46RgGs4m8c6U1PzOPY0odxKtyW9n', refUrl: 'https://drive.google.com/drive/folders/17BHglR9UArBoxhfsDsIsU2M3qmVuZYyj' },
        ]
      },
      {
        id: '3-3', name: '升學輔導情形',
        docs: [
          { name: '體育班升學輔導實施計畫', person: '輔導室', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/15eUuBQToq3TefB4NvvJGsO6TvTd_8UZl', refUrl: 'https://drive.google.com/drive/folders/164dQrZVdxxSytIijLaMvlxk7U5bhPkOn' },
          { name: '升學輔導講座佐證資料及照片', person: '輔導室', type: '照片佐證', module: 'm1', driveUrl: 'https://drive.google.com/drive/folders/15eUuBQToq3TefB4NvvJGsO6TvTd_8UZl', refUrl: 'https://drive.google.com/drive/folders/164dQrZVdxxSytIijLaMvlxk7U5bhPkOn' },
          { name: '體育班銜續訓練情形一覽表', person: '導師及教練', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/15eUuBQToq3TefB4NvvJGsO6TvTd_8UZl', refUrl: 'https://drive.google.com/drive/folders/164dQrZVdxxSytIijLaMvlxk7U5bhPkOn' },
        ]
      },
      {
        id: '3-4', name: '生涯發展執行情形',
        docs: [
          { name: '職業試探活動計畫', person: '輔導室', type: '既有公文', module: 'm4', driveUrl: 'https://drive.google.com/drive/folders/1OK9ECRKdQ_3_p1-Rh5O5fMqwsQt98KFU', refUrl: 'https://drive.google.com/drive/folders/1eZ9VRkdG7OBQHheUzWliqskUjDQwybRH' },
          { name: '生涯發展教育成果', person: '輔導室/導師', type: '需制式範本', module: 'm4', driveUrl: 'https://drive.google.com/drive/folders/1OK9ECRKdQ_3_p1-Rh5O5fMqwsQt98KFU', refUrl: 'https://drive.google.com/drive/folders/1eZ9VRkdG7OBQHheUzWliqskUjDQwybRH' },
          { name: '生涯發展講座佐證照片', person: '輔導室', type: '照片佐證', module: 'm1', driveUrl: 'https://drive.google.com/drive/folders/1OK9ECRKdQ_3_p1-Rh5O5fMqwsQt98KFU', refUrl: 'https://drive.google.com/drive/folders/1eZ9VRkdG7OBQHheUzWliqskUjDQwybRH' },
        ]
      },
      {
        id: '4-1', name: '性別平等教育措施',
        docs: [
          { name: '性別平等教育實施計畫', person: '生教組', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/1O72fUGf-0YSbRF5_u-BTHsDOUEIU33yw', refUrl: 'https://drive.google.com/drive/folders/1RHj_hrgJLpstbTOSiQ_fIr8dSyqFZ8LT' },
          { name: '性別平等教育佐證照片', person: '生教組/導師', type: '照片佐證', module: 'm1', driveUrl: 'https://drive.google.com/drive/folders/1O72fUGf-0YSbRF5_u-BTHsDOUEIU33yw', refUrl: 'https://drive.google.com/drive/folders/1RHj_hrgJLpstbTOSiQ_fIr8dSyqFZ8LT' },
        ]
      },
      {
        id: '4-2', name: '反霸凌教育措施',
        docs: [
          { name: '校園霸凌防制規定', person: '生教組', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/13y7Dk1UhPqdZXrkWQ_pDL0Ayc4UZiAb4', refUrl: 'https://drive.google.com/drive/folders/1K_ilVTK-7qoVBi06MMiLL5O24yI_nWI7' },
          { name: '反霸凌/反毒宣導活動照片', person: '生教組/導師', type: '照片佐證', module: 'm1', driveUrl: 'https://drive.google.com/drive/folders/13y7Dk1UhPqdZXrkWQ_pDL0Ayc4UZiAb4', refUrl: 'https://drive.google.com/drive/folders/1K_ilVTK-7qoVBi06MMiLL5O24yI_nWI7' },
        ]
      },
    ]
  },
  {
    major: '肆、其他特色加分',
    subs: [
      {
        id: '4-1', name: '設班現況特色',
        docs: [
          { name: '承接教育局相關活動佐證', person: '體育組', type: '照片佐證', module: 'm1', driveUrl: 'https://drive.google.com/drive/folders/1doH1WRFjHlzpLYEL7OSiDK_khJ0Yhppm', refUrl: 'https://drive.google.com/drive/folders/1tfzgIlSCq8kHDiWlNBmtbEqQ8hZUv9K3' },
          { name: '建置體育班交流平台說明', person: '體育組', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1doH1WRFjHlzpLYEL7OSiDK_khJ0Yhppm', refUrl: 'https://drive.google.com/drive/folders/1tfzgIlSCq8kHDiWlNBmtbEqQ8hZUv9K3' },
          { name: '聘任專任運動教練佐證', person: '人事室', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/1doH1WRFjHlzpLYEL7OSiDK_khJ0Yhppm', refUrl: 'https://drive.google.com/drive/folders/1tfzgIlSCq8kHDiWlNBmtbEqQ8hZUv9K3' },
          { name: '績優教學分享活動佐證', person: '體育組', type: '照片佐證', module: 'm1', driveUrl: 'https://drive.google.com/drive/folders/1doH1WRFjHlzpLYEL7OSiDK_khJ0Yhppm', refUrl: 'https://drive.google.com/drive/folders/1tfzgIlSCq8kHDiWlNBmtbEqQ8hZUv9K3' },
        ]
      },
      {
        id: '4-2', name: '運作情形特色',
        docs: [
          { name: '師生校內外活動獎勵辦法', person: '體育組', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/1gn8-Bp38I_buIDJi_Iu_E9cnjZklY61D', refUrl: 'https://drive.google.com/drive/folders/1mb4YoHPkBj39pbDqTYYzR9-0aquQLJGN' },
          { name: '家長後援會組織辦法', person: '學務主任', type: '既有公文', module: null, driveUrl: 'https://drive.google.com/drive/folders/1gn8-Bp38I_buIDJi_Iu_E9cnjZklY61D', refUrl: 'https://drive.google.com/drive/folders/1mb4YoHPkBj39pbDqTYYzR9-0aquQLJGN' },
          { name: '體育班體育專業課程計畫', person: '體育組', type: '需制式範本', module: 'm3b', driveUrl: 'https://drive.google.com/drive/folders/1gn8-Bp38I_buIDJi_Iu_E9cnjZklY61D', refUrl: 'https://drive.google.com/drive/folders/1mb4YoHPkBj39pbDqTYYzR9-0aquQLJGN' },
          { name: '家長後援會活動佐證照片', person: '體育組', type: '照片佐證', module: 'm1', driveUrl: 'https://drive.google.com/drive/folders/1gn8-Bp38I_buIDJi_Iu_E9cnjZklY61D', refUrl: 'https://drive.google.com/drive/folders/1mb4YoHPkBj39pbDqTYYzR9-0aquQLJGN' },
        ]
      },
      {
        id: '4-3', name: '訓練績效特色',
        docs: [
          { name: '訓練成績彙整', person: '體育組', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1Iuc-qCdmoQqBCbBQp77z0Z-VfitfxPUl', refUrl: 'https://drive.google.com/drive/folders/1eiupuYZQhhz56ywjdwi4pfpaNhlWFqHA' },
          { name: '歷年優秀校友資料彙整', person: '體育組', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1Iuc-qCdmoQqBCbBQp77z0Z-VfitfxPUl', refUrl: 'https://drive.google.com/drive/folders/1eiupuYZQhhz56ywjdwi4pfpaNhlWFqHA' },
        ]
      },
      {
        id: '4-4', name: '其他',
        docs: [
          { name: '競賽成績檔案', person: '體育組', type: '需制式範本', module: null, driveUrl: 'https://drive.google.com/drive/folders/1ViLReEtuPxSmsNZXMJj0LMaiOUawdrbm', refUrl: 'https://drive.google.com/drive/folders/1FW6TDbS3mfSbntqicOU4obUNkOkTLpMY' },
        ]
      },
    ]
  },
];

// ── Build person list ──
var personSet = new Set();
DATA.forEach(function(sec){
  sec.subs.forEach(function(sub){
    sub.docs.forEach(function(doc){
      if(doc.person && doc.person !== '—'){
        doc.person.split('/').forEach(function(p){ personSet.add(p.trim()); });
      }
    });
  });
});
var persons = Array.from(personSet).sort();

// ── Render filter buttons ──
var fb = document.getElementById('filterBar');
persons.forEach(function(p){
  var btn = document.createElement('button');
  btn.className = 'filter-btn';
  btn.textContent = p;
  btn.onclick = function(){ filterPerson(p); };
  fb.appendChild(btn);
});

// ── Module button ──
function modBtn(mid){
  if(!mid) return '';
  return '<a class="mod-btn" href="'+TOOL_URL+'#'+mid+'" target="_blank">'
    +'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M9 2h5v5M14 2L8 8"/></svg>'
    +'使用工具</a>';
}

// ── Reference button ──
function refBtn(url){
  if(url){
    return '<a class="ref-btn" href="'+url+'" target="_blank">'
      +'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 8h8M4 5h5M4 11h3"/><rect x="1" y="2" width="14" height="12" rx="2"/></svg>'
      +'參考資料</a>';
  }
  return '';
}

// ── Upload button ──
function uploadBtn(url){
  if(url){
    return '<a class="upload-btn" href="'+url+'" target="_blank">'
      +'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 10V3M5 6l3-3 3 3M3 13h10"/></svg>'
      +'上傳文件</a>';
  }
  return '<a class="upload-btn disabled">'
    +'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 10V3M5 6l3-3 3 3M3 13h10"/></svg>'
    +'上傳文件</a>';
}

// ── Person tags ──
function personTags(p){
  if(!p||p==='—') return '<span style="color:#aaa">—</span>';
  return p.split('/').map(function(x){
    return '<span class="person-tag">'+x.trim()+'</span>';
  }).join('');
}

// ── Render ──
var main = document.getElementById('mainContent');
var totalDocs=0, totalModule=0, totalDrive=0;

DATA.forEach(function(sec){
  var secEl = document.createElement('div');
  secEl.className = 'major-section';
  var html = '<div class="major-title">'+sec.major+'</div>';

  sec.subs.forEach(function(sub){
    html += '<div class="sub-section">';
    html += '<div class="sub-header"><span class="sub-id">'+sub.id+'</span><span class="sub-name">'+sub.name+'</span></div>';
    html += '<table class="doc-table"><thead><tr>'
          + '<th style="width:38%">文件名稱</th>'
          + '<th style="width:30%">負責人員</th>'
          + '<th>工具 / 上傳</th>'
          + '</tr></thead><tbody>';

    sub.docs.forEach(function(doc){
      var persons = doc.person && doc.person!=='—'
        ? doc.person.split('/').map(function(x){return x.trim();})
        : [];
      var dataAttr = persons.length ? ' data-persons="'+persons.join(',').toLowerCase()+'"' : '';

      totalDocs++;
      if(doc.module) totalModule++;
      if(doc.driveUrl) totalDrive++;

      var toolRow = doc.module ? '<div class="btn-row">'+modBtn(doc.module)+'</div>' : '';
      var upRow = '<div class="btn-row">'+uploadBtn(doc.driveUrl)+refBtn(doc.refUrl)+'</div>';
      html += '<tr'+dataAttr+'>'
            + '<td class="doc-name">'+doc.name+'</td>'
            + '<td>'+personTags(doc.person)+'</td>'
            + '<td><div class="btn-group">'+toolRow+upRow+'</div></td>'
            + '</tr>';
    });

    html += '</tbody></table></div>';
  });

  secEl.innerHTML = html;
  main.appendChild(secEl);
});

document.getElementById('statTotal').textContent = totalDocs;
document.getElementById('statModule').textContent = totalModule;
document.getElementById('statDrive').textContent = totalDrive;

// ── Filter ──
var currentFilter = 'all';
function filterPerson(p){
  currentFilter = p;
  document.querySelectorAll('.filter-btn').forEach(function(btn){
    btn.classList.remove('active','all-btn','inactive');
    if(p==='all'){
      if(btn.textContent==='全部顯示') btn.classList.add('all-btn');
      else btn.classList.remove('active');
    } else {
      if(btn.textContent===p) btn.classList.add('active');
      else if(btn.textContent==='全部顯示') btn.classList.add('all-btn','inactive');
    }
  });

  document.querySelectorAll('.doc-table tbody tr').forEach(function(tr){
    if(p==='all'){
      tr.classList.remove('hidden-row');
    } else {
      var persons = (tr.getAttribute('data-persons')||'').split(',');
      var match = persons.some(function(x){ return x===p.toLowerCase(); });
      tr.classList.toggle('hidden-row', !match);
    }
  });

  // hide sub-sections where all rows hidden
  document.querySelectorAll('.sub-section').forEach(function(sec){
    var rows = sec.querySelectorAll('.doc-table tbody tr');
    var allHidden = Array.from(rows).every(function(r){ return r.classList.contains('hidden-row'); });
    sec.style.display = allHidden ? 'none' : '';
  });

  // hide major-sections where all sub-sections hidden
  document.querySelectorAll('.major-section').forEach(function(sec){
    var subs = sec.querySelectorAll('.sub-section');
    var allHidden = Array.from(subs).every(function(s){ return s.style.display==='none'; });
    sec.style.display = allHidden ? 'none' : '';
  });
}
