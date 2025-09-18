# README

Websocket example.
Can work in 2 ways:
1. Client sends a message - server sends a message in response
2. Server sends a message - client handles it

## Start the app

The server is written in Deno. To run it:

```bash
deno run --allow-net=0.0.0.0:80 --allow-read=./index.html,./client.js,client.css server.js
```

Also:
1. Permissions-Policy header - to allow bfcache
2. Content-Security-Policy header - to protect against XSS

App is running on http://localhost:80/
