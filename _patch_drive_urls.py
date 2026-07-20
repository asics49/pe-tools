"""
根據子標名稱關鍵字，把 driveUrl: null 替換為正確的 Google Drive 連結。
每個子標對應一個「文件上傳」資料夾，該資料夾下所有文件共用同一連結。
"""

import re

DRIVE_MAP = {
    # 壹、設班現況
    '1-1-1 體育班發展委員會': 'https://drive.google.com/drive/folders/1ivl6OTNuDMxlyWKy_-3TXDi6LpeCLgad',
    '1-1-2 體育班課程規劃': 'https://drive.google.com/drive/folders/1Y-kJN1f86ke-97VeBhh8-Fty31_ou7yr',
    '1-1-3 課業成績出賽基準': 'https://drive.google.com/drive/folders/1R64hkSB1zp3F6sXugg2V4v7kw1-RDAYF',
    '1-1-4 體育班設班運動種類': 'https://drive.google.com/drive/folders/1U7OLUlZlo_Hv6VDg_fGOyJuooewJAey7',
    '2-1-1 一般學科': 'https://drive.google.com/drive/folders/1oXvo9Vu3yWkjOkDGBuCTh1sRTeP0QGSj',
    '2-1-2 體育專項術科師資': 'https://drive.google.com/drive/folders/1YXqHTLrvvldqk7h1owgUcCB-ispxyW75',
    '2-1-3 體育教師及專任': 'https://drive.google.com/drive/folders/1CMFFtc7o93iPSFmdFofW8WAyzG5CAsSp',
    '2-1-4 學校聘任專任': 'https://drive.google.com/drive/folders/1jNhgHvRtm3rSzQGO8WncoDV30Q7wevas',
    '3-1-1 體育班訓練專用場地': 'https://drive.google.com/drive/folders/1gWSYnJp1rHlm-zpCZu0TDKHU3rvNcDIN',
    '3-1-2 體育班設備器材': 'https://drive.google.com/drive/folders/1QlgFQPpP-saEgrya7UI4zAnYq1vAkaCQ',
    '3-2-1 運動防護措施': 'https://drive.google.com/drive/folders/1UNPLzf5DzQHMAntGcbUslNiINzBnQ18L',
    '3-2-2 運動防護紀錄': 'https://drive.google.com/drive/folders/17ghVUlzLSnahPLcVY9tEzojIcxqUPnAc',
    # 貳、運作情形
    '1-1-1 公部門經費編列': 'https://drive.google.com/drive/folders/1rmOaquV5do-YCjCL6Qt5rxnods-KWkvu',
    '1-1-2 籌措社會資源': 'https://drive.google.com/drive/folders/1MSPkFG2xQxrjsAAbUsdHltACh1gcCWm5',
    '1-1-3 公部門經費預算': 'https://drive.google.com/drive/folders/1lD3sWTdXBwcWyNHtNg2aVfASimhw3bY7',
    '2-1-1 課程及訓練計畫': 'https://drive.google.com/drive/folders/1Zq-UBfJD_kKDB_YtmsbdjUndsQsK_fyS',
    '2-1-2 課程實施': 'https://drive.google.com/drive/folders/11nUFp5RZ4Wou1pRNpQxZNvuzB6Nhn4QN',
    '2-1-3 體育專項術科訓練規劃': 'https://drive.google.com/drive/folders/1M_-hM7ynz2gPrgFVWhOeasSdWjm5sLEG',
    '3-1-1 是否安排賽後補課': 'https://drive.google.com/drive/folders/1K6LYuoAgU0Hk8imz0Z6d6UXmn8CslzNm',
    '3-1-2 學業成績未達': 'https://drive.google.com/drive/folders/1afEGk3w4lu2z7DdKTI0EA8eInCmABl1k',
    '3-1-3 課業輔導': 'https://drive.google.com/drive/folders/1m2ypMdKLFSCrTu6pv9bPwSNTowVLODK3',
    '3-2 生活輔導': 'https://drive.google.com/drive/folders/1n1DX46RgGs4m8c6U1PzOPY0odxKtyW9n',
    '3-3 升學輔導': 'https://drive.google.com/drive/folders/15eUuBQToq3TefB4NvvJGsO6TvTd_8UZl',
    '3-4 生涯發展': 'https://drive.google.com/drive/folders/1OK9ECRKdQ_3_p1-Rh5O5fMqwsQt98KFU',
    '4-1 性別平等': 'https://drive.google.com/drive/folders/1O72fUGf-0YSbRF5_u-BTHsDOUEIU33yw',
    '4-2 反霸凌': 'https://drive.google.com/drive/folders/13y7Dk1UhPqdZXrkWQ_pDL0Ayc4UZiAb4',
    # 肆、其他特色加分
    '4-1 設班現況特色': 'https://drive.google.com/drive/folders/1doH1WRFjHlzpLYEL7OSiDK_khJ0Yhppm',
    '4-2 運作情形特色': 'https://drive.google.com/drive/folders/1gn8-Bp38I_buIDJi_Iu_E9cnjZklY61D',
    '4-3 訓練績效特色': 'https://drive.google.com/drive/folders/1Iuc-qCdmoQqBCbBQp77z0Z-VfitfxPUl',
    '4-4 其他': 'https://drive.google.com/drive/folders/1ViLReEtuPxSmsNZXMJj0LMaiOUawdrbm',
}

