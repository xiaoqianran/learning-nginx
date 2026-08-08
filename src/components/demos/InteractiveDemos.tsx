import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import type { DemoKind } from "@/data/lessons";
import { DEMO_SOURCES } from "@/data/demo-sources";
import { cn } from "@/lib/utils";
import { Activity, ArrowRight, Server, Shield, Zap } from "lucide-react";

export function InteractiveDemo({
  kind,
  title,
  hint,
}: {
  kind: DemoKind;
  title: string;
  hint?: string;
}) {
  const src = DEMO_SOURCES[kind];
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-primary">
            交互 Demo
          </p>
          <h3 className="font-display text-base font-semibold text-fg">{title}</h3>
          {hint ? <p className="mt-0.5 text-xs text-muted">{hint}</p> : null}
        </div>
        {src ? (
          <span className="rounded-full bg-surface-3 px-2 py-0.5 font-mono text-[10px] text-subtle">
            对照配置
          </span>
        ) : null}
      </div>
      <div className="p-4">{renderDemo(kind)}</div>
      {src ? (
        <details className="border-t border-border bg-code-bg/40">
          <summary className="cursor-pointer px-4 py-2 text-xs text-muted hover:text-fg">
            查看对照配置片段
          </summary>
          <pre className="overflow-x-auto px-4 pb-4 font-mono text-[12px] leading-relaxed text-code-fg">
            {src.code}
          </pre>
        </details>
      ) : null}
    </section>
  );
}

function renderDemo(kind: DemoKind) {
  switch (kind) {
    case "request-flow":
      return <RequestFlowDemo />;
    case "signal-panel":
      return <SignalPanelDemo />;
    case "context-tree":
      return <ContextTreeDemo />;
    case "vhost-match":
      return <VhostMatchDemo />;
    case "location-match":
      return <LocationMatchDemo />;
    case "root-alias":
      return <RootAliasDemo />;
    case "log-line":
      return <LogLineDemo />;
    case "rewrite-lab":
      return <RewriteLabDemo />;
    case "headers-view":
      return <HeadersViewDemo />;
    case "cache-policy":
      return <CachePolicyDemo />;
    case "rate-limit":
      return <RateLimitDemo />;
    case "proxy-headers":
      return <ProxyHeadersDemo />;
    case "lb-visual":
      return <LbVisualDemo />;
    case "websocket-upgrade":
      return <WebsocketDemo />;
    case "tls-checklist":
      return <TlsChecklistDemo />;
    case "spa-layout":
      return <SpaLayoutDemo />;
    case "acl-lab":
      return <AclLabDemo />;
    case "canary":
      return <CanaryDemo />;
    case "status-panel":
      return <StatusPanelDemo />;
    case "perf-knobs":
      return <PerfKnobsDemo />;
    case "security-score":
      return <SecurityScoreDemo />;
    case "cache-status":
      return <CacheStatusDemo />;
    case "interview-cards":
      return <InterviewCardsDemo />;
    default:
      return <p className="text-sm text-muted">Demo 加载中…</p>;
  }
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border px-2.5 py-1.5 text-xs transition-colors",
        active
          ? "border-primary bg-primary-soft text-primary"
          : "border-border bg-surface-2 text-muted hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

function RequestFlowDemo() {
  const [step, setStep] = useState(0);
  const steps = [
    { t: "Client", d: "浏览器发起 GET /api/hello" },
    { t: "Nginx listen", d: "worker 接受连接，解析 Host / URI" },
    { t: "server 匹配", d: "按 server_name 选虚拟主机" },
    { t: "location", d: "按规则命中 /api/" },
    { t: "upstream", d: "proxy_pass 转发并回写响应" },
  ];
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.t} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep(i)}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-xs transition-colors",
                i === step
                  ? "border-primary bg-primary-soft text-fg"
                  : i < step
                    ? "border-primary/30 bg-surface-2 text-muted"
                    : "border-border bg-bg text-subtle",
              )}
            >
              <span className="font-mono text-[10px] text-primary">{i + 1}</span>
              <span className="mt-0.5 block font-medium">{s.t}</span>
            </button>
            {i < steps.length - 1 ? (
              <ArrowRight className="hidden h-3.5 w-3.5 text-subtle sm:block" />
            ) : null}
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted">{steps[step]?.d}</p>
      <button
        type="button"
        className="mt-3 text-xs text-primary hover:underline"
        onClick={() => setStep((s) => (s + 1) % steps.length)}
      >
        下一步 →
      </button>
    </div>
  );
}

