import { createFileRoute } from "@tanstack/react-router";
import { BookMarked } from "lucide-react";

export const Route = createFileRoute("/cheatsheet")({
  component: CheatsheetPage,
});

const SECTIONS: { title: string; items: { k: string; v: string }[] }[] = [
  {
    title: "进程与运维",
    items: [
      { k: "nginx -t", v: "测试配置语法与语义" },
      { k: "nginx -s reload", v: "热加载配置" },
      { k: "nginx -s quit", v: "优雅退出" },
      { k: "worker_processes", v: "auto 或 CPU 核数" },
      { k: "worker_connections", v: "单 worker 最大连接" },
    ],
  },
  {
    title: "上下文",
    items: [
      { k: "main", v: "进程级指令" },
      { k: "events", v: "连接处理" },
      { k: "http", v: "HTTP 全局 / upstream / map" },
      { k: "server", v: "虚拟主机" },
      { k: "location", v: "路径匹配与处理" },
    ],
  },
  {
    title: "location 匹配",
    items: [
      { k: "= /path", v: "精确匹配，最高优先" },
      { k: "^~ /prefix", v: "前缀命中后不再走正则" },
      { k: "~ / ~*", v: "正则（区分/不区分大小写），按出现顺序" },
      { k: "/prefix", v: "普通前缀，最长者胜" },
    ],
  },
  {
    title: "静态文件",
    items: [
      { k: "root", v: "文件 = root + URI" },
      { k: "alias", v: "替换 location 前缀路径" },
      { k: "try_files", v: "依次尝试，常用于 SPA" },
      { k: "index", v: "目录默认页" },
      { k: "expires", v: "浏览器缓存过期" },
    ],
  },
  {
    title: "反向代理",
    items: [
      { k: "proxy_pass", v: "注意末尾 / 是否改写 URI" },
      { k: "proxy_set_header Host", v: "传给上游的主机名" },
      { k: "X-Forwarded-*", v: "真实 IP / Proto 链" },
      { k: "upstream", v: "后端池 + 负载策略" },
      { k: "keepalive", v: "上游长连接复用" },
    ],
  },
  {
    title: "TLS / 安全",
    items: [
      { k: "ssl_certificate(_key)", v: "证书与私钥" },
      { k: "ssl_protocols", v: "建议 TLSv1.2+1.3" },
      { k: "HSTS", v: "Strict-Transport-Security" },
      { k: "server_tokens off", v: "隐藏版本号" },
      { k: "client_max_body_size", v: "限制上传大小" },
      { k: "limit_req", v: "请求速率限制" },
    ],
  },
  {
    title: "变量速记",
    items: [
      { k: "$host", v: "请求 Host（无端口）" },
      { k: "$request_uri", v: "原 URI 含 query" },
      { k: "$uri", v: "当前 URI（可被 rewrite 改）" },
      { k: "$remote_addr", v: "直连客户端 IP" },
      { k: "$scheme", v: "http / https" },
      { k: "$status", v: "响应状态码" },
    ],
  },
];

function CheatsheetPage() {
  return (
    <div className="mx-auto max-w-3xl pb-16">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <BookMarked className="h-3.5 w-3.5" />
          速查
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">
          Nginx 速查表
        </h1>
        <p className="mt-1 text-sm text-muted">写配置时扫一眼 · 细节回课程或官网</p>
      </header>

      <div className="grid gap-4">
        {SECTIONS.map((sec) => (
          <section
            key={sec.title}
            className="overflow-hidden rounded-xl border border-border bg-surface"
          >
            <h2 className="border-b border-border bg-surface-2 px-4 py-2.5 font-display text-sm font-semibold text-fg">
              {sec.title}
            </h2>
            <ul className="divide-y divide-border">
              {sec.items.map((it) => (
                <li
                  key={it.k}
                  className="flex flex-col gap-0.5 px-4 py-2.5 sm:flex-row sm:items-baseline sm:gap-4"
                >
                  <code className="shrink-0 font-mono text-xs text-primary sm:w-48">
                    {it.k}
                  </code>
                  <span className="text-sm text-muted">{it.v}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
