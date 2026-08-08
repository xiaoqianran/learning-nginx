/** 对照 nginx.org 文档结构 · 左侧官网 / 右侧本站课 */

export type DocLink = {
  title: string;
  official: string;
  lessonSlug?: string;
  note?: string;
};

export type DocSection = {
  title: string;
  items: DocLink[];
};

const OFF = "https://nginx.org";

export const DOC_SECTIONS: DocSection[] = [
  {
    title: "Getting Started",
    items: [
      {
        title: "Beginner's Guide",
        official: `${OFF}/en/docs/beginners_guide.html`,
        lessonSlug: "intro",
        note: "进程模型与最小配置",
      },
      {
        title: "Install & signals",
        official: `${OFF}/en/docs/beginners_guide.html`,
        lessonSlug: "install-run",
      },
      {
        title: "Configuration structure",
        official: `${OFF}/en/docs/beginners_guide.html`,
        lessonSlug: "config-structure",
      },
    ],
  },
  {
    title: "HTTP Core",
    items: [
      {
        title: "Server names",
        official: `${OFF}/en/docs/http/server_names.html`,
        lessonSlug: "server-block",
      },
      {
        title: "location",
        official: `${OFF}/en/docs/http/ngx_http_core_module.html#location`,
        lessonSlug: "location",
      },
      {
        title: "root / alias / try_files",
        official: `${OFF}/en/docs/http/ngx_http_core_module.html#root`,
        lessonSlug: "static-files",
      },
      {
        title: "Variables & logging",
        official: `${OFF}/en/docs/http/ngx_http_log_module.html`,
        lessonSlug: "variables",
      },
    ],
  },
  {
    title: "Rewrite & Headers",
    items: [
      {
        title: "Rewrite module",
        official: `${OFF}/en/docs/http/ngx_http_rewrite_module.html`,
        lessonSlug: "rewrite",
      },
      {
        title: "if pitfalls",
        official: `${OFF}/en/docs/http/ngx_http_rewrite_module.html#if`,
        lessonSlug: "if-pitfalls",
      },
      {
        title: "Headers module",
        official: `${OFF}/en/docs/http/ngx_http_headers_module.html`,
        lessonSlug: "headers",
      },
      {
        title: "Gzip",
        official: `${OFF}/en/docs/http/ngx_http_gzip_module.html`,
        lessonSlug: "gzip-cache",
      },
      {
        title: "limit_req",
        official: `${OFF}/en/docs/http/ngx_http_limit_req_module.html`,
        lessonSlug: "rate-limit",
      },
    ],
  },
  {
    title: "Proxy & Load Balancing",
    items: [
      {
        title: "proxy_pass",
        official: `${OFF}/en/docs/http/ngx_http_proxy_module.html`,
        lessonSlug: "proxy-basics",
      },
      {
        title: "upstream",
        official: `${OFF}/en/docs/http/ngx_http_upstream_module.html`,
        lessonSlug: "upstream",
      },
      {
        title: "WebSocket",
        official: `${OFF}/en/docs/http/websocket.html`,
        lessonSlug: "websocket",
      },
      {
        title: "gRPC",
        official: `${OFF}/en/docs/http/ngx_http_grpc_module.html`,
        lessonSlug: "grpc-proxy",
      },
      {
        title: "proxy_cache",
        official: `${OFF}/en/docs/http/ngx_http_proxy_module.html#proxy_cache`,
        lessonSlug: "cache-proxy",
      },
    ],
  },
  {
    title: "TLS",
    items: [
      {
        title: "Configuring HTTPS servers",
        official: `${OFF}/en/docs/http/configuring_https_servers.html`,
        lessonSlug: "ssl-tls",
      },
    ],
  },
  {
    title: "FastCGI / PHP",
    items: [
      {
        title: "FastCGI module",
        official: `${OFF}/en/docs/http/ngx_http_fastcgi_module.html`,
        lessonSlug: "php-fpm",
      },
    ],
  },
  {
    title: "Practice paths (本站)",
    items: [
      {
        title: "SPA deploy",
        official: `${OFF}/en/docs/http/ngx_http_core_module.html#try_files`,
        lessonSlug: "spa-deploy",
      },
      {
        title: "Access control",
        official: `${OFF}/en/docs/http/ngx_http_access_module.html`,
        lessonSlug: "auth-basic",
      },
      {
        title: "Performance knobs",
        official: `${OFF}/en/docs/ngx_core_module.html#worker_processes`,
        lessonSlug: "performance",
      },
      {
        title: "Security hardening",
        official: `${OFF}/en/docs/http/ngx_http_core_module.html#server_tokens`,
        lessonSlug: "security-hardening",
      },
    ],
  },
];

export function getDocsCoverage() {
  const items = DOC_SECTIONS.flatMap((s) => s.items);
  const total = items.length;
  const linked = items.filter((i) => i.lessonSlug).length;
  return {
    total,
    linked,
    percent: total ? Math.round((linked / total) * 100) : 0,
  };
}
