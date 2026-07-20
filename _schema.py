import sqlite3, os, shutil
src = os.path.expandvars(r'%LOCALAPPDATA%\Google\DriveFS\105548059475444442893\metadata_sqlite_db')
tmp = os.path.expandvars(r'%TEMP%\gdrive_meta.db')
shutil.copy2(src, tmp)
con = sqlite3.connect(tmp)
tables = con.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
print("Tables:", [t[0] for t in tables])
for t in tables:
    cols = con.execute(f"PRAGMA table_info({t[0]})").fetchall()
    print(f"\n{t[0]}:", [c[1] for c in cols])
