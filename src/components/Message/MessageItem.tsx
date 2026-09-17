import { Sparkles } from 'lucide-react';
import type { ChatMessage } from '../../types';
import MarkdownRenderer from './MarkdownRenderer';
import styles from './MessageItem.module.css';

interface MessageItemProps {
  message: ChatMessage;
}

export default function MessageItem({ message }: MessageItemProps) {
  if (message.role === 'user') {
    return (
      <div className={styles.userRow}>
        <div className={styles.userBubble}>{message.content}</div>
      </div>
    );
  }

  return (
    <div className={styles.assistantRow}>
      <div className={styles.avatar}>
        <Sparkles size={18} />
      </div>
      <div className={styles.assistantContent}>
        {message.status === 'pending' ? (
          <div className={styles.thinking}>
            <span />
            <span />
            <span />
          </div>
        ) : (
          <MarkdownRenderer content={message.content} />
        )}
      </div>
    </div>
  );
}
