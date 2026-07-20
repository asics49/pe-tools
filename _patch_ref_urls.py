import re

REF_MAP = {
    # 壹、設班現況
    ('壹', '1-1'):   'https://drive.google.com/drive/folders/1XmFy7IWNUBdHExNu7V3vNoT7WVC69RH2',
    ('壹', '1-1-2'): 'https://drive.google.com/drive/folders/1gvRmSFhCwDpKgaWsaUPT2mMappYSu6Gk',
    ('壹', '1-1-3'): 'https://drive.google.com/drive/folders/1E4gJ0SmBC0GEch8bwrHIdaROtVpijhZn',
    ('壹', '1-1-4'): 'https://drive.google.com/drive/folders/1gsF93O2q8XVpZWeDBS6yzZT8X7BPuH4X',
    ('壹', '2-1-1'): 'https://drive.google.com/drive/folders/1WXVu4bPtYe9rs0M0TnCDCI4viW8Uml7b',
    ('壹', '2-1-2'): 'https://drive.google.com/drive/folders/1faJAe_KGbbg5d52YwQN4eLJ3SpuFCxn7',
    ('壹', '2-1-3'): 'https://drive.google.com/drive/folders/1_lLP6V2MkOi-uJFWo0eNxAVNoj5EKvyt',
    ('壹', '2-1-4'): 'https://drive.google.com/drive/folders/154L74raJgiu_v3-UvtA9sA6NuJ_oZ-D7',
    ('壹', '3-1-1'): 'https://drive.google.com/drive/folders/170c3sBysJ9o725ZjGN3y8xnz_4g3lCjW',
    ('壹', '3-1-2'): 'https://drive.google.com/drive/folders/1H8mc4Dy7XPNqS_xWoDUq-bqsWAYU3j2X',
    ('壹', '3-2-1'): 'https://drive.google.com/drive/folders/1O_kNR3dlJfnjvVsX1vEpU5NJTayFAsuy',
    ('壹', '3-2-2'): 'https://drive.google.com/drive/folders/18cw-dhmvogQ4XYUxMceP1bahY8QRuiNn',
    # 貳、運作情形
    ('貳', '1-1-1'): 'https://drive.google.com/drive/folders/1anV90dnuW7_g499pwEIlyaD9Cy-ZmCBk',
    ('貳', '1-1-2'): 'https://drive.google.com/drive/folders/1hJ5iG6ZMQmQNWP88IGQwxuIQDOJeiTOO',
    ('貳', '1-1-3'): 'https://drive.google.com/drive/folders/1s2Gt6AYKTnzcVC4IjbcQwjXDdo3LhA_H',
    ('貳', '2-1-1'): 'https://drive.google.com/drive/folders/1zBPPF0BkvTpqvGlIsXpHgesrx1tHDcTt',
    ('貳', '2-1-2'): 'https://drive.google.com/drive/folders/1FRukI_hvD9xtKRgU0ji82MJpF9I9vb15',
    ('貳', '2-1-3'): 'https://drive.google.com/drive/folders/1HtVPEp2OFtBshMyjHuJW2-XKW-rGkj7k',
    ('貳', '3-1-1'): 'https://drive.google.com/drive/folders/1SEL73ltF2xoOkjMda6if9ebPJoOnYQQJ',
    ('貳', '3-1-2'): 'https://drive.google.com/drive/folders/10u-Bn6KpRd_S8ipkVIGVeoxztC81klQj',
    ('貳', '3-1-3'): 'https://drive.google.com/drive/folders/1H-gvptt5dNDe-JsP7e1cixbqSfxfAkGh',
    ('貳', '3-2'):   'https://drive.google.com/drive/folders/17BHglR9UArBoxhfsDsIsU2M3qmVuZYyj',
    ('貳', '3-3'):   'https://drive.google.com/drive/folders/164dQrZVdxxSytIijLaMvlxk7U5bhPkOn',
    ('貳', '3-4'):   'https://drive.google.com/drive/folders/1eZ9VRkdG7OBQHheUzWliqskUjDQwybRH',
    ('貳', '4-1'):   'https://drive.google.com/drive/folders/1RHj_hrgJLpstbTOSiQ_fIr8dSyqFZ8LT',
    ('貳', '4-2'):   'https://drive.google.com/drive/folders/1K_ilVTK-7qoVBi06MMiLL5O24yI_nWI7',
    # 肆、其他特色加分
    ('肆', '4-1'):   'https://drive.google.com/drive/folders/1tfzgIlSCq8kHDiWlNBmtbEqQ8hZUv9K3',
    ('肆', '4-2'):   'https://drive.google.com/drive/folders/1mb4YoHPkBj39pbDqTYYzR9-0aquQLJGN',
    ('肆', '4-3'):   'https://drive.google.com/drive/folders/1eiupuYZQhhz56ywjdwi4pfpaNhlWFqHA',
    ('肆', '4-4'):   'https://drive.google.com/drive/folders/1FW6TDbS3mfSbntqicOU4obUNkOkTLpMY',
}

with open('index.html', encoding='utf-8') as f:
    html = f.read()

# Step 1: add refUrl: null to every doc entry that doesn't have it yet
html = re.sub(r"(driveUrl: '([^']*)')\s*\}", r"\1, refUrl: null }", html)
html = re.sub(r"(driveUrl: null)\s*\}", r"\1, refUrl: null }", html)

count = 0

def replace_ref_in_sub(html, char, sub_id, url):
    global count
    pattern = r"(id:\s*'" + re.escape(sub_id) + r"',\s*name:[^}]+?docs:\s*\[)(.*?)(\][\s\n]*\})"
    def replacer(m):
        inner = m.group(2)
        new_inner = inner.replace('refUrl: null', f"refUrl: '{url}'")
        global count
        count += inner.count('refUrl: null') - new_inner.count('refUrl: null')
        return m.group(1) + new_inner + m.group(3)
    return re.sub(pattern, replacer, html, flags=re.S)

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
            for (maj, sid), url in REF_MAP.items():
                if maj == char:
                    part = replace_ref_in_sub(part, char, sid, url)
    result_parts.append(part)

html = ''.join(result_parts)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f'完成：替換了 {count} 個 refUrl')
