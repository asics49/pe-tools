"""
右昌國小體育班評鑑文件工具 — 合併腳本
========================================
用途：把各模組的獨立 HTML 合併成單一分頁版 pe-class-tools.html

新增模組步驟：
1. 把新模組的 HTML 檔案放在同一目錄
2. 在下方 FILES 清單加一行：('模組ID', '徽章文字', '標籤', '檔案名稱.html')
3. 執行：python3 build.py

注意：
- 模組ID 必須是英數字（如 m5, m6），不能重複
- 新模組的 init 區段請以 "// init" 或 "// ─── init ───" 開頭，放在 JS 最後
- 如果模組裡有和其他模組同名的函式，腳本會自動加上模組ID前綴處理
"""

import re, subprocess, os

# ──────────────────────────────────────────
#  在這裡新增/修改模組清單
# ──────────────────────────────────────────
FILES = [
    ('m1',  '模組一',  '照片佐證資料',   'photo-doc-generator.html'),
    ('m2',  '模組二',  '補課紀錄表',     'makeup-class-record.html'),
    ('m3a', '模組三A', '成果報告表頭',   'result-report-header.html'),
    ('m3b', '模組三B', '開課課程一覽',   'course-overview.html'),
    ('m4',  '模組四',  '職業試探活動',   'career-activity.html'),
    ('m5',  '模組五',  '公假統計表',     'leave-record.html'),
    ('m6',  '模組六',  '成績登錄',       'grade-record.html'),
    ('m7',  '模組七',  '年度訓練計畫',   '年度訓練計畫表.html'),
    ('m8',  '模組八',  '器材檢核表',     '器材檢核表.html'),
    ('m9',  '模組九',  '雲端連結頁產生器', 'cloud-link-page.html'),
    ('m10', '模組十',  'PDF轉JPG壓縮',   'pdf-to-jpg.html'),
]

OUTPUT = 'pe-class-tools.html'

# ──────────────────────────────────────────
#  以下不需修改
# ──────────────────────────────────────────

# HTML IDs that appear in multiple modules and need module-prefixing
CONFLICT_IDS = [
    'statusMsg', 'dlBtn', 'downloadBtn', 'logoClearBtn', 'logoThumb',
    'logoFileName', 'logoPreview', 'logoFile', 'docTitle',
    'blocksContainer', 'activitiesContainer',
    'previewHeader', 'previewLogo', 'previewTitle', 'previewPage',
    'coverTitle', 'coverTitleSel', 'coverTitleCustom',
    'fundTable', 'fundNote',
    'reportDate', 'reportDateRoc', 'schoolName', 'classCount', 'studentCount',
    'rosterUploaded', 'noInsurance', 'hostSchool', 'audience',
    'reportTypeGroup', 'eduStageGroup', 'hsCourseTypeGroup', 'hsCheckTypeGroup',
    'approvedTotal',
    'leaveYear', 'leaveSport', 'leaveTableBody', 'rowCount',
    'previewCard', 'previewContent', 'pasteArea', 'pasteInput',
    'downloadBtn', 'statusMsg',
    'importHint', 'importFile', 'previewArea', 'planYear', 'lowScoreBox', 'fullYearFile',
    'checkAll', 'deleteSel', 'selCount', 'addForm', 'newName', 'newGrade',
    'studentList', 'countHint', 'customYear', 'customYearWrap', 'pdfFiles',
    'editModal', 'editModalTitle', 'mainTitle', 'planTable', 'mainChart', 'contentTable',
    'inSchool', 'inSport', 'inYear', 'inStartDate',
    'em_ty', 'em_js', 'em_zs', 'em_xl', 'em_sum', 'em_vol', 'em_int', 'em_perf',
    'em_bar_from', 'em_bar_to', 'em_line_from', 'em_line_to',
    'inDay', 'monthTabs', 'monthLabel', 'checkTable', 'checkBody', 'sigRow',
    'sig1', 'sig2', 'sig3', 'sig4', 'sig5',
    'school', 'year', 'entryList',
]

