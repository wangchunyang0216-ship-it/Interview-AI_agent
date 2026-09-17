import type { ChatMessage, ChatSession } from '../types';
let idCounter = 0;
export function createId(prefix = 'id'): string { idCounter += 1; return `${prefix}-${Date.now().toString(36)}-${idCounter}`; }
export function sleep(ms: number): Promise<void> { return new Promise(resolve => setTimeout(resolve, ms)); }
interface MockReply { keywords: string[]; content: string; }
export const mockReplies: MockReply[] = [
  { keywords: ['react', '前端', '组件'], content: `## React 组件如何拆分

组件拆分的核心是让每个组件只负责一件清晰的事情。可以从这几个角度判断：

- **职责边界**：UI、数据获取和业务逻辑是否可以独立描述
- **复用价值**：相同结构是否会在多个位置出现
- **变化频率**：经常一起变化的代码放在一起
- **状态归属**：状态尽量靠近真正使用它的组件

面试中可以结合一个列表页，说明如何拆成筛选区、列表、列表项和分页，并解释状态为什么放在父组件。` },
  { keywords: ['性能', '优化', 'performance'], content: `## 前端性能优化思路

可以按 **加载、渲染、交互** 三个阶段回答：

1. 加载阶段：代码分割、资源压缩、缓存和 CDN
2. 渲染阶段：减少无效更新、虚拟列表、图片懒加载
3. 交互阶段：拆分长任务、节流防抖、使用 Web Worker

面试时最好补充指标，例如 LCP、INP 和 CLS，并说明你如何定位瓶颈。` },
  { keywords: ['typescript', 'ts', '类型'], content: `## TypeScript 核心能力

TypeScript 通过静态类型检查提前发现问题。常见考点包括联合类型、类型收窄、泛型、工具类型和类型推导。

\`\`\`ts
function identity<T>(value: T): T {
  return value;
}
\`\`\`

回答泛型问题时，可以强调它在保持类型信息的同时复用逻辑。` },
  { keywords: ['系统设计', '架构'], content: `## 系统设计面试准备

先确认需求和规模，再依次讨论接口、数据模型、核心链路、容量估算以及高可用方案。不要急着画架构图，先把约束问清楚。

一个清晰的回答通常遵循：**需求澄清 → 粗略估算 → 总体设计 → 深挖关键模块 → 权衡与演进**。` },
];
export const defaultReply = `我会以面试官和教练的视角帮助你准备。你可以发来目标岗位、岗位描述或一道具体题目，我会给出回答思路、追问方向和改进建议。`;
export function matchReply(input: string): string { const lower = input.toLowerCase(); return mockReplies.find(reply => reply.keywords.some(keyword => lower.includes(keyword.toLowerCase())))?.content ?? defaultReply; }
export async function* chunked(text: string, { size, every }: { size: number; every: number }): AsyncIterable<string> { for (let i = 0; i < text.length; i += size) { await sleep(every + Math.random() * 20); yield text.slice(i, i + size); } }
export function streamReply(input: string): AsyncIterable<string> { return chunked(matchReply(input), { size: 4, every: 30 }); }
function msg(id: string, role: ChatMessage['role'], content: string, createdAt: number): ChatMessage { return { id, role, content, status: 'done', createdAt }; }
const now = Date.now();
export const initialSessions: ChatSession[] = [
  { id: 'session-system', title: '系统设计面试准备', updatedAt: now - 300000, messages: [msg('system-1', 'user', '系统设计面试应该怎么准备？', now - 300000), msg('system-2', 'assistant', mockReplies[3].content, now - 240000)] },
  { id: 'session-react', title: 'React 组件拆分原则', updatedAt: now - 3600000, messages: [msg('react-1', 'user', 'React 组件应该怎么拆分才合理？', now - 3600000), msg('react-2', 'assistant', mockReplies[0].content, now - 3500000)] },
  { id: 'session-performance', title: '前端性能优化思路', updatedAt: now - 7200000, messages: [msg('perf-1', 'user', '前端性能优化有哪些思路？', now - 7200000), msg('perf-2', 'assistant', mockReplies[1].content, now - 7100000)] },
];
