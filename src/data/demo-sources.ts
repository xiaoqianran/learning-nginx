/** 与课程 Demo 一一对应的「可对照源码」说明（Nginx 配置片段） */
export const DEMO_SOURCES: Record<string, { title: string; code: string }> = {
  "request-flow": {
    title: "请求路径概念",
    code: `# Client → Nginx (server/location) → static | proxy_pass → upstream`,
  },
  "signal-panel": {
    title: "运维信号",
    code: `nginx -t && nginx -s reload`,
  },
  "context-tree": {
    title: "上下文",
    code: `main → events / http → server → location`,
  },
  "vhost-match": {
    title: "虚拟主机",
    code: `listen 80;\nserver_name a.com;`,
  },
  "location-match": {
    title: "location 规则",
    code: `location = /a { }\nlocation ^~ /static/ { }\nlocation ~ \\.php$ { }\nlocation / { }`,
  },
  "root-alias": {
    title: "root vs alias",
    code: `location /img/ { root /data; }\n# → /data/img/...\nlocation /img/ { alias /data/pics/; }\n# → /data/pics/...`,
  },
  "log-line": {
    title: "access_log",
    code: `log_format main '$remote_addr "$request" $status';`,
  },
  "rewrite-lab": {
    title: "rewrite",
    code: `rewrite ^/old/(.*)$ /new/$1 last;\nreturn 301 https://$host$request_uri;`,
  },
  "headers-view": {
    title: "响应头",
    code: `add_header X-Content-Type-Options nosniff always;`,
  },
  "cache-policy": {
    title: "缓存",
    code: `expires 30d;\nadd_header Cache-Control "public, immutable";`,
  },
  "rate-limit": {
    title: "限流",
    code: `limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;`,
  },
  "proxy-headers": {
    title: "反代头",
    code: `proxy_set_header Host $host;\nproxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`,
  },
  "lb-visual": {
    title: "upstream",
    code: `upstream api { least_conn; server a weight=3; server b; }`,
  },
  "websocket-upgrade": {
    title: "WebSocket",
    code: `proxy_set_header Upgrade $http_upgrade;\nproxy_set_header Connection $connection_upgrade;`,
  },
  "tls-checklist": {
    title: "TLS",
    code: `listen 443 ssl http2;\nssl_certificate fullchain.pem;`,
  },
  "spa-layout": {
    title: "SPA",
    code: `location / { try_files $uri $uri/ /index.html; }\nlocation /api/ { proxy_pass http://backend/; }`,
  },
  "acl-lab": {
    title: "ACL",
    code: `allow 10.0.0.0/8;\ndeny all;`,
  },
  canary: {
    title: "灰度",
    code: `split_clients $remote_addr $backend { 10% new; * old; }`,
  },
  "status-panel": {
    title: "stub_status",
    code: `location /nginx_status { stub_status; allow 10.0.0.0/8; deny all; }`,
  },
  "perf-knobs": {
    title: "性能",
    code: `worker_processes auto;\nworker_connections 4096;`,
  },
  "security-score": {
    title: "加固",
    code: `server_tokens off;\nclient_max_body_size 20m;`,
  },
  "cache-status": {
    title: "proxy_cache",
    code: `add_header X-Cache-Status $upstream_cache_status;`,
  },
  "interview-cards": {
    title: "串讲",
    code: `# master/worker · location · proxy headers · reload`,
  },
};