# JS variable names that conflict between specific modules
CONFLICT_VARS = {
    'm1':  {'logo': 'logo_m1', 'nextId': 'nextId_m1',
            'cols': 'cols_m1', 'targetBlocks': 'targetBlocks_m1', 'blocks': 'blocks_m1'},
    'm2':  {'logo': 'logo_m2', 'nextId': 'nextId_m2', 'records': 'records_m2'},
    'm3a': {'logo': 'logo_m3a', 'state': 'state_m3a'},
    'm3b': {'logo': 'logo_m3b', 'state': 'state_m3b',
            'PAGE_W': 'PAGE_W_m3b', 'PAGE_H': 'PAGE_H_m3b',
            'nextPicId': 'nextPicId_m3b', 'nextBlockId': 'nextBlockId_m3b'},
    'm4':  {'logo': 'logo_m4', 'state': 'state_m4',
            'PAGE_W': 'PAGE_W_m4', 'PAGE_H': 'PAGE_H_m4',
            'nextPicId': 'nextPicId_m4', 'nextActId': 'nextActId_m4'},
    'm5':  {'rows': 'rows_m5', 'nextId': 'nextId_m5'},
    'm6':  {'students': 'students_m6', 'nextId': 'nextId_m6', 'FIELDS': 'FIELDS_m6', 'EVALS': 'EVALS_m6'},
    'm7':  {'chart': 'chart_m7', 'D': 'D_m7', 'BD': 'BD_m7', 'BIG': 'BIG_m7',
            'HT': 'HT_m7', 'WEEKS': 'WEEKS_m7', 'MONTHS': 'MONTHS_m7',
            'INIT_VAL': 'INIT_VAL_m7', '_editModalWeek': '_editModalWeek_m7'},
    'm8':  {'MONTHS': 'MONTHS_m8', 'CHECKS': 'CHECKS_m8',
            'curMonth': 'curMonth_m8', 'monthData': 'monthData_m8'},
    'm9':  {'entries': 'entries_m9', 'nextId': 'nextId_m9'},
    # 新增模組時，在這裡加上該模組的衝突變數：
}

# Shared constants — defined once (in first module), commented out in others
SHARED_CONSTS = {
    'DEFAULT_LOGO_DATAURL', 'DEFAULT_LOGO_HEIGHT', 'DEFAULT_LOGO_WIDTH',
    'EMU_PER_DXA', 'EMU_PER_PX', 'PAGE_CONTENT_WIDTH_DXA'
}


def extract_src(path):
    with open(path, encoding='utf-8') as f:
        return f.read()

def get_js(src):
    blocks = re.findall(r'<script(?:\s[^>]*)?>([^<]*(?:<(?!/script)[^<]*)*)</script>', src, re.S)
    return next((s for s in reversed(blocks) if len(s) > 100), '')

def get_css(src):
    blocks = re.findall(r'<style>(.*?)</style>', src, re.S)
    css = '\n'.join(blocks)
    # 過濾 html / body 全域選擇器，但不能誤刪 .s-body / #foo-body 等 class/id
    # 負向回望：確保 body 前面不是 . # 或英數字
    css = re.sub(r'(?<![.#\w-])body\s*\{[^}]*\}', '', css)
    css = re.sub(r'(?<![.#\w-])html\s*(?:,\s*body\s*)?\{[^}]*\}', '', css)
    return css

def get_body(src):
    m = re.search(r'</style>(.*?)<script', src, re.S)
    if not m: return ''
    body = m.group(1)
    body = re.sub(r'</head>', '', body, flags=re.I)
    body = re.sub(r'<body[^>]*>', '', body, flags=re.I)
    body = re.sub(r'</body>', '', body, flags=re.I)
    body = re.sub(r'</html>', '', body, flags=re.I)
    return body.strip()

def prefix_ids(src, mid):
    for iid in CONFLICT_IDS:
        p = f'{mid}_{iid}'
        src = src.replace(f'id="{iid}"', f'id="{p}"')
        src = src.replace(f'for="{iid}"', f'for="{p}"')
        src = src.replace(f"getElementById('{iid}')", f"getElementById('{p}')")
        src = src.replace(f'getElementById("{iid}")', f'getElementById("{p}")')
        src = src.replace(f"querySelector('#{iid}')", f"querySelector('#{p}')")
        src = src.replace(f'querySelector("#{iid}")', f'querySelector("#{p}")')
    return src

