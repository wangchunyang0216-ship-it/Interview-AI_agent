# AI Agent 对话界面

一个从零搭建的 AI Agent Web 对话界面，还原主流 AI 产品的典型布局：**左侧会话列表 + 右侧对话区 + 底部输入区**。纯前端实现，AI 回复、历史会话、流式输出均使用 mock 数据模拟。

## 启动方式

```bash
npm install
npm run dev
```

生产构建与预览：

```bash
npm run build
npm run preview
```

> 环境要求：Node.js ≥ 18（本机验证版本 20.10.0）

## 技术选型

| 类别 | 选型 | 说明 |
| ---- | ---- | ---- |
| 构建工具 | Vite 5 | 极速冷启动与 HMR |
| 框架 | React 18 + TypeScript | 函数组件 + Hooks + 严格类型 |
| Markdown | react-markdown + remark-gfm | 加粗 / 列表 / 代码块 / 表格等 |
| 图标 | lucide-react | 轻量矢量图标 |
| 样式 | CSS Modules | 组件级作用域，无 UI 框架依赖 |
| 状态管理 | React Hooks（useState/useCallback/useRef） | 无需引入额外状态库 |

## 目录结构

```
ai-agent-chat/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── src/
    ├── main.tsx                  # 入口
    ├── App.tsx                   # 三栏布局与整体编排
    ├── index.css                 # 全局样式与设计变量、Markdown 样式
    ├── App.module.css
    ├── types/
    │   └── index.ts              # ChatMessage / ChatSession 数据结构
    ├── data/
    │   └── mock.ts               # 预设回复、关键词匹配、流式生成、历史会话
    ├── hooks/
    │   ├── useChat.ts            # 会话状态 + 流式输出 + 停止/重试
    │   └── useAutoScroll.ts      # 自动滚动（上滚不打断）
    └── components/
        ├── Sidebar/              # 会话列表（新建/切换/删除）
        ├── ChatArea/             # 消息列表容器
        ├── Message/              # 消息气泡、Markdown 渲染、代码块复制
        ├── EmptyState/           # 问候语 + 快捷提问卡片
        └── InputArea/            # 输入框（Enter 发送 / Shift+Enter 换行 / 停止）
```

## 数据结构

```ts
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  status: 'pending' | 'streaming' | 'done' | 'error';
  createdAt: number;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}
```

## Mock 数据说明

- **关键词匹配回复**：内置 5 条预设回复（React / Vue / 性能 / 部署 / TypeScript），按用户输入关键词匹配；匹配不到时返回默认回复。
- **流式输出**：`streamReply(input)` 返回 `AsyncIterable<string>`，以「每 40ms 追加 3 个字符（含 ±15ms 抖动）」模拟 SSE 打字机效果，输出前预留约 300ms 的「思考中」延迟。
- **历史会话**：页面加载预置 2 个历史会话（各 2~3 条消息），「新建对话」创建空会话并展示空状态。
- **失败重试**：输入包含 `error` 关键词的消息可演示「发送失败 + 重试」交互。

## 功能清单

- [x] 三栏布局：会话列表 / 对话区 / 输入区，含新建对话、历史会话、会话切换与删除
- [x] 消息渲染：用户右侧气泡、AI 左侧头像 + 卡片
- [x] Markdown 渲染：加粗、列表、代码块、引用、表格
- [x] 代码块右上角一键复制
- [x] 发送：Enter 发送、Shift + Enter 换行，发送后清空输入框
- [x] 流式打字机输出 + 自动滚动（用户上滚不打断）
- [x] 停止生成（保留已输出内容）
- [x] loading 状态 + 发送失败 + 重试
- [x] 空状态：问候语 + 快捷提问卡片（点击直接发送）
