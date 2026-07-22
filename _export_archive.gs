/**
 * 體育班評鑑資料夾匯出歸檔工具（含網頁按鈕介面）
 *
 * 用途：評鑑結束後，把「體育班評鑑模組平台」整棵資料夾樹（含所有子資料夾與檔案）
 * 伺服器端複製到另一個指定資料夾歸檔保存。複製出來的是全新 ID 的獨立副本，
 * 不影響原平台資料夾（原平台之後可以清空當年度檔案、繼續給下年度重複使用）。
 *
 * 因應 Apps Script 單次執行 6 分鐘上限，採「佇列＋時間觸發器」設計：
 * 每次執行處理一部分資料夾/檔案，時間快到就存進度、排一個 1 分鐘後的觸發器接續執行，
 * 直到全部複製完成為止（2500+ 個檔案需要跑數十輪，實測總耗時約 30~90 分鐘——每個檔案/
 * 資料夾操作都是一次 Drive API 呼叫有網路延遲，加上每輪之間固定等 1 分鐘才接續，全自動、
 * 不需要一直盯著，關掉分頁也不影響背景執行）。
 * 按下「開始匯出」只負責建立目的地資料夾＋排程，立刻就會回應，實際複製工作都在
 * 背景觸發器裡進行，網頁不會卡住等待。
 *
 * 使用方式：
 * 1. 用你的 Google 帳號開啟 https://script.google.com → 新增專案
 * 2. 把這份程式碼貼進 程式碼.gs，另外新增一個 HTML 檔案（檔名 WebApp），
 *    把 _export_archive_webapp.html 的內容貼進去
 * 3. 依需求修改下方 CONFIG（來源資料夾名稱、學年度等）
 * 4. 右上角「部署」→「新增部署作業」→ 選「網頁應用程式」：
 *    - 執行身份：我
 *    - 具有存取權的使用者：**只有我自己**（避免被別人誤觸；若要開放同事使用可改成
 *      「YOCPS 網域內的使用者」，但不要選「所有人」）
 *    - 點「部署」→ 第一次會要求授權，同意即可 → 複製產生的網頁應用程式網址
 * 5. 用該網址開啟，就會看到「開始匯出歸檔」按鈕與即時進度
 * 6. 也可以直接在編輯器裡執行 startExport / checkExportStatus / cancelExport
 *    （不透過網頁介面也能操作，效果一樣）
 */

const CONFIG = {
  SOURCE_FOLDER_NAME: '體育班評鑑模組平台',        // 要匯出的來源資料夾名稱
  DEST_PARENT_FOLDER_NAME: '',                     // 目的地父資料夾名稱，''=直接放我的雲端硬碟根目錄
  ACADEMIC_YEAR: '115',                            // 學年度，換年度只要改這裡（例如明年改成 '116'）
  DEST_FOLDER_NAME_PREFIX: '體育班評鑑歸檔',        // 固定字樣，會自動組成「115學年度體育班評鑑歸檔」
  TIME_BUDGET_MS: 4.5 * 60 * 1000,                 // 每輪執行的時間預算，留給 6 分鐘上限一些緩衝
  SKIP_FILENAMES: ['desktop.ini'],                 // 這些檔名不複製（Windows 同步產生的雜訊檔）
  PROP_KEY: 'EXPORT_STATE',
  LAST_RESULT_KEY: 'EXPORT_LAST_RESULT'
};

function getDestFolderName() {
  return CONFIG.ACADEMIC_YEAR + '學年度' + CONFIG.DEST_FOLDER_NAME_PREFIX;
}