def apply_renames(text, renames):
    for old, new in sorted(renames.items(), key=lambda x: -len(x[0])):
        text = re.sub(r'\b' + re.escape(old) + r'\b', new, text)
    return text

def split_init(js):
    """Split JS into (definitions, init) at the last // init marker."""
    markers = [m.start() for m in re.finditer(
        r'//\s*[─\-]*\s*init\s*[─\-]*\s*$', js, re.M | re.IGNORECASE)]
    if not markers:
        return js, ''
    pos = markers[-1]
    ls = js.rfind('\n', 0, pos) + 1
    return js[:ls], js[ls:]

defined_consts = set()

def dedup_consts(js):
    lines = js.split('\n')
    out = []
    for line in lines:
        if 'const ' in line:
            names = re.findall(r'([A-Za-z_][A-Za-z0-9_]*)\s*=', line)
            shared = [n for n in names if n in SHARED_CONSTS]
            if shared and all(n in defined_consts for n in shared):
                out.append('// (shared) ' + line.rstrip())
                continue
            for n in shared:
                defined_consts.add(n)
        out.append(line)
    return '\n'.join(out)


def build():
    # Step 1: Scan function names to find conflicts
    all_funcs = {}
    raw_modules = []
    for mid, badge, label, fname in FILES:
        src = extract_src(fname)
        js = get_js(src)
        funcs = set(re.findall(r'(?m)^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)', js))
        for fn in funcs:
            all_funcs.setdefault(fn, []).append(mid)
        raw_modules.append({'mid': mid, 'badge': badge, 'label': label, 'src': src, 'funcs': funcs})

    conflicts = {n for n, mids in all_funcs.items() if len(mids) > 1}
    print(f'Conflicting functions: {len(conflicts)} → will be prefixed per module')

    # Step 2: Process each module
    modules = []
    for mraw in raw_modules:
        mid = mraw['mid']
        src = mraw['src']

        # Prefix HTML IDs
        src = prefix_ids(src, mid)

        # Rename conflicting functions (in both HTML onclick and JS)
        func_renames = {fn: f'{mid}_{fn}' for fn in mraw['funcs'] if fn in conflicts}
        src = apply_renames(src, func_renames)

        # Rename conflicting variables
        src = apply_renames(src, CONFLICT_VARS.get(mid, {}))

        modules.append({
            'id': mid, 'badge': mraw['badge'], 'label': mraw['label'],
            'css': get_css(src),
            'body': get_body(src),
            'js': get_js(src),
        })

    # Step 3: Split init sections, dedup shared consts
    def_sections, init_sections = {}, {}
    for m in modules:
        defs, init = split_init(m['js'])
        defs = dedup_consts(defs)
        def_sections[m['id']] = defs
        init_sections[m['id']] = init

    # Step 4: Assemble
    tab_buttons = '\n'.join(
        f'    <button class="tab-btn" id="tab_{m["id"]}" onclick="switchTab(\'{m["id"]}\')">'
        f'<span class="tab-badge">{m["badge"]}</span>{m["label"]}</button>'
        for m in modules
    )
    panels = '\n'.join(
        f'  <div class="tab-panel" id="panel_{m["id"]}">\n'
        f'    <div class="module-wrap">\n{m["body"]}\n    </div>\n  </div>'
        for m in modules
    )
    init_registry = ',\n'.join(
        f"  '{m['id']}': function() {{\n{init_sections[m['id']]}\n  }}"
        for m in modules
    )
    all_defs = '\n'.join(
        f'\n// ========== {m["badge"]} {m["label"]} ==========\n{def_sections[m["id"]]}'
        for m in modules
    )
    combined_css = '\n'.join(m['css'] for m in modules)

    html = f'''<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>右昌國小體育班評鑑文件工具</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<style>
*{{box-sizing:border-box;}}
body{{margin:0;font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif;background:#F0EDE6;}}
.shell-header{{background:#223A52;color:#fff;padding:12px 20px 0;position:sticky;top:0;z-index:100;box-shadow:0 2px 8px rgba(0,0,0,.3);}}
.shell-title{{font-size:15px;font-weight:700;margin-bottom:10px;letter-spacing:.03em;}}
.shell-title span{{color:#C9A24B;}}
.tab-bar{{display:flex;gap:3px;overflow-x:auto;padding-bottom:0;scrollbar-width:none;}}
.tab-bar::-webkit-scrollbar{{display:none;}}
.tab-btn{{flex-shrink:0;background:rgba(255,255,255,.12);border:none;border-radius:8px 8px 0 0;color:rgba(255,255,255,.7);padding:7px 16px;font-size:12px;font-family:inherit;cursor:pointer;line-height:1.4;text-align:left;transition:background .15s,color .15s;white-space:nowrap;min-width:80px;}}
.tab-btn:hover{{background:rgba(255,255,255,.22);color:#fff;}}
.tab-btn.active{{background:#F0EDE6;color:#223A52;font-weight:700;}}
.tab-badge{{display:block;font-size:10px;color:#C9A24B;font-weight:700;margin-bottom:2px;}}
.tab-btn.active .tab-badge{{color:#8B2E2E;}}
.tab-panel{{display:none;}}
.tab-panel.active{{display:block;}}
.module-wrap{{max-width:900px;margin:0 auto;padding:24px 16px 120px;}}
{combined_css}
</style>
</head>
<body>
<div class="shell-header">
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
    <a href="index.html" style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.15);color:rgba(255,255,255,.85);text-decoration:none;border-radius:6px;padding:4px 10px;font-size:12px;font-family:inherit;transition:background .15s;" onmouseover="this.style.background='rgba(255,255,255,.25)'" onmouseout="this.style.background='rgba(255,255,255,.15)'">
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 12L6 8l4-4"/></svg>
      回評鑑總覽
    </a>
    <div class="shell-title" style="margin-bottom:0;">右昌國小 <span>體育班評鑑文件工具</span></div>
  </div>
  <div class="tab-bar">
{tab_buttons}
  </div>
</div>
<div id="tab-content">
{panels}
</div>
<script>
var _tabInited={{}};
var _tabInits={{
{init_registry}
}};
function switchTab(id){{
  document.querySelectorAll('.tab-panel').forEach(function(p){{
    p.classList.remove('active'); p.style.display='none';
  }});
  document.querySelectorAll('.tab-btn').forEach(function(b){{b.classList.remove('active');}});
  var panel=document.getElementById('panel_'+id);
  if(panel){{panel.classList.add('active');panel.style.display='block';}}
  var btn=document.getElementById('tab_'+id);
  if(btn) btn.classList.add('active');
  history.replaceState(null,'','#'+id);
  if(!_tabInited[id]&&_tabInits[id]){{_tabInited[id]=true;_tabInits[id]();}}
}}
document.addEventListener('DOMContentLoaded',function(){{
  var hash=location.hash.replace('#','');
  switchTab(hash&&document.getElementById('panel_'+hash)?hash:'m1');
}});
{all_defs}
</script>
</body>
</html>'''

    with open(OUTPUT, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'Output: {OUTPUT}  ({len(html):,} bytes)')

    # Validate JS syntax
    main_js = re.findall(r'<script(?:\s[^>]*)?>([^<]*(?:<(?!/script)[^<]*)*)</script>', html, re.S)
    main_js = next((s for s in reversed(main_js) if len(s)>1000), '')
    tmp = os.path.join(os.environ.get('TEMP', '.'), '_build_check.js')
    with open(tmp, 'w', encoding='utf-8') as f:
        f.write(main_js)
    r = subprocess.run(['node', '--check', tmp], capture_output=True, text=True)
    if r.returncode == 0:
        print('OK: JavaScript syntax OK')
    else:
        print('ERROR: Syntax error:')
        print(r.stdout[:400])


if __name__ == '__main__':
    build()
