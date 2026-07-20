import sqlite3, os, shutil, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

src = os.path.expandvars(r'%LOCALAPPDATA%\Google\DriveFS\105548059475444442893\metadata_sqlite_db')
tmp = os.path.expandvars(r'%TEMP%\gdrive_meta.db')
shutil.copy2(src, tmp)
con = sqlite3.connect(tmp)

def cloud_id(stable_id):
    r = con.execute("SELECT cloud_id FROM stable_ids WHERE stable_id=?", (stable_id,)).fetchone()
    return r[0] if r else stable_id

def get_title(stable_id):
    r = con.execute("SELECT local_title FROM items WHERE stable_id=?", (stable_id,)).fetchone()
    return r[0] if r else '?'

def get_parents(stable_id):
    return [r[0] for r in con.execute(
        "SELECT parent_stable_id FROM stable_parents WHERE item_stable_id=?", (stable_id,)).fetchall()]

# Find all 文件上傳 folders
uploads = con.execute(
    "SELECT stable_id, local_title FROM items WHERE local_title='文件上傳' AND is_folder=1 AND is_tombstone=0"
).fetchall()

print(f"找到 {len(uploads)} 個「文件上傳」資料夾\n")

results = []
for u_sid, u_title in uploads:
    u_cid = cloud_id(u_sid)
    parents = get_parents(u_sid)
    if not parents:
        continue
    sub_sid = parents[0]
    sub_title = get_title(sub_sid)
    gp_list = get_parents(sub_sid)
    gp_title = get_title(gp_list[0]) if gp_list else '?'
    url = f'https://drive.google.com/drive/folders/{u_cid}'
    results.append((gp_title, sub_title, url))
    print(f'{gp_title} / {sub_title}')
    print(f'  {url}\n')
