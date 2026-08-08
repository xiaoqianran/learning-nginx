# Nginx 实战学习

交互式中文 Nginx 教程：课程 + 测验 + 进度 + 配置沙箱 + 配置工坊。

**在线访问：** [https://xiaoqianran.github.io/learning-nginx/](https://xiaoqianran.github.io/learning-nginx/)  
**仓库：** [https://github.com/xiaoqianran/learning-nginx](https://github.com/xiaoqianran/learning-nginx)

参考姊妹项目：[learning-vue3](https://github.com/xiaoqianran/learning-vue3)

---

## 这是什么

面向想系统学习 **Nginx**（Web 服务 / 反向代理 / 网关）的同学。内容以「读一点、动手一点、测一点」组织。

你可以：

- 按路径学完 **31 节** 课程（讲解 + 配置片段 + 交互 Demo + 小测验）
- 在 **配置沙箱** 里编辑 `nginx.conf` 并做启发式检查
- 在 **配置工坊** 里完成 6 个闯关任务
- 用 **速查表** 复习，用 **学习中心 / 错题本 / 结业证明** 跟进度

## 学习路径

| 路径 | 内容 |
|------|------|
| ① 基础 | 安装、配置结构、server、location、静态站、变量日志 |
| ② 进阶 | rewrite、if 坑、响应头、gzip/缓存、限流 |
| ③ 反代 | proxy_pass、upstream、WebSocket、gRPC、TLS |
| ④ 实战 | SPA、PHP-FPM、ACL、灰度、Docker |
| ⑤ 工程化 | include、监控、性能、安全、CI |
| ⑥ 深造 | 代理缓存、HTTP/3、WAF 思维、面试串讲 |

## 本地运行

```bash
git clone https://github.com/xiaoqianran/learning-nginx.git
cd learning-nginx
npm install
npm run dev
```

GitHub Pages 构建：

```bash
npm run build:pages
```

## 技术栈

React 19 · TanStack Start · Tailwind v4 · Catppuccin 主题 · Zustand 进度持久化
