/**
 * 批次將「文件上傳」資料夾權限設定為：
 * 右昌國小網域帳號（yocps.kh.edu.tw）知道連結即可編輯
 *
 * 使用方式：
 * 1. 用學校帳號開啟 https://script.google.com
 * 2. 新增專案 → 貼上此程式碼
 * 3. 點「執行」→ setFolderPermissions
 * 4. 第一次會要求授權，同意即可
 * 5. 查看「執行記錄」確認結果
 */

function setFolderPermissions() {
  var folderIds = [
    // 壹、設班現況
    '1ivl6OTNuDMxlyWKy_-3TXDi6LpeCLgad', // 1-1-1 體育班發展委員會設立與運作
    '1Y-kJN1f86ke-97VeBhh8-Fty31_ou7yr',  // 1-1-2 體育班課程規劃程序
    '1R64hkSB1zp3F6sXugg2V4v7kw1-RDAYF',  // 1-1-3 課業成績出賽基準之訂定情形
    '1U7OLUlZlo_Hv6VDg_fGOyJuooewJAey7',  // 1-1-4 體育班設班運動種類招生人數方式
    '1oXvo9Vu3yWkjOkDGBuCTh1sRTeP0QGSj',  // 2-1-1 一般學科及體育專業學科課程師資聘任
    '1YXqHTLrvvldqk7h1owgUcCB-ispxyW75',   // 2-1-2 體育專項術科師資聘任情形
    '1CMFFtc7o93iPSFmdFofW8WAyzG5CAsSp',   // 2-1-3 體育教師與設班種類是否相符
    '1jNhgHvRtm3rSzQGO8WncoDV30Q7wevas',  // 2-1-4 學校聘任專任運動教練情形
    '1gWSYnJp1rHlm-zpCZu0TDKHU3rvNcDIN',  // 3-1-1 體育班訓練專用場地空間
    '1QlgFQPpP-saEgrya7UI4zAnYq1vAkaCQ',  // 3-1-2 體育班設備器材管理維護及更新
    '1UNPLzf5DzQHMAntGcbUslNiINzBnQ18L',  // 3-2-1 運動防護措施
    '17ghVUlzLSnahPLcVY9tEzojIcxqUPnAc',  // 3-2-2 運動防護紀錄
    // 貳、運作情形
    '1rmOaquV5do-YCjCL6Qt5rxnods-KWkvu',  // 1-1-1 公部門經費編列情形
    '1MSPkFG2xQxrjsAAbUsdHltACh1gcCWm5',  // 1-1-2 籌措社會資源情形
    '1lD3sWTdXBwcWyNHtNg2aVfASimhw3bY7',  // 1-1-3 公部門經費預算之執行情形
    '1Zq-UBfJD_kKDB_YtmsbdjUndsQsK_fyS',  // 2-1-1 課程及訓練計畫規劃情形
    '11nUFp5RZ4Wou1pRNpQxZNvuzB6Nhn4QN',  // 2-1-2 課程實施情形
    '1M_-hM7ynz2gPrgFVWhOeasSdWjm5sLEG',  // 2-1-3 體育專項術科訓練規劃執行情形
    '1K6LYuoAgU0Hk8imz0Z6d6UXmn8CslzNm',  // 3-1-1 是否安排賽後補課情形
    '1afEGk3w4lu2z7DdKTI0EA8eInCmABl1k',  // 3-1-2 學業成績未達參賽基準執行情形
    '1m2ypMdKLFSCrTu6pv9bPwSNTowVLODK3',  // 3-1-3 課業輔導情形
    '1n1DX46RgGs4m8c6U1PzOPY0odxKtyW9n',  // 3-2 生活輔導情形
    '15eUuBQToq3TefB4NvvJGsO6TvTd_8UZl',  // 3-3 升學輔導情形
    '1OK9ECRKdQ_3_p1-Rh5O5fMqwsQt98KFU',  // 3-4 生涯發展執行情形
    '1O72fUGf-0YSbRF5_u-BTHsDOUEIU33yw',  // 4-1 性別平等教育措施
    '13y7Dk1UhPqdZXrkWQ_pDL0Ayc4UZiAb4',  // 4-2 反霸凌教育措施
    // 肆、其他特色加分
    '1doH1WRFjHlzpLYEL7OSiDK_khJ0Yhppm',  // 4-1 設班現況特色
    '1gn8-Bp38I_buIDJi_Iu_E9cnjZklY61D',  // 4-2 運作情形特色
    '1Iuc-qCdmoQqBCbBQp77z0Z-VfitfxPUl',  // 4-3 訓練績效特色
    '1ViLReEtuPxSmsNZXMJj0LMaiOUawdrbm',  // 4-4 其他特色
    // 參、訓練績效
    '16sW1U30kIpYmJM2gIpxmHOTpy88p9HhM',  // 一、體育班學生資料建檔
    '1lferUFYvmFG4Pyx1l1Z0gQ7Km5Nf8I1u',  // 二、最近三年參加各類競賽情形
    '1PHtJYDW3l06w_g3MlvyDBuB3E3Y1hLrH',  // 三、最近三年銜續國中繼續參加訓練及比賽情形
    '1XS6HCZBZQYuxvsCfqlGe0qH103b-MNEf',  // 四、最近三年參加杯賽得名情形
  ];

  var success = 0;
  var errors = [];

  folderIds.forEach(function(id) {
    try {
      var folder = DriveApp.getFolderById(id);
      // 設定：知道連結的右昌國小網域帳號可以編輯
      folder.setSharing(DriveApp.Access.DOMAIN_WITH_LINK, DriveApp.Permission.EDIT);
      Logger.log('OK: ' + folder.getName() + ' (' + id + ')');
      success++;
    } catch(e) {
      Logger.log('ERROR: ' + id + ' → ' + e.message);
      errors.push(id);
    }
  });

  Logger.log('════════════════════════════');
  Logger.log('完成：' + success + ' 個成功，' + errors.length + ' 個失敗');
  if (errors.length > 0) {
    Logger.log('失敗的 ID：' + errors.join(', '));
  }
}
