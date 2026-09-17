import type { ChatMessage, ChatSession } from '../types';

/* ------------------------------------------------------------------ */
/* 工具函数                                                            */
/* ------------------------------------------------------------------ */

let idCounter = 0;

/** 生成唯一 id（纯前端，无需真实后端） */
export function createId(prefix = 'id'): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ------------------------------------------------------------------ */
/* 预设回复（按关键词匹配，共 5 条 + 默认回复）                        */
/* ------------------------------------------------------------------ */

interface MockReply {
  keywords: string[];
  content: string;
}

export const mockReplies: MockReply[] = [
  {
    keywords: ['react', '前端', '框架', '组件', 'hooks', 'hook', '组件拆分'],
    content: `# React 组件化开发

React 是目前最主流的前端框架之一，核心思想是**组件化**与**声明式**。

## 函数组件与 Hooks

\`\`\`tsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((c) => c + 1)}>
      点击了 {count} 次
    </button>
  );
}
\`\`\`

### 常用 Hooks

- \`useState\`：管理组件局部状态
- \`useEffect\`：处理副作用与生命周期
- \`useMemo\` / \`useCallback\`：性能优化
- \`useRef\`：引用可变值或 DOM

> 建议保持组件单一职责，避免过度拆分。`,
  },
  {
    keywords: ['vue', 'vite'],
    content: `# Vue 3 与 Vite

Vue 3 引入了 **Composition API**，配合 Vite 拥有极快的冷启动速度。

\`\`\`js
import { ref } from 'vue';

export default {
  setup() {
    const count = ref(0);
    return { count };
  },
};
\`\`\`

- 响应式系统基于 \`Proxy\`
- 支持 \`<script setup>\` 语法糖
- Tree-shaking 更加彻底`,
  },
  {
    keywords: ['性能', '优化', 'performance', '渲染'],
    content: `# 前端性能优化

性能优化可以从**加载**与**运行时**两个维度入手。

\`\`\`js
// 路由级代码分割
const Home = lazy(() => import('./Home'));
\`\`\`

1. 资源：压缩、CDN、HTTP/2、字体子集化
2. 渲染：虚拟列表、\`React.memo\`、避免重复渲染
3. 网络：预加载、懒加载、合理的缓存策略`,
  },
  {
    keywords: ['部署', 'deploy', 'docker', 'nginx'],
    content: `# 前端部署方案

常见部署方式：

\`\`\`bash
npm run build
# 将 dist 目录部署到静态服务器
\`\`\`

- **Vercel / Netlify**：零配置托管
- **Nginx**：反向代理 + 静态资源
- **Docker**：容器化部署`,
  },
  {
    keywords: ['typescript', 'ts', '类型'],
    content: `# TypeScript 核心概念

TypeScript 通过**静态类型**帮助我们在编码阶段发现错误。

\`\`\`ts
interface User {
  id: number;
  name: string;
}

function greet(user: User): string {
  return \`你好，\${user.name}\`;
}
\`\`\`

- 接口与类型别名
- 泛型与类型推导
- \`strict\` 模式的最佳实践`,
  },
];

export const defaultReply = `我是你的 AI 助手，很高兴为你服务！✨

你可以试试问我这些问题：

- React 组件怎么拆分？
- 前端性能如何优化？
- Vue 3 有什么新特性？

> 提示：输入包含 \`error\` 的消息可以演示「发送失败 + 重试」的交互。`;

/** 按关键词匹配预设回复，匹配不到返回默认回复 */
export function matchReply(input: string): string {
  const lower = input.toLowerCase();
  for (const reply of mockReplies) {
    if (reply.keywords.some((k) => lower.includes(k.toLowerCase()))) {
      return reply.content;
    }
  }
  return defaultReply;
}

/* ------------------------------------------------------------------ */
/* 流式输出：模拟 SSE，每 30~60ms 追加 2~5 个字符                      */
/* ------------------------------------------------------------------ */

export async function* chunked(
  text: string,
  { size, every }: { size: number; every: number },
): AsyncIterable<string> {
  for (let i = 0; i < text.length; i += size) {
    // 在基准间隔上加入 ±15ms 抖动，形成自然的打字机节奏
    await sleep(every + (Math.random() * 30 - 15));
    yield text.slice(i, i + size);
  }
}

export function streamReply(input: string): AsyncIterable<string> {
  const reply = matchReply(input);
  return chunked(reply, { size: 3, every: 40 });
}

/* ------------------------------------------------------------------ */
/* 历史会话（页面加载时预置 2 个会话，每个 2~3 条消息）                */
/* ------------------------------------------------------------------ */

function msg(
  id: string,
  role: ChatMessage['role'],
  content: string,
  status: ChatMessage['status'] = 'done',
  createdAt: number,
): ChatMessage {
  return { id, role, content, status, createdAt };
}

const now = Date.now();

export const initialSessions: ChatSession[] = [
  {
    id: 'session-react',
    title: 'React 组件拆分',
    updatedAt: now - 1000 * 60 * 5,
    messages: [
      msg(
        'msg-react-1',
        'user',
        'React 组件应该怎么拆分才合理？',
        'done',
        now - 1000 * 60 * 5,
      ),
      msg(
        'msg-react-2',
        'assistant',
        mockReplies[0].content,
        'done',
        now - 1000 * 60 * 4,
      ),
    ],
  },
  {
    id: 'session-perf',
    title: '前端性能优化',
    updatedAt: now - 1000 * 60 * 60,
    messages: [
      msg(
        'msg-perf-1',
        'user',
        '前端性能优化有哪些思路？',
        'done',
        now - 1000 * 60 * 60,
      ),
      msg(
        'msg-perf-2',
        'assistant',
        mockReplies[2].content,
        'done',
        now - 1000 * 60 * 59,
      ),
      msg(
        'msg-perf-3',
        'user',
        '能举个虚拟列表的例子吗？',
        'done',
        now - 1000 * 60 * 58,
      ),
    ],
  },
];
