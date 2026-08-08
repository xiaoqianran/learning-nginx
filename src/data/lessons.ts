export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
};

export type DemoKind =
  | "request-flow"
  | "signal-panel"
  | "context-tree"
  | "vhost-match"
  | "location-match"
  | "root-alias"
  | "log-line"
  | "rewrite-lab"
  | "headers-view"
  | "cache-policy"
  | "rate-limit"
  | "proxy-headers"
  | "lb-visual"
  | "websocket-upgrade"
  | "tls-checklist"
  | "spa-layout"
  | "acl-lab"
  | "canary"
  | "status-panel"
  | "perf-knobs"
  | "security-score"
  | "cache-status"
  | "interview-cards";

export type LessonBlock =
  | { type: "text"; title?: string; body: string }
  | { type: "code"; title?: string; lang?: string; code: string }
  | { type: "tip"; body: string }
  | { type: "demo"; kind: DemoKind; title: string; hint?: string }
  | { type: "quiz"; questions: QuizQuestion[] };

export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  level: "入门" | "进阶" | "实战";
  track: "基础" | "进阶" | "反向代理" | "实战" | "工程化" | "性能与安全";
  format?: "course" | "reference";
  minutes: number;
  official?: string;
  blocks: LessonBlock[];
};


export const LESSONS: Lesson[] = [
  {
    "format": "course",
    "slug": "intro",
    "title": "Nginx 是什么",
    "summary": "高性能 Web 服务器 / 反向代理 / 网关。",
    "level": "入门",
    "track": "基础",
    "minutes": 6,
    "official": "/en/docs/",
    "blocks": [
      {
        "type": "text",
        "title": "Nginx 定位",
        "body": "Nginx（读作 engine-x）是高性能 HTTP 与反向代理服务器，也常用作邮件代理、负载均衡与 API 网关。核心特点：事件驱动、异步非阻塞、高并发低内存。\n\n和 Apache 的「一连接一进程/线程」不同，Nginx 用 master + worker 进程模型：master 管配置与子进程，worker 处理连接。"
      },
      {
        "type": "code",
        "title": "最小配置骨架",
        "lang": "nginx",
        "code": "worker_processes auto;\n\nevents {\n  worker_connections 1024;\n}\n\nhttp {\n  include       mime.types;\n  default_type  application/octet-stream;\n  sendfile      on;\n\n  server {\n    listen 80;\n    server_name example.com;\n    root /var/www/html;\n    index index.html;\n  }\n}"
      },
      {
        "type": "demo",
        "kind": "request-flow",
        "title": "动手：请求如何穿过 Nginx"
      },
      {
        "type": "tip",
        "body": "学习方法：先读配置片段 → 在 Demo 里模拟请求路径 → 做小测验。配置是 Nginx 的「源码」。"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "i1",
            "question": "Nginx 最常见的定位？",
            "options": [
              "仅数据库",
              "Web 服务器 / 反向代理 / 负载均衡",
              "仅前端框架",
              "仅邮件客户端"
            ],
            "answer": 1,
            "explain": "HTTP 服务与反向代理是主场。"
          },
          {
            "id": "i2",
            "question": "Nginx 处理高并发靠？",
            "options": [
              "每个连接一个进程阻塞 IO",
              "事件驱动 + 异步非阻塞",
              "仅靠更多 CPU 核轮询",
              "把页面写进内核"
            ],
            "answer": 1,
            "explain": "事件循环模型。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "install-run",
    "title": "安装与启停",
    "summary": "包管理安装、信号、nginx -t。",
    "level": "入门",
    "track": "基础",
    "minutes": 8,
    "official": "/en/docs/beginners_guide.html",
    "blocks": [
      {
        "type": "text",
        "title": "安装与验证",
        "body": "Linux 常用包管理：apt install nginx / yum install nginx。macOS 可用 brew install nginx。容器里常跑官方 nginx 镜像。\n\n关键命令：nginx -t 测试配置；nginx -s reload 热重载；nginx -s stop / quit。systemd：systemctl start|stop|reload nginx。"
      },
      {
        "type": "code",
        "title": "常用运维命令",
        "lang": "nginx",
        "code": "# 测试配置语法\nnginx -t\n\n# 热加载配置（不断开长连接策略因版本而异）\nnginx -s reload\n\n# 优雅退出\nnginx -s quit\n\n# 指定配置文件\nnginx -c /etc/nginx/nginx.conf -t"
      },
      {
        "type": "tip",
        "body": "永远先 nginx -t，再 reload。配置写错直接 reload 可能导致 worker 起不来。"
      },
      {
        "type": "demo",
        "kind": "signal-panel",
        "title": "动手：配置测试与信号"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "ir1",
            "question": "改配置后首选？",
            "options": [
              "直接 kill -9",
              "nginx -t 再 reload",
              "重启整台机器",
              "删掉 access.log"
            ],
            "answer": 1,
            "explain": "先测后加载。"
          },
          {
            "id": "ir2",
            "question": "nginx -s quit 含义？",
            "options": [
              "强制杀进程",
              "优雅退出",
              "仅清缓存",
              "开 debug"
            ],
            "answer": 1,
            "explain": "处理完当前请求再退出。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "config-structure",
    "title": "配置结构与上下文",
    "summary": "main / events / http / server / location。",
    "level": "入门",
    "track": "基础",
    "minutes": 10,
    "official": "/en/docs/beginners_guide.html",
    "blocks": [
      {
        "type": "text",
        "title": "上下文嵌套",
        "body": "Nginx 配置是分「上下文」的：最外层 main；events 管连接；http 管 HTTP；server 虚拟主机；location 路径匹配。指令只能写在允许的上下文中，写错位置会 nginx -t 失败。\n\ninherit：子上下文可继承父级部分指令（如 root、index），location 里可覆盖。"
      },
      {
        "type": "code",
        "title": "上下文示意",
        "lang": "nginx",
        "code": "main\n├── events { ... }\n└── http {\n      # 日志格式、gzip、upstream…\n      server {\n        listen 80;\n        server_name a.com;\n        location / {\n          root /var/www/a;\n        }\n        location /api/ {\n          proxy_pass http://backend;\n        }\n      }\n    }"
      },
      {
        "type": "demo",
        "kind": "context-tree",
        "title": "动手：上下文树"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "cs1",
            "question": "location 属于？",
            "options": [
              "events 上下文",
              "server 内",
              "只能 main",
              "仅 stream"
            ],
            "answer": 1,
            "explain": "HTTP server 块内。"
          },
          {
            "id": "cs2",
            "question": "proxy_pass 通常写在？",
            "options": [
              "events",
              "location（或 server）",
              "仅 mime.types",
              "仅 OS 内核"
            ],
            "answer": 1,
            "explain": "路径级转发。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "server-block",
    "title": "server 与虚拟主机",
    "summary": "listen、server_name、默认站点。",
    "level": "入门",
    "track": "基础",
    "minutes": 10,
    "official": "/en/docs/http/server_names.html",
    "blocks": [
      {
        "type": "text",
        "title": "多站点",
        "body": "一个 Nginx 可托管多个 server：用 listen 端口 + server_name 主机名区分。请求 Host 匹配 server_name；匹配失败落到默认 server（listen 上 default_server 或第一个）。"
      },
      {
        "type": "code",
        "title": "两个站点",
        "lang": "nginx",
        "code": "server {\n  listen 80 default_server;\n  server_name _;\n  return 444; # 拒绝未知 Host\n}\n\nserver {\n  listen 80;\n  server_name blog.example.com;\n  root /var/www/blog;\n}\n\nserver {\n  listen 80;\n  server_name api.example.com;\n  location / { proxy_pass http://127.0.0.1:3000; }\n}"
      },
      {
        "type": "demo",
        "kind": "vhost-match",
        "title": "动手：Host 如何选中 server"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "sb1",
            "question": "选中 server 主要依据？",
            "options": [
              "仅 URL path",
              "listen + server_name(Host)",
              "仅 User-Agent",
              "仅 Cookie"
            ],
            "answer": 1,
            "explain": "端口与主机名。"
          },
          {
            "id": "sb2",
            "question": "default_server 作用？",
            "options": [
              "加快 SSL",
              "无匹配时的默认站点",
              "禁用日志",
              "开 gzip"
            ],
            "answer": 1,
            "explain": "兜底虚拟主机。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "location",
    "title": "location 匹配规则",
    "summary": "前缀、=、~、^~ 与最长前缀。",
    "level": "入门",
    "track": "基础",
    "minutes": 12,
    "official": "/en/docs/http/ngx_http_core_module.html#location",
    "blocks": [
      {
        "type": "text",
        "title": "匹配优先级（实用版）",
        "body": "1) 精确 = 优先\n2) 最长前缀匹配；若前缀带 ^~ 则不再做正则\n3) 按配置顺序试正则 ~ / ~*\n4) 否则用最长前缀\n\n这是最容易踩坑的一课，务必用 Demo 试几组 URI。"
      },
      {
        "type": "code",
        "title": "典型 location",
        "lang": "nginx",
        "code": "location = /exact {\n  # 只匹配 /exact\n}\n\nlocation ^~ /static/ {\n  # 前缀优先，跳过正则\n  root /data;\n}\n\nlocation ~* \\.(js|css)$ {\n  expires 7d;\n}\n\nlocation / {\n  try_files $uri $uri/ /index.html;\n}"
      },
      {
        "type": "demo",
        "kind": "location-match",
        "title": "动手：URI 匹配哪个 location"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "loc1",
            "question": "location = /a 匹配？",
            "options": [
              "/a 与 /a/x",
              "仅精确 /a",
              "所有含 a",
              "正则优先于它"
            ],
            "answer": 1,
            "explain": "精确匹配。"
          },
          {
            "id": "loc2",
            "question": "^~ 的含义？",
            "options": [
              "强制正则",
              "前缀命中后不再走正则",
              "禁用缓存",
              "仅 IPv6"
            ],
            "answer": 1,
            "explain": "前缀短路。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "static-files",
    "title": "静态文件与 root/alias",
    "summary": "root vs alias、try_files、index。",
    "level": "入门",
    "track": "基础",
    "minutes": 10,
    "official": "/en/docs/http/ngx_http_core_module.html#root",
    "blocks": [
      {
        "type": "text",
        "title": "root 与 alias",
        "body": "root：文件路径 = root + URI。\nalias：用 alias 路径替换 location 前缀部分。\n\n例：location /img/ { root /data; } → /img/a.png → /data/img/a.png\nlocation /img/ { alias /data/pics/; } → /img/a.png → /data/pics/a.png"
      },
      {
        "type": "code",
        "title": "SPA 静态站",
        "lang": "nginx",
        "code": "server {\n  listen 80;\n  server_name app.example.com;\n  root /var/www/app/dist;\n  index index.html;\n\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n\n  location /assets/ {\n    expires 30d;\n    add_header Cache-Control \"public, immutable\";\n  }\n}"
      },
      {
        "type": "tip",
        "body": "alias 的 location 末尾斜杠要和 alias 路径斜杠配对，否则路径拼接容易错。"
      },
      {
        "type": "demo",
        "kind": "root-alias",
        "title": "动手：root vs alias 路径"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "sf1",
            "question": "root /var/www + URI /a.html →",
            "options": [
              "/a.html",
              "/var/www/a.html",
              "/var/www",
              "/var"
            ],
            "answer": 1,
            "explain": "root+URI。"
          },
          {
            "id": "sf2",
            "question": "SPA 刷新 404 常用？",
            "options": [
              "return 500",
              "try_files … /index.html",
              "关掉 gzip",
              "只开 SSL"
            ],
            "answer": 1,
            "explain": "回退前端路由。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "variables",
    "title": "内置变量与日志",
    "summary": "$uri、$host、access_log 格式。",
    "level": "入门",
    "track": "基础",
    "minutes": 8,
    "official": "/en/docs/http/ngx_http_log_module.html",
    "blocks": [
      {
        "type": "text",
        "title": "常用变量",
        "body": "$host、$remote_addr、$request_uri、$uri、$args、$http_user_agent、$scheme、$server_port、$status、$request_time 等。可用于 if、rewrite、proxy_set_header、日志。\n\n自定义日志格式：log_format + access_log。"
      },
      {
        "type": "code",
        "title": "日志格式",
        "lang": "nginx",
        "code": "http {\n  log_format main '$remote_addr - $remote_user [$time_local] '\n                  '\"$request\" $status $body_bytes_sent '\n                  '\"$http_referer\" \"$http_user_agent\" '\n                  'rt=$request_time';\n\n  access_log /var/log/nginx/access.log main;\n  error_log  /var/log/nginx/error.log warn;\n}"
      },
      {
        "type": "demo",
        "kind": "log-line",
        "title": "动手：拼一条 access_log"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "v1",
            "question": "$request_uri 包含？",
            "options": [
              "仅 path",
              "原请求 URI（含 query）",
              "仅 host",
              "仅状态码"
            ],
            "answer": 1,
            "explain": "含查询串。"
          },
          {
            "id": "v2",
            "question": "error_log 级别 warn 会？",
            "options": [
              "不记错误",
              "记 warn 及以上",
              "只记 debug",
              "关闭文件"
            ],
            "answer": 1,
            "explain": "阈值过滤。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "rewrite",
    "title": "rewrite 与 return",
    "summary": "重定向、改写 URI、last/break。",
    "level": "进阶",
    "track": "进阶",
    "minutes": 12,
    "official": "/en/docs/http/ngx_http_rewrite_module.html",
    "blocks": [
      {
        "type": "text",
        "title": "rewrite 模块",
        "body": "return 最直接：return 301 https://$host$request_uri;\nrewrite 正则改写 URI，标志：last 重新 location 匹配；break 停止 rewrite 模块继续当前 location；redirect/permanent 对外重定向。\n\n能 return 就别复杂 rewrite。"
      },
      {
        "type": "code",
        "title": "HTTPS 与去尾斜杠",
        "lang": "nginx",
        "code": "# 强制 HTTPS\nserver {\n  listen 80;\n  server_name example.com;\n  return 301 https://$host$request_uri;\n}\n\n# 内部改写\nlocation /old {\n  rewrite ^/old/(.*)$ /new/$1 last;\n}"
      },
      {
        "type": "demo",
        "kind": "rewrite-lab",
        "title": "动手：rewrite 结果预览"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "rw1",
            "question": "301 vs 302？",
            "options": [
              "都一样",
              "301 永久 / 302 临时",
              "301 仅 POST",
              "302 不能带 query"
            ],
            "answer": 1,
            "explain": "缓存与 SEO 语义不同。"
          },
          {
            "id": "rw2",
            "question": "rewrite … last 会？",
            "options": [
              "结束响应",
              "重新找 location",
              "只记日志",
              "开 SSL"
            ],
            "answer": 1,
            "explain": "重新匹配。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "if-pitfalls",
    "title": "if 是邪恶的？",
    "summary": "rewrite if 的限制与替代写法。",
    "level": "进阶",
    "track": "进阶",
    "minutes": 10,
    "official": "/en/docs/http/ngx_http_rewrite_module.html#if",
    "blocks": [
      {
        "type": "text",
        "title": "if 慎用",
        "body": "在 location 里 if 只属于 rewrite 模块语义，和你想象的「通用 if」不同：嵌套 if、if 里 set+proxy_pass 组合容易出诡异行为。\n\n推荐：用 map 做变量映射；用 try_files；用独立 location；用 return。"
      },
      {
        "type": "code",
        "title": "用 map 替代 if",
        "lang": "nginx",
        "code": "map $http_upgrade $connection_upgrade {\n  default upgrade;\n  ''      close;\n}\n\nmap $request_uri $bad_bot {\n  default 0;\n  ~*bad-scraper 1;\n}\n\nserver {\n  if ($bad_bot) { return 403; }\n  # 更复杂的分流优先 map + location\n}"
      },
      {
        "type": "tip",
        "body": "社区名言：IfIsEvil — 不是完全不能用，而是默认另找更稳的结构。"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "if1",
            "question": "推荐替代 location if 的方式？",
            "options": [
              "更深嵌套 if",
              "map / 多 location / try_files",
              "删除 server",
              "只用 DNS"
            ],
            "answer": 1,
            "explain": "结构化配置。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "headers",
    "title": "响应头与 CORS",
    "summary": "add_header、安全头、跨域。",
    "level": "进阶",
    "track": "进阶",
    "minutes": 10,
    "official": "/en/docs/http/ngx_http_headers_module.html",
    "blocks": [
      {
        "type": "text",
        "title": "add_header 注意点",
        "body": "add_header 在错误响应上默认不继承（取决于 always 参数）。安全头常见：X-Content-Type-Options、X-Frame-Options、Referrer-Policy、Content-Security-Policy。\n\nCORS：对 OPTIONS 预检 return 204 并带 Access-Control-*。"
      },
      {
        "type": "code",
        "title": "安全头 + CORS 片段",
        "lang": "nginx",
        "code": "add_header X-Content-Type-Options nosniff always;\nadd_header X-Frame-Options SAMEORIGIN always;\nadd_header Referrer-Policy strict-origin-when-cross-origin always;\n\nlocation /api/ {\n  if ($request_method = OPTIONS) {\n    add_header Access-Control-Allow-Origin *;\n    add_header Access-Control-Allow-Methods 'GET,POST,OPTIONS';\n    add_header Access-Control-Allow-Headers '*';\n    return 204;\n  }\n  add_header Access-Control-Allow-Origin * always;\n  proxy_pass http://backend;\n}"
      },
      {
        "type": "demo",
        "kind": "headers-view",
        "title": "动手：响应头清单"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "hd1",
            "question": "add_header … always 作用？",
            "options": [
              "仅 200",
              "非成功状态也加头",
              "禁用缓存",
              "强制 HTTP/2"
            ],
            "answer": 1,
            "explain": "错误响应也输出。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "gzip-cache",
    "title": "Gzip 与浏览器缓存",
    "summary": "gzip_types、expires、etag。",
    "level": "进阶",
    "track": "进阶",
    "minutes": 9,
    "official": "/en/docs/http/ngx_http_gzip_module.html",
    "blocks": [
      {
        "type": "text",
        "title": "压缩与缓存",
        "body": "gzip on；注意不要对已压缩格式（jpg/png/zip）再压。静态资源用长 expires + 文件名 hash；HTML 短缓存或 no-cache。"
      },
      {
        "type": "code",
        "title": "压缩与缓存",
        "lang": "nginx",
        "code": "gzip on;\ngzip_comp_level 5;\ngzip_min_length 1024;\ngzip_types text/plain text/css application/javascript application/json image/svg+xml;\n\nlocation ~* \\.(js|css|png|jpg|svg|woff2)$ {\n  expires 30d;\n  add_header Cache-Control \"public, max-age=2592000, immutable\";\n}\n\nlocation = /index.html {\n  add_header Cache-Control \"no-cache\";\n}"
      },
      {
        "type": "demo",
        "kind": "cache-policy",
        "title": "动手：缓存策略对照"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "gz1",
            "question": "应对 jpg 开 gzip？",
            "options": [
              "强烈推荐",
              "通常无收益甚至浪费 CPU",
              "必须",
              "会变清晰"
            ],
            "answer": 1,
            "explain": "已压缩二进制。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "rate-limit",
    "title": "限流与连接限制",
    "summary": "limit_req、limit_conn。",
    "level": "进阶",
    "track": "进阶",
    "minutes": 10,
    "official": "/en/docs/http/ngx_http_limit_req_module.html",
    "blocks": [
      {
        "type": "text",
        "title": "防刷",
        "body": "limit_req_zone 在 http 上下文定义共享内存区；location 里 limit_req。burst 允许突发；nodelay 立即处理或拒绝。limit_conn 限并发连接。"
      },
      {
        "type": "code",
        "title": "简单限流",
        "lang": "nginx",
        "code": "http {\n  limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;\n  limit_conn_zone $binary_remote_addr zone=addr:10m;\n\n  server {\n    location /login {\n      limit_req zone=one burst=20 nodelay;\n      limit_conn addr 10;\n      proxy_pass http://app;\n    }\n  }\n}"
      },
      {
        "type": "demo",
        "kind": "rate-limit",
        "title": "动手：令牌桶直觉"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "rl1",
            "question": "limit_req_zone 写在？",
            "options": [
              "location 最内层必须",
              "http 上下文",
              "仅 events",
              "仅 OS"
            ],
            "answer": 1,
            "explain": "共享区在 http。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "proxy-basics",
    "title": "反向代理入门",
    "summary": "proxy_pass、Host、X-Forwarded-*。",
    "level": "进阶",
    "track": "反向代理",
    "minutes": 12,
    "official": "/en/docs/http/ngx_http_proxy_module.html",
    "blocks": [
      {
        "type": "text",
        "title": "反向代理",
        "body": "浏览器 → Nginx → 上游应用。Nginx 终结客户端连接，再向 backend 发起。务必设置 Host 与 X-Forwarded-For/Proto，否则应用生成错误链接或日志不准。"
      },
      {
        "type": "code",
        "title": "标准反代",
        "lang": "nginx",
        "code": "location / {\n  proxy_pass http://127.0.0.1:3000;\n  proxy_http_version 1.1;\n  proxy_set_header Host $host;\n  proxy_set_header X-Real-IP $remote_addr;\n  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n  proxy_set_header X-Forwarded-Proto $scheme;\n}"
      },
      {
        "type": "demo",
        "kind": "proxy-headers",
        "title": "动手：反代转发头"
      },
      {
        "type": "tip",
        "body": "proxy_pass 末尾斜杠会改写 URI：proxy_pass http://b/; 与 http://b; 行为不同！"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "px1",
            "question": "X-Forwarded-For 用途？",
            "options": [
              "加密 body",
              "传递客户端真实 IP 链",
              "关 gzip",
              "选 cipher"
            ],
            "answer": 1,
            "explain": "代理链 IP。"
          },
          {
            "id": "px2",
            "question": "proxy_pass 斜杠差异？",
            "options": [
              "无差异",
              "是否替换 location 前缀 URI",
              "仅影响日志颜色",
              "只改端口"
            ],
            "answer": 1,
            "explain": "URI 替换规则。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "upstream",
    "title": "upstream 与负载均衡",
    "summary": "轮询、权重、ip_hash、健康检查思路。",
    "level": "进阶",
    "track": "反向代理",
    "minutes": 12,
    "official": "/en/docs/http/ngx_http_upstream_module.html",
    "blocks": [
      {
        "type": "text",
        "title": "负载均衡",
        "body": "upstream 定义后端池：默认轮询；weight；ip_hash 会话粘滞；least_conn。max_fails / fail_timeout 简单摘除。商业版有主动健康检查；开源可借助第三方或外部探针。"
      },
      {
        "type": "code",
        "title": "upstream 池",
        "lang": "nginx",
        "code": "upstream api_backends {\n  least_conn;\n  server 10.0.0.1:8080 weight=3;\n  server 10.0.0.2:8080;\n  server 10.0.0.3:8080 backup;\n}\n\nserver {\n  location /api/ {\n    proxy_pass http://api_backends;\n  }\n}"
      },
      {
        "type": "demo",
        "kind": "lb-visual",
        "title": "动手：请求如何分发"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "up1",
            "question": "backup 服务器？",
            "options": [
              "永远优先",
              "仅当其他不可用",
              "只读日志",
              "仅 IPv6"
            ],
            "answer": 1,
            "explain": "备用节点。"
          },
          {
            "id": "up2",
            "question": "ip_hash 适合？",
            "options": [
              "完全无状态 API 必须",
              "需要会话粘滞到同一节点",
              "替代 HTTPS",
              "压缩图片"
            ],
            "answer": 1,
            "explain": "同源粘滞。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "websocket",
    "title": "WebSocket 代理",
    "summary": "Upgrade 与 Connection 头。",
    "level": "进阶",
    "track": "反向代理",
    "minutes": 8,
    "official": "/en/docs/http/websocket.html",
    "blocks": [
      {
        "type": "text",
        "title": "升级协议",
        "body": "WebSocket 需把 Connection、Upgrade 正确转发，并加长超时。配合 map $connection_upgrade。"
      },
      {
        "type": "code",
        "title": "WS 反代",
        "lang": "nginx",
        "code": "map $http_upgrade $connection_upgrade {\n  default upgrade;\n  '' close;\n}\n\nlocation /ws/ {\n  proxy_pass http://127.0.0.1:4000;\n  proxy_http_version 1.1;\n  proxy_set_header Upgrade $http_upgrade;\n  proxy_set_header Connection $connection_upgrade;\n  proxy_read_timeout 3600s;\n}"
      },
      {
        "type": "demo",
        "kind": "websocket-upgrade",
        "title": "动手：Upgrade 握手"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "ws1",
            "question": "代理 WebSocket 必备？",
            "options": [
              "gzip_static",
              "Upgrade + Connection 头",
              "仅 expires",
              "disable_symlinks"
            ],
            "answer": 1,
            "explain": "协议升级。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "grpc-proxy",
    "title": "gRPC 与 HTTP/2",
    "summary": "grpc_pass、http2。",
    "level": "进阶",
    "track": "反向代理",
    "minutes": 8,
    "official": "/en/docs/http/ngx_http_grpc_module.html",
    "blocks": [
      {
        "type": "text",
        "title": "gRPC",
        "body": "Nginx 可做 gRPC 代理：listen … http2; grpc_pass grpc://backend;。注意超时与大消息。HTTP/2 也用于前端加速。"
      },
      {
        "type": "code",
        "title": "gRPC 代理",
        "lang": "nginx",
        "code": "server {\n  listen 443 ssl http2;\n  # ssl_certificate …\n\n  location / {\n    grpc_pass grpc://127.0.0.1:50051;\n  }\n}"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "grpc1",
            "question": "grpc_pass 目标协议？",
            "options": [
              "仅 FTP",
              "gRPC（HTTP/2）后端",
              "SMTP",
              "仅 UDP DNS"
            ],
            "answer": 1,
            "explain": "gRPC 模块。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "ssl-tls",
    "title": "HTTPS / TLS",
    "summary": "证书、http2、HSTS、重定向。",
    "level": "进阶",
    "track": "反向代理",
    "minutes": 12,
    "official": "/en/docs/http/configuring_https_servers.html",
    "blocks": [
      {
        "type": "text",
        "title": "终结 TLS",
        "body": "在 Nginx 配置 ssl_certificate / ssl_certificate_key；现代套件；OCSP stapling 可选。全站 HTTPS：80→443 301，并考虑 HSTS。"
      },
      {
        "type": "code",
        "title": "TLS server",
        "lang": "nginx",
        "code": "server {\n  listen 443 ssl http2;\n  server_name example.com;\n\n  ssl_certificate     /etc/nginx/certs/fullchain.pem;\n  ssl_certificate_key /etc/nginx/certs/privkey.pem;\n  ssl_protocols       TLSv1.2 TLSv1.3;\n  ssl_prefer_server_ciphers off;\n\n  add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains\" always;\n\n  location / { root /var/www; }\n}"
      },
      {
        "type": "demo",
        "kind": "tls-checklist",
        "title": "动手：HTTPS 清单"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "ssl1",
            "question": "HSTS 作用？",
            "options": [
              "压缩 HTML",
              "强制浏览器后续用 HTTPS",
              "选 upstream",
              "写 access_log"
            ],
            "answer": 1,
            "explain": "安全策略头。"
          },
          {
            "id": "ssl2",
            "question": "证书私钥指令？",
            "options": [
              "ssl_certificate_key",
              "root",
              "worker_processes",
              "sendfile"
            ],
            "answer": 0,
            "explain": "私钥路径。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "spa-deploy",
    "title": "前端 SPA 部署",
    "summary": "try_files、资源缓存、API 反代。",
    "level": "实战",
    "track": "实战",
    "minutes": 12,
    "blocks": [
      {
        "type": "text",
        "title": "前后端同域",
        "body": "静态 dist + /api 反代到 Node/Go/Java。注意 history 路由与 404。"
      },
      {
        "type": "code",
        "title": "一体化站点",
        "lang": "nginx",
        "code": "server {\n  listen 80;\n  server_name app.example.com;\n  root /var/www/app/dist;\n\n  location /api/ {\n    proxy_pass http://127.0.0.1:8080/;\n    proxy_set_header Host $host;\n    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n  }\n\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}"
      },
      {
        "type": "demo",
        "kind": "spa-layout",
        "title": "动手：SPA 架构图"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "spa1",
            "question": "前端路由刷新空白/404？",
            "options": [
              "加 try_files 回 index.html",
              "关掉 JS",
              "只开 IPv6",
              "删掉 root"
            ],
            "answer": 0,
            "explain": "回退入口。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "php-fpm",
    "title": "PHP-FPM 对接",
    "summary": "fastcgi_pass、SCRIPT_FILENAME。",
    "level": "实战",
    "track": "实战",
    "minutes": 10,
    "official": "/en/docs/http/ngx_http_fastcgi_module.html",
    "blocks": [
      {
        "type": "text",
        "title": "FastCGI",
        "body": "Nginx 不解释 PHP，转给 php-fpm。关键：fastcgi_param SCRIPT_FILENAME；防止 PATH_INFO 漏洞的配置模式。"
      },
      {
        "type": "code",
        "title": "PHP 站点",
        "lang": "nginx",
        "code": "location ~ \\.php$ {\n  include fastcgi_params;\n  fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;\n  fastcgi_pass unix:/run/php/php8.2-fpm.sock;\n  try_files $uri =404;\n}"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "php1",
            "question": "Nginx 如何跑 PHP？",
            "options": [
              "内置 Zend",
              "fastcgi_pass 到 php-fpm",
              "eval 源码",
              "只靠 gzip"
            ],
            "answer": 1,
            "explain": "FPM。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "auth-basic",
    "title": "Basic Auth 与访问控制",
    "summary": "auth_basic、allow/deny、内部 location。",
    "level": "实战",
    "track": "实战",
    "minutes": 8,
    "blocks": [
      {
        "type": "text",
        "title": "简单鉴权",
        "body": "htpasswd 生成密码文件；auth_basic + auth_basic_user_file。IP 白名单 allow/deny。internal location 仅内部重定向可访问。"
      },
      {
        "type": "code",
        "title": "保护 /admin",
        "lang": "nginx",
        "code": "location /admin/ {\n  auth_basic \"Restricted\";\n  auth_basic_user_file /etc/nginx/.htpasswd;\n  allow 10.0.0.0/8;\n  deny all;\n  proxy_pass http://admin_ui;\n}"
      },
      {
        "type": "demo",
        "kind": "acl-lab",
        "title": "动手：allow/deny 顺序"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "ab1",
            "question": "deny all 写在 allow 前？",
            "options": [
              "后面 allow 仍生效",
              "可能先拒绝导致 allow 无效（按顺序）",
              "自动排序",
              "只影响 IPv6"
            ],
            "answer": 1,
            "explain": "规则顺序重要。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "split-traffic",
    "title": "灰度与分流",
    "summary": "split_clients、map 灰度。",
    "level": "实战",
    "track": "实战",
    "minutes": 10,
    "blocks": [
      {
        "type": "text",
        "title": "灰度发布",
        "body": "split_clients 按百分比分流；或 cookie/header map 到不同 upstream。"
      },
      {
        "type": "code",
        "title": "10% 新版本",
        "lang": "nginx",
        "code": "split_clients $remote_addr $backend {\n  10%     new;\n  *       old;\n}\n\nupstream old { server 10.0.0.1:8080; }\nupstream new { server 10.0.0.2:8080; }\n\nlocation / {\n  proxy_pass http://$backend;\n}"
      },
      {
        "type": "demo",
        "kind": "canary",
        "title": "动手：灰度比例"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "st1",
            "question": "split_clients 常用键？",
            "options": [
              "$remote_addr 或自定义变量",
              "仅 $pid",
              "仅时间戳随机每次必变且无粘滞",
              "SSL 私钥"
            ],
            "answer": 0,
            "explain": "稳定哈希键。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "docker-compose",
    "title": "容器里的 Nginx",
    "summary": "官方镜像、挂载 conf、反向代理网络。",
    "level": "实战",
    "track": "实战",
    "minutes": 10,
    "blocks": [
      {
        "type": "text",
        "title": "Docker",
        "body": "镜像 nginx:alpine；把 conf.d 挂进 /etc/nginx/conf.d；用 docker network 用服务名做 proxy_pass。注意文件权限与 PID。"
      },
      {
        "type": "code",
        "title": "compose 片段",
        "lang": "nginx",
        "code": "services:\n  web:\n    image: nginx:alpine\n    ports: [\"80:80\"]\n    volumes:\n      - ./nginx.conf:/etc/nginx/nginx.conf:ro\n      - ./html:/usr/share/nginx/html:ro\n  api:\n    image: my-api:latest"
      },
      {
        "type": "tip",
        "body": "容器内 upstream 主机名用 compose 服务名，不要写死宿主机 localhost（那是容器自己）。"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "dc1",
            "question": "compose 中反代 API 主机名？",
            "options": [
              "localhost（容器内）通常错",
              "服务名如 api",
              "必须公网 IP",
              "只能 IP 字面 1.1.1.1"
            ],
            "answer": 1,
            "explain": "Docker DNS。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "include-structure",
    "title": "配置拆分与 include",
    "summary": "conf.d、snippets、可维护结构。",
    "level": "进阶",
    "track": "工程化",
    "minutes": 8,
    "blocks": [
      {
        "type": "text",
        "title": "可维护性",
        "body": "主文件 include mime.types; include conf.d/*.conf; snippets 抽 SSL、安全头、proxy 公共头。环境差异用不同文件而非巨型 if。"
      },
      {
        "type": "code",
        "title": "推荐目录",
        "lang": "nginx",
        "code": "/etc/nginx/\n  nginx.conf\n  conf.d/\n    00-map.conf\n    example.com.conf\n  snippets/\n    ssl-params.conf\n    proxy-headers.conf\n  sites-enabled/ → sites-available/"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "inc1",
            "question": "include 的价值？",
            "options": [
              "提高 QPS 十倍",
              "拆分复用、降低单文件复杂度",
              "替代 TLS",
              "关闭 worker"
            ],
            "answer": 1,
            "explain": "工程化。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "observability",
    "title": "可观测性",
    "summary": "status、stub_status、日志指标。",
    "level": "进阶",
    "track": "工程化",
    "minutes": 9,
    "blocks": [
      {
        "type": "text",
        "title": "监控",
        "body": "stub_status 暴露基础连接计数；结合 Prometheus exporter。结构化 access_log（JSON）方便采集。慢请求看 $request_time。"
      },
      {
        "type": "code",
        "title": "status 端点",
        "lang": "nginx",
        "code": "location /nginx_status {\n  stub_status;\n  allow 10.0.0.0/8;\n  deny all;\n}"
      },
      {
        "type": "demo",
        "kind": "status-panel",
        "title": "动手：读懂 status"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "ob1",
            "question": "stub_status 应？",
            "options": [
              "公网无鉴权敞开",
              "内网/鉴权保护",
              "写进 HTML 注释",
              "替代 error_log"
            ],
            "answer": 1,
            "explain": "敏感指标。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "performance",
    "title": "性能调优要点",
    "summary": "worker、连接、sendfile、缓冲。",
    "level": "进阶",
    "track": "工程化",
    "minutes": 10,
    "blocks": [
      {
        "type": "text",
        "title": "调优清单",
        "body": "worker_processes auto；worker_connections；worker_rlimit_nofile；sendfile on；tcp_nopush；keepalive 到上游；proxy 缓冲按需。先压测再改，避免盲调。"
      },
      {
        "type": "code",
        "title": "events 与 keepalive",
        "lang": "nginx",
        "code": "worker_processes auto;\nworker_rlimit_nofile 65535;\n\nevents {\n  worker_connections 4096;\n  multi_accept on;\n}\n\nupstream app {\n  server 127.0.0.1:3000;\n  keepalive 32;\n}\n\nlocation / {\n  proxy_http_version 1.1;\n  proxy_set_header Connection \"\";\n  proxy_pass http://app;\n}"
      },
      {
        "type": "demo",
        "kind": "perf-knobs",
        "title": "动手：关键旋钮"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "pf1",
            "question": "worker_processes 常设？",
            "options": [
              "必须 1",
              "auto 或 CPU 核数",
              "等于域名数",
              "等于证书数"
            ],
            "answer": 1,
            "explain": "匹配 CPU。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "security-hardening",
    "title": "安全加固",
    "summary": "隐藏版本、限制方法、上传大小。",
    "level": "进阶",
    "track": "工程化",
    "minutes": 10,
    "blocks": [
      {
        "type": "text",
        "title": "加固",
        "body": "server_tokens off；限制请求方法；client_max_body_size；超时防慢速攻击；不暴露 .git；TLS 现代化。"
      },
      {
        "type": "code",
        "title": "加固片段",
        "lang": "nginx",
        "code": "server_tokens off;\nclient_max_body_size 20m;\nclient_body_timeout 12s;\nsend_timeout 12s;\n\nlocation ~ /\\. {\n  deny all;\n}\n\nif ($request_method !~ ^(GET|POST|HEAD|OPTIONS)$) {\n  return 405;\n}"
      },
      {
        "type": "demo",
        "kind": "security-score",
        "title": "动手：安全评分"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "sec1",
            "question": "server_tokens off？",
            "options": [
              "关闭整个 server",
              "隐藏版本号",
              "禁用 HTTPS",
              "清空日志"
            ],
            "answer": 1,
            "explain": "减少信息泄露。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "ci-nginx-t",
    "title": "CI 里测配置",
    "summary": "nginx -t、容器化校验、评审清单。",
    "level": "进阶",
    "track": "工程化",
    "minutes": 8,
    "blocks": [
      {
        "type": "text",
        "title": "配置即代码",
        "body": "PR 流水线：docker run nginx nginx -t -c …；审查 proxy_pass 斜杠、默认 server、密钥是否入库。"
      },
      {
        "type": "code",
        "title": "CI 伪代码",
        "lang": "nginx",
        "code": "docker run --rm -v $PWD/nginx:/etc/nginx:ro nginx:alpine nginx -t"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "ci1",
            "question": "合并前最少检查？",
            "options": [
              "nginx -t",
              "仅看文件名",
              "随机 curl 百度",
              "关掉 CI"
            ],
            "answer": 0,
            "explain": "语法与上下文。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "cache-proxy",
    "title": "代理缓存",
    "summary": "proxy_cache_path、缓存键与旁路。",
    "level": "进阶",
    "track": "性能与安全",
    "minutes": 12,
    "official": "/en/docs/http/ngx_http_proxy_module.html#proxy_cache",
    "blocks": [
      {
        "type": "text",
        "title": "proxy_cache",
        "body": "缓存上游响应加速读多写少接口或页面。定义 levels、keys_zone；proxy_cache_valid；bypass/no_cache 条件。"
      },
      {
        "type": "code",
        "title": "缓存示例",
        "lang": "nginx",
        "code": "proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=STATIC:64m inactive=60m max_size=1g;\n\nlocation / {\n  proxy_cache STATIC;\n  proxy_cache_valid 200 10m;\n  proxy_cache_use_stale error timeout updating;\n  add_header X-Cache-Status $upstream_cache_status;\n  proxy_pass http://origin;\n}"
      },
      {
        "type": "demo",
        "kind": "cache-status",
        "title": "动手：HIT / MISS / BYPASS"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "pc1",
            "question": "$upstream_cache_status 常见值？",
            "options": [
              "仅 OK",
              "HIT/MISS/BYPASS/EXPIRED…",
              "仅 200",
              "TLS 版本"
            ],
            "answer": 1,
            "explain": "缓存状态。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "http3-quic",
    "title": "HTTP/3 与 QUIC 概览",
    "summary": "现代协议能力边界。",
    "level": "进阶",
    "track": "性能与安全",
    "minutes": 8,
    "blocks": [
      {
        "type": "text",
        "title": "HTTP/3",
        "body": "基于 QUIC/UDP。Nginx 主线逐步支持；需编译/发行版与证书配套。明白它解决队头阻塞与弱网，不自动让应用变正确。"
      },
      {
        "type": "tip",
        "body": "上线 HTTP/3 前确认 CDN/负载均衡整条链路支持，并保留 HTTP/2 回落。"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "h3",
            "question": "HTTP/3 传输层？",
            "options": [
              "仅 TCP",
              "QUIC over UDP",
              "仅 ICMP",
              "SMTP"
            ],
            "answer": 1,
            "explain": "QUIC。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "waf-mindset",
    "title": "WAF 与网关思维",
    "summary": "ModSecurity、常见攻击面。",
    "level": "进阶",
    "track": "性能与安全",
    "minutes": 9,
    "blocks": [
      {
        "type": "text",
        "title": "网关职责",
        "body": "Nginx 常做第一道门：TLS、限流、鉴权、路由、基础 WAF 规则。复杂 bot/WAF 可用专用产品或 OpenResty/ModSecurity 模块。重点是纵深防御，不单点迷信。"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "waf1",
            "question": "限流能否替代全部安全？",
            "options": [
              "能，足够",
              "不能，需纵深（鉴权、补丁、WAF…）",
              "只需关 80",
              "只需换主题色"
            ],
            "answer": 1,
            "explain": "多层防御。"
          }
        ]
      }
    ]
  },
  {
    "format": "course",
    "slug": "interview",
    "title": "面试串讲",
    "summary": "高频题：进程模型、location、反代、惊群。",
    "level": "进阶",
    "track": "性能与安全",
    "minutes": 12,
    "blocks": [
      {
        "type": "text",
        "title": "速答提纲",
        "body": "1) master/worker 与事件模型\n2) location 匹配顺序\n3) 反向代理头与真实 IP\n4) reload 热加载配置\n5) 与 Apache 对比\n6) 惊群与 reuseport（版本相关）\n7) 限流算法直觉\n8) 一条生产 nginx.conf 怎么拆"
      },
      {
        "type": "demo",
        "kind": "interview-cards",
        "title": "动手：抽题自测"
      },
      {
        "type": "quiz",
        "questions": [
          {
            "id": "iv1",
            "question": "reload 默认由谁加载新配置？",
            "options": [
              "浏览器",
              "master 校验并平滑替换 worker",
              "仅 DNS",
              "systemd 必须 kill -9"
            ],
            "answer": 1,
            "explain": "master 管理。"
          },
          {
            "id": "iv2",
            "question": "获取客户端 IP 在反代后看？",
            "options": [
              "只信 $remote_addr 在多层代理后总是终端用户",
              "需 X-Forwarded-For / real_ip 模块配置",
              "看 HTML title",
              "看 SSL 指纹即可"
            ],
            "answer": 1,
            "explain": "信任链配置。"
          }
        ]
      }
    ]
  }
];

export const TRACKS = [
  "基础",
  "进阶",
  "反向代理",
  "实战",
  "工程化",
  "性能与安全",
] as const;

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

export function getLessonIndex(slug: string): number {
  return LESSONS.findIndex((l) => l.slug === slug);
}

export function getAdjacent(slug: string): { prev?: Lesson; next?: Lesson } {
  const i = getLessonIndex(slug);
  if (i < 0) return {};
  return {
    prev: i > 0 ? LESSONS[i - 1] : undefined,
    next: i < LESSONS.length - 1 ? LESSONS[i + 1] : undefined,
  };
}

export function getLessonsByTrack(track: Lesson["track"]) {
  return LESSONS.filter((l) => l.track === track);
}

export function getAllQuizQuestions(): Array<
  QuizQuestion & { lessonSlug: string; lessonTitle: string }
> {
  const out: Array<QuizQuestion & { lessonSlug: string; lessonTitle: string }> = [];
  for (const lesson of LESSONS) {
    for (const block of lesson.blocks) {
      if (block.type === "quiz") {
        for (const q of block.questions) {
          out.push({ ...q, lessonSlug: lesson.slug, lessonTitle: lesson.title });
        }
      }
    }
  }
  return out;
}

export function isCourseLesson(l: Lesson): boolean {
  if (l.format === "reference") return false;
  if (l.format === "course") return true;
  return true;
}

export function getCourseLessons(): Lesson[] {
  return LESSONS.filter(isCourseLesson);
}
