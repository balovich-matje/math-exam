#!/bin/bash
# Health check — run via cron every 5 min
# Restarts server if it's down

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health 2>/dev/null)

if [ "$RESPONSE" != "200" ]; then
  echo "$(date): Server down (HTTP $RESPONSE), restarting..." >> /Users/german-mac-mini/repos/math-exam/server/logs/healthcheck.log
  cd /Users/german-mac-mini/repos/math-exam/server
  lsof -ti:3001 | xargs kill -9 2>/dev/null
  sleep 1
  /bin/bash /Users/german-mac-mini/repos/math-exam/server/start.sh &
fi
