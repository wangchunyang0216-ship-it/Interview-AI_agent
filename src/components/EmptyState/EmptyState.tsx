import {
  Sparkles,
  Layers,
  Zap,
  Code2,
  MessageSquareText,
} from 'lucide-react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  onQuickAsk: (question: string) => void;
}

const quickQuestions = [
  { icon: Layers, text: 'React 组件应该怎么拆分？' },
  { icon: Zap, text: '前端性能优化有哪些思路？' },
  { icon: Code2, text: 'TypeScript 泛型怎么用？' },
  { icon: MessageSquareText, text: 'Vue 3 和 React 有什么区别？' },
];

export default function EmptyState({ onQuickAsk }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <div className={styles.greeting}>
        <div className={styles.logo}>
          <Sparkles size={28} />
        </div>
        <h1>你好，我是你的 AI 助手</h1>
        <p>可以帮你解答前端开发、架构设计等问题</p>
      </div>

      <div className={styles.cards}>
        {quickQuestions.map((q) => (
          <button
            key={q.text}
            className={styles.card}
            onClick={() => onQuickAsk(q.text)}
            type="button"
          >
            <q.icon size={18} className={styles.cardIcon} />
            <span>{q.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
