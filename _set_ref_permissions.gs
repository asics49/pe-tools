/**
 * 批次將「參考資料」資料夾權限設定為：
 * 右昌國小網域帳號（yocps.kh.edu.tw）知道連結即可檢視
 *
 * 使用方式：
 * 1. 用學校帳號開啟 https://script.google.com
 * 2. 新增專案 → 貼上此程式碼
 * 3. 點「執行」→ setRefFolderPermissions
 * 4. 第一次會要求授權，同意即可
 * 5. 查看「執行記錄」確認結果
 */

function setRefFolderPermissions() {
  var folderIds = [
    // 壹、設班現況
    '1XmFy7IWNUBdHExNu7V3vNoT7WVC69RH2', // 1-1-1 體育班發展委員會設立與運作
    '1gvRmSFhCwDpKgaWsaUPT2mMappYSu6Gk',  // 1-1-2 體育班課程規劃程序
    '1E4gJ0SmBC0GEch8bwrHIdaROtVpijhZn',  // 1-1-3 課業成績出賽基準之訂定情形
    '1gsF93O2q8XVpZWeDBS6yzZT8X7BPuH4X',  // 1-1-4 體育班設班運動種類招生人數方式
    '1WXVu4bPtYe9rs0M0TnCDCI4viW8Uml7b',  // 2-1-1 一般學科及體育專業學科課程師資聘任
    '1faJAe_KGbbg5d52YwQN4eLJ3SpuFCxn7',  // 2-1-2 體育專項術科師資聘任情形
    '1_lLP6V2MkOi-uJFWo0eNxAVNoj5EKvyt',  // 2-1-3 體育教師與設班種類是否相符
    '154L74raJgiu_v3-UvtA9sA6NuJ_oZ-D7',  // 2-1-4 學校聘任專任運動教練情形
    '170c3sBysJ9o725ZjGN3y8xnz_4g3lCjW',  // 3-1-1 體育班訓練專用場地空間
    '1H8mc4Dy7XPNqS_xWoDUq-bqsWAYU3j2X',  // 3-1-2 體育班設備器材管理維護及更新
    '1O_kNR3dlJfnjvVsX1vEpU5NJTayFAsuy',  // 3-2-1 運動防護措施
    '18cw-dhmvogQ4XYUxMceP1bahY8QRuiNn',  // 3-2-2 運動防護紀錄
    // 貳、運作情形
    '1anV90dnuW7_g499pwEIlyaD9Cy-ZmCBk',  // 1-1-1 公部門經費編列情形
    '1hJ5iG6ZMQmQNWP88IGQwxuIQDOJeiTOO',  // 1-1-2 籌措社會資源情形
    '1s2Gt6AYKTnzcVC4IjbcQwjXDdo3LhA_H',  // 1-1-3 公部門經費預算之執行情形
    '1zBPPF0BkvTpqvGlIsXpHgesrx1tHDcTt',  // 2-1-1 課程及訓練計畫規劃情形
    '1FRukI_hvD9xtKRgU0ji82MJpF9I9vb15',  // 2-1-2 課程實施情形
    '1HtVPEp2OFtBshMyjHuJW2-XKW-rGkj7k',  // 2-1-3 體育專項術科訓練規劃執行情形
    '1SEL73ltF2xoOkjMda6if9ebPJoOnYQQJ',  // 3-1-1 是否安排賽後補課情形
    '10u-Bn6KpRd_S8ipkVIGVeoxztC81klQj',  // 3-1-2 學業成績未達參賽基準執行情形
    '1H-gvptt5dNDe-JsP7e1cixbqSfxfAkGh',  // 3-1-3 課業輔導情形
    '17BHglR9UArBoxhfsDsIsU2M3qmVuZYyj',  // 3-2 生活輔導情形
    '164dQrZVdxxSytIijLaMvlxk7U5bhPkOn',  // 3-3 升學輔導情形
    '1eZ9VRkdG7OBQHheUzWliqskUjDQwybRH',  // 3-4 生涯發展執行情形
    '1RHj_hrgJLpstbTOSiQ_fIr8dSyqFZ8LT',  // 4-1 性別平等教育措施
    '1K_ilVTK-7qoVBi06MMiLL5O24yI_nWI7',  // 4-2 反霸凌教育措施
    // 肆、其他特色加分
    '1tfzgIlSCq8kHDiWlNBmtbEqQ8hZUv9K3',  // 4-1 設班現況特色
    '1mb4YoHPkBj39pbDqTYYzR9-0aquQLJGN',  // 4-2 運作情形特色
    '1eiupuYZQhhz56ywjdwi4pfpaNhlWFqHA',  // 4-3 訓練績效特色
    '1FW6TDbS3mfSbntqicOU4obUNkOkTLpMY',  // 4-4 其他特色
    // 參、訓練績效
    '1FJ16GcMOUTyfh9ssV48I007TgfVlsFEe',  // 一、體育班學生資料建檔
    '10CNhtOTh-xplhTEHQMY2xEhmaUev5_Dj',  // 二、最近三年參加各類競賽情形
    '1RMvMW_LmXC8gJQhY5fuGOh3-9gVJJqlp',  // 三、最近三年銜續國中繼續參加訓練及比賽情形
    '1rtCndSNkmVoj98hjrAGmeF2T4fvvbica',   // 四、最近三年參加杯賽得名情形
  ];

  var success = 0;
  var errors = [];

  folderIds.forEach(function(id) {
    try {
      var folder = DriveApp.getFolderById(id);
      // 設定：知道連結的右昌國小網域帳號可以檢視（唯讀）
      folder.setSharing(DriveApp.Access.DOMAIN_WITH_LINK, DriveApp.Permission.VIEW);
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
