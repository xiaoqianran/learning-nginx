import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Code2, CheckCircle2, AlertTriangle, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/playground")({
  component: PlaygroundPage,
});

const PRESETS: { id: string; title: string; summary: string; code: string }[] = [
  {
    id: "static",
    title: "静态站",
    summary: "最小 server + root",
    code: `worker_processes auto;

events {
  worker_connections 1024;
}

http {
  include       mime.types;
  default_type  application/octet-stream;
  sendfile      on;

  server {
    listen 80;
    server_name example.com;
    root /var/www/html;
    index index.html;

    location / {
      try_files $uri $uri/ =404;
    }
  }
}
`,
  },
  {
    id: "proxy",
    title: "反向代理",
    summary: "proxy_pass + 转发头",
    code: `http {
  upstream app {
    server 127.0.0.1:3000;
    keepalive 16;
  }

  server {
    listen 80;
    server_name api.example.com;

    location / {
      proxy_pass http://app;
      proxy_http_version 1.1;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header Connection "";
    }
  }
}
`,
  },
  {
    id: "spa",
    title: "SPA + API",
    summary: "try_files 与 /api 分流",
    code: `server {
  listen 80;
  server_name app.example.com;
  root /var/www/app/dist;
  index index.html;

  location /api/ {
    proxy_pass http://127.0.0.1:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }

  location / {
    try_files $uri $uri/ /index.html;
  }
}
`,
  },
  {
    id: "tls",
    title: "HTTPS",
    summary: "证书 + 跳转",
    code: `server {
  listen 80;
  server_name example.com;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;
  server_name example.com;

  ssl_certificate     /etc/nginx/certs/fullchain.pem;
  ssl_certificate_key /etc/nginx/certs/privkey.pem;
  ssl_protocols       TLSv1.2 TLSv1.3;

  add_header Strict-Transport-Security "max-age=31536000" always;

  location / {
    root /var/www/html;
  }
}
`,
  },
  {
    id: "limit",
    title: "限流",
    summary: "limit_req_zone",
    code: `http {
  limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;

  server {
    listen 80;
    location /login {
      limit_req zone=one burst=20 nodelay;
      proxy_pass http://127.0.0.1:3000;
    }
  }
}
`,
  },
];

type CheckResult = {
  ok: boolean;
  messages: string[];
};

function lintNginx(code: string): CheckResult {
  const messages: string[] = [];
  const open = (code.match(/\{/g) || []).length;
  const close = (code.match(/\}/g) || []).length;
  if (open !== close) {
    messages.push(`花括号不匹配：{ ${open} vs } ${close}`);
  }

  const lines = code.split("\n");
  lines.forEach((line, i) => {
    const t = line.trim();
    if (!t || t.startsWith("#") || t.endsWith("{") || t === "}" || t.endsWith("}")) return;
    // directives should end with ; (rough)
    if (!t.endsWith(";") && !t.endsWith("{")) {
      // allow map/split blocks lines with only }
      if (!/^(server|location|http|events|upstream|map|if)\b/.test(t)) {
        messages.push(`L${i + 1}: 指令似乎缺少分号 → ${t.slice(0, 48)}`);
      }
    }
  });

  if (/proxy_pass\s+http/.test(code) && !/proxy_set_header\s+Host/.test(code)) {
    messages.push("提示：反代时建议设置 proxy_set_header Host $host;");
  }
  if (/listen\s+443/.test(code) && !/ssl_certificate\b/.test(code)) {
    messages.push("提示：listen 443 通常需要 ssl_certificate / ssl_certificate_key");
  }
  if (/location\s+\/\s*\{/.test(code) && /try_files/.test(code) === false && /root\b/.test(code)) {
    messages.push("提示：静态站 location / 常配合 try_files 或 index");
  }

  // cap messages
  const uniq = [...new Set(messages)].slice(0, 12);
  const hardErrors = uniq.filter((m) => m.includes("不匹配") || m.includes("缺少分号"));
  return {
    ok: hardErrors.length === 0,
    messages: uniq.length
      ? uniq
      : ["语法检查通过（浏览器端启发式校验，非完整 nginx -t）"],
  };
}

function PlaygroundPage() {
  const [activeId, setActiveId] = useState("static");
  const preset = useMemo(
    () => PRESETS.find((p) => p.id === activeId) ?? PRESETS[0]!,
    [activeId],
  );
  const [code, setCode] = useState(preset.code);
  const [result, setResult] = useState<CheckResult | null>(null);

  function loadPreset(id: string) {
    const p = PRESETS.find((x) => x.id === id)!;
    setActiveId(id);
    setCode(p.code);
    setResult(null);
  }

  return (
    <div className="mx-auto max-w-5xl pb-16">
      <header className="mb-5">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <Code2 className="h-3.5 w-3.5" />
          配置沙箱
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          nginx.conf 编辑器
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          在浏览器里编辑配置片段，运行启发式语法检查（括号、分号、常见最佳实践提示）。上线前请在真实环境执行{" "}
          <code className="rounded-sm bg-surface-3 px-1.5 py-0.5 font-mono text-xs text-primary">
            nginx -t
          </code>
          。
        </p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => loadPreset(p.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150",
              activeId === p.id
                ? "bg-primary text-primary-fg"
                : "bg-surface-3 text-muted hover:text-fg",
            )}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm">
          <span className="font-medium text-fg">{preset.title}</span>
          <span className="text-muted"> · {preset.summary}</span>
        </div>
        <Button
          size="sm"
          onClick={() => setResult(lintNginx(code))}
          className="gap-1.5"
        >
          <Play className="h-3.5 w-3.5" />
          检查配置
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-code-bg shadow-soft">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <span className="flex gap-1" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-red/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green/80" />
          </span>
          <span className="font-mono text-[11px] text-subtle">nginx.conf</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="min-h-[22rem] w-full resize-y bg-transparent p-4 font-mono text-[13px] leading-relaxed text-code-fg outline-none"
        />
      </div>

      {result ? (
        <div
          className={cn(
            "mt-4 rounded-xl border p-4",
            result.ok
              ? "border-primary/30 bg-primary-soft"
              : "border-warn/40 bg-warn/10",
          )}
        >
          <p className="inline-flex items-center gap-1.5 text-sm font-medium text-fg">
            {result.ok ? (
              <CheckCircle2 className="h-4 w-4 text-primary" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-warn" />
            )}
            {result.ok ? "检查通过" : "发现问题"}
          </p>
          <ul className="mt-2 space-y-1 text-xs text-muted">
            {result.messages.map((m) => (
              <li key={m} className="font-mono">
                {m}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <aside className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { t: "改配置", d: "左侧是可编辑文本，预设覆盖静态、反代、SPA、TLS、限流。" },
          { t: "跑检查", d: "启发式校验括号/分号与常见反代、证书提示，不是完整 nginx -t。" },
          { t: "去工坊", d: "在「配置工坊」按任务约束写出能过关的配置片段。" },
        ].map((item) => (
          <div
            key={item.t}
            className="rounded-lg border border-border bg-surface-2 px-3.5 py-3"
          >
            <p className="text-sm font-medium text-fg">{item.t}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{item.d}</p>
          </div>
        ))}
      </aside>
    </div>
  );
}
