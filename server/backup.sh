#!/bin/bash
# Daily SQLite backup — run via cron
BACKUP_DIR="/Users/german-mac-mini/repos/math-exam/server/backups"
DB="/Users/german-mac-mini/repos/math-exam/server/data.db"
mkdir -p "$BACKUP_DIR"

if [ -f "$DB" ]; then
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  sqlite3 "$DB" ".backup '$BACKUP_DIR/data_$TIMESTAMP.db'"
  echo "$(date): Backup created data_$TIMESTAMP.db" >> "$BACKUP_DIR/backup.log"

  # Keep only last 7 backups
  ls -t "$BACKUP_DIR"/data_*.db 2>/dev/null | tail -n +8 | xargs rm -f 2>/dev/null
fi
