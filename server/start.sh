#!/bin/bash
# Start backend server + Cloudflare Tunnel
# Used by launchd for auto-start on boot

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

# Kill any existing processes
lsof -ti:3001 | xargs kill -9 2>/dev/null
sleep 1

# Start server
node --import tsx src/index.ts &
SERVER_PID=$!
echo "Server started (PID: $SERVER_PID)"

# Wait for server to be ready
sleep 2

# Start tunnel
cloudflared tunnel --url http://localhost:3001 2>&1 &
TUNNEL_PID=$!
echo "Tunnel started (PID: $TUNNEL_PID)"

# Log PIDs
echo "$SERVER_PID" > "$DIR/.server.pid"
echo "$TUNNEL_PID" > "$DIR/.tunnel.pid"

# Wait for either to exit
wait -n $SERVER_PID $TUNNEL_PID