# sub-id → drive url (for matching within JS DATA blocks)
SUB_ID_MAP = {
    # 壹
    ('壹', '1-1'):   DRIVE_MAP['1-1-1 體育班發展委員會'],
    ('壹', '1-1-2'): DRIVE_MAP['1-1-2 體育班課程規劃'],
    ('壹', '1-1-3'): DRIVE_MAP['1-1-3 課業成績出賽基準'],
    ('壹', '1-1-4'): DRIVE_MAP['1-1-4 體育班設班運動種類'],
    ('壹', '2-1-1'): DRIVE_MAP['2-1-1 一般學科'],
    ('壹', '2-1-2'): DRIVE_MAP['2-1-2 體育專項術科師資'],
    ('壹', '2-1-3'): DRIVE_MAP['2-1-3 體育教師及專任'],
    ('壹', '2-1-4'): DRIVE_MAP['2-1-4 學校聘任專任'],
    ('壹', '3-1-1'): DRIVE_MAP['3-1-1 體育班訓練專用場地'],
    ('壹', '3-1-2'): DRIVE_MAP['3-1-2 體育班設備器材'],
    ('壹', '3-2-1'): DRIVE_MAP['3-2-1 運動防護措施'],
    ('壹', '3-2-2'): DRIVE_MAP['3-2-2 運動防護紀錄'],
    # 貳
    ('貳', '1-1-1'): DRIVE_MAP['1-1-1 公部門經費編列'],
    ('貳', '1-1-2'): DRIVE_MAP['1-1-2 籌措社會資源'],
    ('貳', '1-1-3'): DRIVE_MAP['1-1-3 公部門經費預算'],
    ('貳', '2-1-1'): DRIVE_MAP['2-1-1 課程及訓練計畫'],
    ('貳', '2-1-2'): DRIVE_MAP['2-1-2 課程實施'],
    ('貳', '2-1-3'): DRIVE_MAP['2-1-3 體育專項術科訓練規劃'],
    ('貳', '3-1-1'): DRIVE_MAP['3-1-1 是否安排賽後補課'],
    ('貳', '3-1-2'): DRIVE_MAP['3-1-2 學業成績未達'],
    ('貳', '3-1-3'): DRIVE_MAP['3-1-3 課業輔導'],
    ('貳', '3-2'):   DRIVE_MAP['3-2 生活輔導'],
    ('貳', '3-3'):   DRIVE_MAP['3-3 升學輔導'],
    ('貳', '3-4'):   DRIVE_MAP['3-4 生涯發展'],
    ('貳', '4-1'):   DRIVE_MAP['4-1 性別平等'],
    ('貳', '4-2'):   DRIVE_MAP['4-2 反霸凌'],
    # 肆
    ('肆', '4-1'):   DRIVE_MAP['4-1 設班現況特色'],
    ('肆', '4-2'):   DRIVE_MAP['4-2 運作情形特色'],
    ('肆', '4-3'):   DRIVE_MAP['4-3 訓練績效特色'],
    ('肆', '4-4'):   DRIVE_MAP['4-4 其他'],
}

with open('index.html', encoding='utf-8') as f:
    html = f.read()

# Parse DATA sections and replace driveUrl: null with actual URLs
# Strategy: find each sub block { id: 'X-X', ... docs: [...] }
# and replace driveUrl: null inside that block with the correct URL

current_major = None
count = 0

def replace_in_sub(html, major_char, sub_id, url):
    """Within a sub block for given major+sub_id, replace all driveUrl: null with the url."""
    global count
    # Find the sub block: id: 'sub_id', name: ...
    pattern = r"(id:\s*'" + re.escape(sub_id) + r"',\s*name:[^}]+?docs:\s*\[)(.*?)(\][\s\n]*\})"
    def replacer(m):
        inner = m.group(2)
        new_inner = inner.replace('driveUrl: null', f"driveUrl: '{url}'")
        replaced = inner.count('driveUrl: null') - new_inner.count('driveUrl: null')
        global count
        count += replaced
        return m.group(1) + new_inner + m.group(3)
    return re.sub(pattern, replacer, html, flags=re.S)

# Process each major section in order
# 壹 section: between major: '壹、設班現況' and next major
# 貳 section: between major: '貳、運作情形' and next major
# 肆 section: between major: '肆、其他特色加分' and end

major_blocks = re.split(r"(major:\s*'[^']*')", html)

result_parts = []
current_major = None
for part in major_blocks:
    m = re.match(r"major:\s*'([^']*)'", part)
    if m:
        current_major = m.group(1)
        result_parts.append(part)
        continue
    if current_major:
        char = None
        if '壹' in current_major: char = '壹'
        elif '貳' in current_major: char = '貳'
        elif '肆' in current_major: char = '肆'
        if char:
            for (maj, sid), url in SUB_ID_MAP.items():
                if maj == char:
                    part = replace_in_sub(part, char, sid, url)
    result_parts.append(part)

html = ''.join(result_parts)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f'完成：替換了 {count} 個 driveUrl')
