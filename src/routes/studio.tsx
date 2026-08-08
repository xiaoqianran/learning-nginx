import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Flag, Server, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/studio")({
  component: StudioPage,
});

type Quest = {
  id: string;
  title: string;
  goal: string;
  hint: string;
  /** all regexes must match the config */
  must: RegExp[];
  /** any match fails */
  mustNot?: RegExp[];
};

const QUESTS: Quest[] = [
  {
    id: "static-root",
    title: "静态站点",
    goal: "写一个 listen 80 的 server，root 指向 /var/www/html，并有 location /",
    hint: "server { listen 80; root /var/www/html; location / { ... } }",
    must: [/listen\s+80/, /root\s+\/var\/www\/html/, /location\s+\//],
  },
  {
    id: "try-files-spa",
    title: "SPA try_files",
    goal: "location / 使用 try_files 回退到 /index.html",
    hint: "try_files $uri $uri/ /index.html;",
    must: [/try_files\s+\$uri\s+\$uri\/\s+\/index\.html\s*;/],
  },
  {
    id: "proxy-api",
    title: "反代 /api",
    goal: "location /api/ 使用 proxy_pass，并设置 Host 头",
    hint: "proxy_pass http://...; proxy_set_header Host $host;",
    must: [/location\s+\/api\//, /proxy_pass\s+http/, /proxy_set_header\s+Host\s+\$host/],
  },
  {
    id: "upstream-lb",
    title: "upstream 池",
    goal: "定义 upstream 至少两个 server，并 proxy_pass 到该 upstream",
    hint: "upstream backend { server a; server b; }",
    must: [/upstream\s+\w+\s*\{[\s\S]*server[\s\S]*server/, /proxy_pass\s+http:\/\/\w+/],
  },
  {
    id: "https-redirect",
    title: "强制 HTTPS",
    goal: "80 端口 return 301 到 https，443 配置 ssl_certificate",
    hint: "return 301 https://$host$request_uri;",
    must: [/listen\s+80/, /return\s+301\s+https/, /listen\s+443/, /ssl_certificate\b/],
  },
  {
    id: "rate-limit",
    title: "登录限流",
    goal: "limit_req_zone + location /login 使用 limit_req",
    hint: "limit_req_zone ... rate=...; limit_req zone=...",
    must: [/limit_req_zone/, /location\s+\/login/, /limit_req\s+zone=/],
  },
];

const STORAGE_KEY = "nginx-learn-studio-quests";

function loadDone(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveDone(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

function StudioPage() {
  const [active, setActive] = useState(QUESTS[0]!.id);
  const quest = QUESTS.find((q) => q.id === active) ?? QUESTS[0]!;
  const [code, setCode] = useState(
    `# 任务：${quest.title}\n# ${quest.goal}\n\n`,
  );
  const [done, setDone] = useState<string[]>(() => loadDone());
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState<boolean | null>(null);

  const progress = useMemo(() => {
    const d = done.filter((id) => QUESTS.some((q) => q.id === id)).length;
    return { d, t: QUESTS.length, pct: Math.round((d / QUESTS.length) * 100) };
  }, [done]);

  function switchQuest(id: string) {
    const q = QUESTS.find((x) => x.id === id)!;
    setActive(id);
    setCode(`# 任务：${q.title}\n# ${q.goal}\n\n`);
    setMsg(null);
    setOk(null);
  }

  function check() {
    const missing = quest.must.filter((re) => !re.test(code));
    const banned = (quest.mustNot ?? []).filter((re) => re.test(code));
    if (missing.length || banned.length) {
      setOk(false);
      setMsg(
        missing.length
          ? `未满足 ${missing.length} 条规则。提示：${quest.hint}`
          : "配置包含不允许的内容",
      );
      return;
    }
    setOk(true);
    setMsg("通过！已记入工坊进度。");
    setDone((prev) => {
      if (prev.includes(quest.id)) return prev;
      const next = [...prev, quest.id];
      saveDone(next);
      return next;
    });
  }

  function resetAll() {
    setDone([]);
    saveDone([]);
    setMsg(null);
    setOk(null);
  }

  return (
    <div className="mx-auto max-w-4xl pb-16">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <Server className="h-3.5 w-3.5" />
          配置工坊
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">
          Nginx 闯关
        </h1>
        <p className="mt-2 text-sm text-muted">
          按任务写出配置片段并通过规则校验。进度保存在本机。需要自由练习可去{" "}
          <Link to="/playground" className="text-primary no-underline hover:underline">
            配置沙箱
          </Link>
          。
        </p>
      </header>

      <div className="mb-5 rounded-xl border border-primary/30 bg-primary-soft p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-primary">
              闯关进度
            </p>
            <p className="font-display text-lg font-semibold text-fg">
              {progress.d}/{progress.t} · {progress.pct}%
            </p>
          </div>
          <div className="h-2 w-40 overflow-hidden rounded-full bg-bg/50">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${progress.pct}%` }}
            />
          </div>
          <Button variant="secondary" size="sm" onClick={resetAll}>
            <RotateCcw className="h-3.5 w-3.5" />
            重置进度
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
        <ul className="space-y-1">
          {QUESTS.map((q, i) => {
            const isDone = done.includes(q.id);
            return (
              <li key={q.id}>
                <button
                  type="button"
                  onClick={() => switchQuest(q.id)}
                  className={cn(
                    "flex w-full items-start gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                    active === q.id
                      ? "border-primary/40 bg-primary-soft text-fg"
                      : "border-border bg-surface text-muted hover:text-fg",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px]",
                      isDone ? "bg-primary text-primary-fg" : "bg-surface-3",
                    )}
                  >
                    {isDone ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  <span>
                    <span className="block font-medium text-fg">{q.title}</span>
                    <span className="block text-[11px] text-subtle line-clamp-2">
                      {q.goal}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div>
          <div className="mb-3 rounded-xl border border-border bg-surface p-4">
            <p className="inline-flex items-center gap-1.5 text-xs text-primary">
              <Flag className="h-3.5 w-3.5" />
              当前任务
            </p>
            <h2 className="mt-1 font-display text-lg font-semibold text-fg">
              {quest.title}
            </h2>
            <p className="mt-1 text-sm text-muted">{quest.goal}</p>
            <p className="mt-2 font-mono text-[11px] text-subtle">{quest.hint}</p>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="min-h-[18rem] w-full rounded-xl border border-border bg-code-bg p-4 font-mono text-[13px] leading-relaxed text-code-fg outline-none focus:border-primary/40"
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button onClick={check}>提交校验</Button>
            {msg ? (
              <span
                className={cn(
                  "text-sm",
                  ok ? "text-primary" : "text-warn",
                )}
              >
                {msg}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
