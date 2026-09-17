import styles from './EmptyState.module.css';
interface EmptyStateProps { onQuickAsk: (question: string) => void; }
const quickQuestions = ['请帮我做一次前端模拟面试', '根据岗位描述生成面试题', '如何准备系统设计面试？', '帮我优化这段自我介绍'];
export default function EmptyState({ onQuickAsk }: EmptyStateProps) {
  return <div className={styles.empty}><div className={styles.content}>
    <h1>有什么我能帮你的吗？</h1>
    <div className={styles.switcher}><button className={styles.active}>对话</button><button>工作</button></div>
    <p className={styles.label}>为你推荐</p>
    <div className={styles.questions}>{quickQuestions.map(question => <button key={question} onClick={() => onQuickAsk(question)} type="button">{question}</button>)}</div>
  </div></div>;
}
