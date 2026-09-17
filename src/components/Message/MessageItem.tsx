import { Sparkles, AlertCircle, RotateCcw } from 'lucide-react';
import type { ChatMessage } from '../../types';
import MarkdownRenderer from './MarkdownRenderer';
import styles from './MessageItem.module.css';

interface MessageItemProps {
  message: ChatMessage;
  onRetry: (messageId: string) => void;
}

export default function MessageItem({ message, onRetry }: MessageItemProps) {
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
        ) : message.status === 'error' ? (
          <div className={styles.errorBox}>
            <div className={styles.errorText}>
              <AlertCircle size={16} />
              <span>{message.content || '发送失败，请重试'}</span>
            </div>
            <button
              className={styles.retryBtn}
              onClick={() => onRetry(message.id)}
              type="button"
            >
              <RotateCcw size={14} />
              重试
            </button>
          </div>
        ) : (
          <>
            <MarkdownRenderer content={message.content} />
            {message.status === 'streaming' && (
              <span className={styles.cursor} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