function SignalPanelDemo() {
  const [log, setLog] = useState<string[]>(["ready"]);
  function run(cmd: string) {
    const lines: Record<string, string> = {
      "nginx -t": "nginx: configuration file syntax is ok\nnginx: configuration file test is successful",
      reload: "signal: reconfigure (reload) — workers gracefully replaced",
      quit: "signal: quit — graceful shutdown",
      stop: "signal: stop — fast shutdown",
    };
    setLog((l) => [`$ ${cmd}`, lines[cmd] ?? "ok", ...l].slice(0, 8));
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="flex flex-wrap gap-2">
        {["nginx -t", "reload", "quit", "stop"].map((c) => (
          <Chip key={c} onClick={() => run(c)}>
            {c}
          </Chip>
        ))}
      </div>
      <pre className="min-h-[7rem] overflow-auto rounded-lg border border-border bg-code-bg p-3 font-mono text-[11px] text-code-fg">
        {log.join("\n")}
      </pre>
    </div>
  );
}

function ContextTreeDemo() {
  const [sel, setSel] = useState("http");
  const info: Record<string, string> = {
    main: "进程级：worker_processes、user、error_log（全局）",
    events: "连接：worker_connections、multi_accept",
    http: "HTTP 全局：gzip、log_format、upstream、map",
    server: "虚拟主机：listen、server_name、ssl_*",
    location: "路径：root、proxy_pass、rewrite、limit_req",
  };
  return (
    <div className="flex flex-wrap gap-2">
      {Object.keys(info).map((k) => (
        <Chip key={k} active={sel === k} onClick={() => setSel(k)}>
          {k}
        </Chip>
      ))}
      <p className="mt-2 w-full text-sm text-muted">{info[sel]}</p>
    </div>
  );
}

function VhostMatchDemo() {
  const [host, setHost] = useState("blog.example.com");
  const result = useMemo(() => {
    if (host === "blog.example.com") return "server blog → /var/www/blog";
    if (host === "api.example.com") return "server api → proxy 127.0.0.1:3000";
    return "default_server → return 444（拒绝未知 Host）";
  }, [host]);
  return (
    <div>
      <p className="mb-2 text-xs text-muted">选择请求 Host</p>
      <div className="flex flex-wrap gap-2">
        {["blog.example.com", "api.example.com", "evil.test"].map((h) => (
          <Chip key={h} active={host === h} onClick={() => setHost(h)}>
            {h}
          </Chip>
        ))}
      </div>
      <p className="mt-3 rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-primary">
        {result}
      </p>
    </div>
  );
}