// ── 網頁介面 ──
function doGet() {
  const tmpl = HtmlService.createTemplateFromFile('WebApp');
  tmpl.userEmail = Session.getActiveUser().getEmail() || '(無法取得使用者信箱)';
  return tmpl.evaluate()
    .setTitle('體育班評鑑資料夾匯出歸檔')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// 給網頁介面輪詢用，回傳目前狀態（純資料，不寫 Logger）
function getStatusJson() {
  const props = PropertiesService.getScriptProperties();
  const raw = props.getProperty(CONFIG.PROP_KEY);
  if (raw) {
    const state = JSON.parse(raw);
    return {
      running: true,
      filesCopied: state.filesCopied,
      foldersCreated: state.foldersCreated,
      queueLeft: state.queue.length,
      destFolderUrl: state.destFolderUrl,
      errorCount: state.errors.length
    };
  }
  const lastRaw = props.getProperty(CONFIG.LAST_RESULT_KEY);
  if (lastRaw) {
    const last = JSON.parse(lastRaw);
    return {
      running: false,
      completed: true,
      completedAt: last.completedAt,
      filesCopied: last.filesCopied,
      foldersCreated: last.foldersCreated,
      destFolderUrl: last.destFolderUrl,
      errorCount: last.errorCount
    };
  }
  return { running: false, completed: false };
}

function startExport() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty(CONFIG.PROP_KEY)) {
    throw new Error('已有進行中的匯出工作，如需重新開始請先執行 cancelExport()');
  }

  const sourceFolders = DriveApp.getFoldersByName(CONFIG.SOURCE_FOLDER_NAME);
  if (!sourceFolders.hasNext()) throw new Error('找不到來源資料夾：' + CONFIG.SOURCE_FOLDER_NAME);
  const sourceFolder = sourceFolders.next();
  if (sourceFolders.hasNext()) {
    Logger.log('⚠️ 警告：找到多個同名來源資料夾，使用第一個找到的（ID: ' + sourceFolder.getId() + '，請確認是不是對的）');
  }

  let destParent;
  if (CONFIG.DEST_PARENT_FOLDER_NAME) {
    const parents = DriveApp.getFoldersByName(CONFIG.DEST_PARENT_FOLDER_NAME);
    if (!parents.hasNext()) throw new Error('找不到目的地父資料夾：' + CONFIG.DEST_PARENT_FOLDER_NAME);
    destParent = parents.next();
  } else {
    destParent = DriveApp.getRootFolder();
  }
  const destFolder = destParent.createFolder(getDestFolderName());

  const state = {
    queue: [{ srcId: sourceFolder.getId(), destId: destFolder.getId(), fileIds: [], folderIndex: 0, filesDone: false, foldersDone: false }],
    filesCopied: 0,
    foldersCreated: 1,
    errors: [],
    startedAt: new Date().toISOString(),
    destFolderId: destFolder.getId(),
    destFolderUrl: destFolder.getUrl()
  };
  props.deleteProperty(CONFIG.LAST_RESULT_KEY); // 開新的一輪，清掉上次的完成紀錄
  props.setProperty(CONFIG.PROP_KEY, JSON.stringify(state));

  Logger.log('開始匯出：' + CONFIG.SOURCE_FOLDER_NAME + ' → ' + destFolder.getUrl());
  // 只排程、不在這裡就跑批次，讓網頁按鈕能立刻得到回應，實際複製交給背景觸發器
  scheduleNextRun(5);
}

function resumeExport() {
  processQueue();
}

function processQueue() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    Logger.log('另一輪匯出正在執行中（手動執行與自動觸發器可能撞在一起），本次先跳過');
    return;
  }
  try {
    processQueueLocked();
  } finally {
    lock.releaseLock();
  }
}

function processQueueLocked() {
  const props = PropertiesService.getScriptProperties();
  const raw = props.getProperty(CONFIG.PROP_KEY);
  if (!raw) { Logger.log('沒有進行中的匯出工作'); return; }
  const state = JSON.parse(raw);
  const startTime = Date.now();
  const timeUp = function () { return (Date.now() - startTime) >= CONFIG.TIME_BUDGET_MS; };

  while (state.queue.length > 0 && !timeUp()) {
    const item = state.queue[0];
    let srcFolder, destFolder;
    try {
      srcFolder = DriveApp.getFolderById(item.srcId);
      destFolder = DriveApp.getFolderById(item.destId);
    } catch (e) {
      state.errors.push('無法開啟資料夾 ' + item.srcId + '：' + e.message);
      state.queue.shift();
      continue;
    }

    // 階段一：複製這個資料夾的直屬檔案（用已複製的來源檔案 ID 清單去重，安全可重入）
    if (!item.filesDone) {
      const copiedSet = {};
      item.fileIds.forEach(function (id) { copiedSet[id] = true; });
      const files = srcFolder.getFiles();
      let timedOut = false;
      while (files.hasNext()) {
        const f = files.next();
        const fid = f.getId();
        if (copiedSet[fid]) continue; // 已經複製過，跳過（避免重跑重複）
        if (CONFIG.SKIP_FILENAMES.indexOf(f.getName()) !== -1) { copiedSet[fid] = true; item.fileIds.push(fid); continue; }
        if (timeUp()) { timedOut = true; break; }
        try {
          f.makeCopy(f.getName(), destFolder);
          state.filesCopied++;
        } catch (e) {
          state.errors.push('複製檔案失敗 ' + f.getName() + '（' + item.srcId + '）：' + e.message);
        }
        copiedSet[fid] = true;
        item.fileIds.push(fid);
      }
      if (timedOut) break;
      item.filesDone = true;
      item.fileIds = []; // 這個資料夾的檔案已全部處理完，釋放記憶體
    }

    // 階段二：建立子資料夾並排進佇列（用 folderIndex 游標避免重跑時重複建立）
    if (!item.foldersDone) {
      const subFolders = srcFolder.getFolders();
      let idx = 0;
      let timedOut = false;
      while (subFolders.hasNext()) {
        const sf = subFolders.next();
        if (idx < item.folderIndex) { idx++; continue; }
        if (timeUp()) { timedOut = true; break; }
        try {
          const newSub = destFolder.createFolder(sf.getName());
          state.foldersCreated++;
          state.queue.push({ srcId: sf.getId(), destId: newSub.getId(), fileIds: [], folderIndex: 0, filesDone: false, foldersDone: false });
        } catch (e) {
          state.errors.push('建立子資料夾失敗 ' + sf.getName() + '（' + item.srcId + '）：' + e.message);
        }
        idx++;
        item.folderIndex = idx;
      }
      if (timedOut) break;
      item.foldersDone = true;
    }

    // 這個資料夾（檔案＋子資料夾）都處理完了，從佇列移除
    state.queue.shift();
  }

  props.setProperty(CONFIG.PROP_KEY, JSON.stringify(state));

  if (state.queue.length === 0) {
    deleteExportTriggers();
    props.deleteProperty(CONFIG.PROP_KEY);
    const summary = {
      completedAt: new Date().toISOString(),
      filesCopied: state.filesCopied,
      foldersCreated: state.foldersCreated,
      destFolderUrl: state.destFolderUrl,
      errorCount: state.errors.length,
      errors: state.errors.slice(0, 20)
    };
    props.setProperty(CONFIG.LAST_RESULT_KEY, JSON.stringify(summary));
    Logger.log('✅ 匯出完成！共複製 ' + state.filesCopied + ' 個檔案、建立 ' + state.foldersCreated + ' 個資料夾');
    Logger.log('目的地：' + state.destFolderUrl);
    if (state.errors.length > 0) {
      Logger.log('⚠️ ' + state.errors.length + ' 個錯誤：\n' + state.errors.join('\n'));
    }
  } else {
    scheduleNextRun(60);
    Logger.log('本輪處理到時間預算：已複製 ' + state.filesCopied + ' 個檔案，佇列剩餘 ' + state.queue.length + ' 個資料夾待處理，1 分鐘後自動接續');
  }
}

function scheduleNextRun(afterSeconds) {
  deleteExportTriggers();
  ScriptApp.newTrigger('resumeExport').timeBased().after((afterSeconds || 60) * 1000).create();
}

function deleteExportTriggers() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'resumeExport') ScriptApp.deleteTrigger(t);
  });
}

function checkExportStatus() {
  const raw = PropertiesService.getScriptProperties().getProperty(CONFIG.PROP_KEY);
  if (!raw) { Logger.log('目前沒有進行中的匯出工作（可能尚未開始，或已經完成）'); return; }
  const state = JSON.parse(raw);
  Logger.log('進行中：已複製 ' + state.filesCopied + ' 個檔案、建立 ' + state.foldersCreated + ' 個資料夾，佇列剩餘 ' + state.queue.length + ' 項');
  Logger.log('開始時間：' + state.startedAt);
  Logger.log('目的地：' + state.destFolderUrl);
  if (state.errors.length > 0) Logger.log('目前累積 ' + state.errors.length + ' 個錯誤，完成後會列出詳細內容');
}

function cancelExport() {
  deleteExportTriggers();
  PropertiesService.getScriptProperties().deleteProperty(CONFIG.PROP_KEY);
  Logger.log('已取消匯出工作並清除進度紀錄（已複製的檔案不會自動刪除，需自行到目的地資料夾清理）');
}