function LocationMatchDemo() {
  const [uri, setUri] = useState("/static/app.js");
  const rules = [
    { pat: "= /exact", test: (u: string) => u === "/exact" },
    { pat: "^~ /static/", test: (u: string) => u.startsWith("/static/") },
    { pat: "~* \\.(js|css)$", test: (u: string) => /\.(js|css)$/i.test(u) },
    { pat: "/api/", test: (u: string) => u.startsWith("/api/") },
    { pat: "/", test: () => true },
  ];
  const hit = useMemo(() => {
    // simplified: exact → ^~ prefix → regex → longest prefix
    if (uri === "/exact") return "= /exact";
    if (uri.startsWith("/static/")) return "^~ /static/（前缀短路，跳过正则）";
    if (/\.(js|css)$/i.test(uri) && !uri.startsWith("/static/"))
      return "~* \\.(js|css)$";
    if (uri.startsWith("/api/")) return "/api/";
    return "/";
  }, [uri]);
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {["/exact", "/static/app.js", "/app.js", "/api/v1", "/about"].map((u) => (
          <Chip key={u} active={uri === u} onClick={() => setUri(u)}>
            {u}
          </Chip>
        ))}
      </div>
      <ul className="mt-3 space-y-1 text-xs text-muted">
        {rules.map((r) => (
          <li
            key={r.pat}
            className={cn(
              "rounded-md px-2 py-1 font-mono",
              hit.startsWith(r.pat.split("（")[0]!) && r.test(uri)
                ? "bg-primary-soft text-primary"
                : "bg-surface-2",
            )}
          >
            location {r.pat}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-fg">
        命中：<span className="font-mono text-primary">{hit}</span>
      </p>
    </div>
  );
}

function RootAliasDemo() {
  const [mode, setMode] = useState<"root" | "alias">("root");
  const path =
    mode === "root" ? "/data/img/a.png  ← root + URI" : "/data/pics/a.png  ← alias 替换前缀";
  return (
    <div>
      <div className="flex gap-2">
        <Chip active={mode === "root"} onClick={() => setMode("root")}>
          root /data
        </Chip>
        <Chip active={mode === "alias"} onClick={() => setMode("alias")}>
          alias /data/pics/
        </Chip>
      </div>
      <p className="mt-3 text-xs text-muted">URI = /img/a.png，location /img/</p>
      <p className="mt-2 rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-primary">
        {path}
      </p>
    </div>
  );
}

function LogLineDemo() {
  const [status, setStatus] = useState(200);
  const line = `203.0.113.10 - - [09/Aug/2026:04:00:00 +0000] "GET /index.html HTTP/1.1" ${status} 1234 "-" "Mozilla/5.0" rt=0.003`;
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {[200, 301, 404, 502].map((s) => (
          <Chip key={s} active={status === s} onClick={() => setStatus(s)}>
            status {s}
          </Chip>
        ))}
      </div>
      <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-code-bg p-3 font-mono text-[11px] text-code-fg">
        {line}
      </pre>
    </div>
  );
}

function RewriteLabDemo() {
  const [path, setPath] = useState("/old/docs");
  const out = useMemo(() => {
    if (path.startsWith("/old/")) return { code: 200, uri: path.replace(/^\/old\//, "/new/") };
    if (path === "/http-only") return { code: 301, uri: "https://example.com/http-only" };
    return { code: 200, uri: path };
  }, [path]);
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {["/old/docs", "/old/a/b", "/http-only", "/keep"].map((p) => (
          <Chip key={p} active={path === p} onClick={() => setPath(p)}>
            {p}
          </Chip>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted">
        结果：<span className="font-mono text-primary">{out.code}</span> →{" "}
        <span className="font-mono text-fg">{out.uri}</span>
      </p>
    </div>
  );
}

function HeadersViewDemo() {
  const headers = [
    "X-Content-Type-Options: nosniff",
    "X-Frame-Options: SAMEORIGIN",
    "Referrer-Policy: strict-origin-when-cross-origin",
    "Access-Control-Allow-Origin: *",
  ];
  return (
    <ul className="space-y-1.5 font-mono text-xs text-muted">
      {headers.map((h) => (
        <li key={h} className="rounded-md border border-border bg-bg px-2.5 py-1.5">
          {h}
        </li>
      ))}
    </ul>
  );
}

function CachePolicyDemo() {
  const rows = [
    { path: "/assets/app.abc123.js", policy: "30d immutable" },
    { path: "/index.html", policy: "no-cache" },
    { path: "/api/user", policy: "通常不缓存私有 API" },
  ];
  return (
    <table className="w-full text-left text-xs">
      <thead>
        <tr className="text-subtle">
          <th className="pb-2 font-medium">路径</th>
          <th className="pb-2 font-medium">建议</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.path} className="border-t border-border">
            <td className="py-2 font-mono text-fg">{r.path}</td>
            <td className="py-2 text-muted">{r.policy}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RateLimitDemo() {
  const [n, setN] = useState(0);
  const rate = 5;
  const allowed = n <= rate;
  return (
    <div>
      <p className="text-xs text-muted">模拟 rate=5r/s，连点请求</p>
      <button
        type="button"
        className="mt-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-fg"
        onClick={() => setN((x) => x + 1)}
      >
        发送请求 ({n})
      </button>
      <button
        type="button"
        className="ml-2 text-xs text-muted hover:text-fg"
        onClick={() => setN(0)}
      >
        重置
      </button>
      <p className={cn("mt-3 text-sm", allowed ? "text-primary" : "text-danger")}>
        {allowed ? "200 OK（令牌充足）" : "503 limit_req exceeded（可配 burst）"}
      </p>
    </div>
  );
}

function ProxyHeadersDemo() {
  const headers = [
    ["Host", "$host"],
    ["X-Real-IP", "$remote_addr"],
    ["X-Forwarded-For", "$proxy_add_x_forwarded_for"],
    ["X-Forwarded-Proto", "$scheme"],
  ];
  return (
    <div className="space-y-2">
      {headers.map(([k, v]) => (
        <div
          key={k}
          className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-bg px-3 py-2 text-xs"
        >
          <span className="font-mono text-fg">{k}</span>
          <span className="font-mono text-primary">{v}</span>
        </div>
      ))}
    </div>
  );
}

function LbVisualDemo() {
  const [counts, setCounts] = useState([0, 0, 0]);
  const weights = [3, 1, 1];
  function send() {
    // weighted random-ish by current lag
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    let idx = 0;
    for (let i = 0; i < weights.length; i++) {
      r -= weights[i]!;
      if (r <= 0) {
        idx = i;
        break;
      }
    }
    setCounts((c) => c.map((v, i) => (i === idx ? v + 1 : v)));
  }
  return (
    <div>
      <button
        type="button"
        onClick={send}
        className="rounded-md bg-primary px-3 py-2 text-sm text-primary-fg"
      >
        发 1 个请求
      </button>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {counts.map((c, i) => (
          <div key={i} className="rounded-lg border border-border bg-bg p-3 text-center">
            <Server className="mx-auto h-4 w-4 text-primary" />
            <p className="mt-1 font-mono text-xs text-muted">
              node-{i + 1} w={weights[i]}
            </p>
            <p className="font-display text-xl font-semibold text-fg">{c}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function WebsocketDemo() {
  const [up, setUp] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setUp((v) => !v)}
        className="rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
      >
        {up ? "断开" : "模拟 Upgrade"}
      </button>
      <pre className="mt-3 rounded-lg border border-border bg-code-bg p-3 font-mono text-[11px] text-code-fg">
        {up
          ? "HTTP/1.1 101 Switching Protocols\nUpgrade: websocket\nConnection: upgrade"
          : "GET /ws HTTP/1.1\nUpgrade: websocket\nConnection: Upgrade"}
      </pre>
    </div>
  );
}

function TlsChecklistDemo() {
  const [checks, setChecks] = useState({
    cert: true,
    http2: true,
    redirect: false,
    hsts: false,
  });
  const score = Object.values(checks).filter(Boolean).length;
  return (
    <div>
      <ul className="space-y-2">
        {(
          [
            ["cert", "证书 + 私钥路径正确"],
            ["http2", "listen 443 ssl http2"],
            ["redirect", "80 → 443 301"],
            ["hsts", "HSTS always"],
          ] as const
        ).map(([k, label]) => (
          <li key={k}>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-fg">
              <input
                type="checkbox"
                checked={checks[k]}
                onChange={(e) => setChecks((c) => ({ ...c, [k]: e.target.checked }))}
              />
              {label}
            </label>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-muted">
        清单完成 <span className="font-mono text-primary">{score}/4</span>
      </p>
    </div>
  );
}

function SpaLayoutDemo() {
  return (
    <div className="flex flex-col items-stretch gap-2 text-center text-xs sm:flex-row sm:items-center">
      <div className="rounded-lg border border-border bg-bg px-3 py-4">Browser</div>
      <ArrowRight className="mx-auto h-4 w-4 text-subtle" />
      <div className="rounded-lg border border-primary/40 bg-primary-soft px-3 py-4 text-primary">
        Nginx
        <div className="mt-2 grid gap-1 text-[10px] text-muted">
          <span>/ → try_files → index.html</span>
          <span>/api/ → proxy_pass</span>
        </div>
      </div>
      <ArrowRight className="mx-auto h-4 w-4 text-subtle" />
      <div className="rounded-lg border border-border bg-bg px-3 py-4">Node API :8080</div>
    </div>
  );
}

function AclLabDemo() {
  const [ip, setIp] = useState("10.1.2.3");
  const ok = ip.startsWith("10.");
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {["10.1.2.3", "192.168.1.8", "203.0.113.9"].map((x) => (
          <Chip key={x} active={ip === x} onClick={() => setIp(x)}>
            {x}
          </Chip>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">规则：allow 10.0.0.0/8; deny all;</p>
      <p className={cn("mt-2 text-sm font-medium", ok ? "text-primary" : "text-danger")}>
        {ok ? "允许" : "拒绝 403"}
      </p>
    </div>
  );
}

function CanaryDemo() {
  const [pct, setPct] = useState(10);
  const [stats, setStats] = useState({ new: 0, old: 0 });
  function fire() {
    const toNew = Math.random() * 100 < pct;
    setStats((s) => ({
      new: s.new + (toNew ? 1 : 0),
      old: s.old + (toNew ? 0 : 1),
    }));
  }
  return (
    <div>
      <label className="text-xs text-muted">
        灰度 {pct}%
        <input
          type="range"
          min={0}
          max={50}
          value={pct}
          onChange={(e) => setPct(Number(e.target.value))}
          className="mt-1 block w-full max-w-xs"
        />
      </label>
      <button
        type="button"
        onClick={fire}
        className="mt-2 rounded-md bg-primary px-3 py-2 text-sm text-primary-fg"
      >
        模拟请求
      </button>
      <p className="mt-2 font-mono text-xs text-muted">
        new={stats.new} · old={stats.old}
      </p>
    </div>
  );
}

function StatusPanelDemo() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {[
        ["Active", "12"],
        ["Accepts", "10482"],
        ["Handled", "10482"],
        ["Requests", "38901"],
      ].map(([k, v]) => (
        <div key={k} className="rounded-lg border border-border bg-bg p-3">
          <p className="text-[10px] uppercase tracking-wider text-subtle">{k}</p>
          <p className="font-mono text-lg text-fg">{v}</p>
        </div>
      ))}
      <p className="col-span-full text-xs text-muted">
        <Activity className="mr-1 inline h-3.5 w-3.5" />
        stub_status 输出的核心计数
      </p>
    </div>
  );
}

function PerfKnobsDemo() {
  const [workers, setWorkers] = useState(4);
  const [conn, setConn] = useState(1024);
  return (
    <div className="space-y-3">
      <label className="block text-xs text-muted">
        worker_processes: {workers}
        <input
          type="range"
          min={1}
          max={16}
          value={workers}
          onChange={(e) => setWorkers(Number(e.target.value))}
          className="mt-1 block w-full max-w-xs"
        />
      </label>
      <label className="block text-xs text-muted">
        worker_connections: {conn}
        <input
          type="range"
          min={512}
          max={8192}
          step={512}
          value={conn}
          onChange={(e) => setConn(Number(e.target.value))}
          className="mt-1 block w-full max-w-xs"
        />
      </label>
      <p className="flex items-center gap-1.5 text-sm text-fg">
        <Zap className="h-4 w-4 text-primary" />
        理论并发量级 ≈ {workers} × {conn} ={" "}
        <span className="font-mono text-primary">{workers * conn}</span>
        （实际还受 fd、后端、带宽限制）
      </p>
    </div>
  );
}

function SecurityScoreDemo() {
  const [items, setItems] = useState({
    tokens: true,
    body: true,
    methods: false,
    hidden: true,
  });
  const score = Object.values(items).filter(Boolean).length * 25;
  return (
    <div>
      <ul className="space-y-2 text-sm">
        {(
          [
            ["tokens", "server_tokens off"],
            ["body", "client_max_body_size 限制"],
            ["methods", "限制非常用 HTTP 方法"],
            ["hidden", "拒绝 /.git 等隐藏路径"],
          ] as const
        ).map(([k, label]) => (
          <li key={k}>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={items[k]}
                onChange={(e) => setItems((s) => ({ ...s, [k]: e.target.checked }))}
              />
              {label}
            </label>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex items-center gap-2 text-sm">
        <Shield className="h-4 w-4 text-primary" />
        加固分 <span className="font-mono text-primary">{score}</span>/100
      </p>
    </div>
  );
}

function CacheStatusDemo() {
  const [st, setSt] = useState("MISS");
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {["MISS", "HIT", "EXPIRED", "BYPASS", "UPDATING"].map((s) => (
          <Chip key={s} active={st === s} onClick={() => setSt(s)}>
            {s}
          </Chip>
        ))}
      </div>
      <p className="mt-3 font-mono text-sm text-fg">
        X-Cache-Status: <span className="text-primary">{st}</span>
      </p>
    </div>
  );
}

function InterviewCardsDemo() {
  const cards = [
    "master 与 worker 各自职责？",
    "location 匹配完整顺序？",
    "proxy_pass 末尾斜杠差异？",
    "如何拿到真实客户端 IP？",
    "reload 与 restart 区别？",
  ];
  const [i, setI] = useState(0);
  return (
    <div className="rounded-lg border border-border bg-bg p-4">
      <p className="text-xs text-subtle">
        题 {i + 1}/{cards.length}
      </p>
      <p className="mt-2 font-display text-base font-semibold text-fg">{cards[i]}</p>
      <button
        type="button"
        className="mt-4 text-sm text-primary hover:underline"
        onClick={() => setI((x) => (x + 1) % cards.length)}
      >
        下一题
      </button>
    </div>
  );
}
