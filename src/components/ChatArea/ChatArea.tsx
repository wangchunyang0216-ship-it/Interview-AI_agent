import type { ChatSession } from '../../types';
import MessageItem from '../Message/MessageItem';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import styles from './ChatArea.module.css';

interface ChatAreaProps {
  session: ChatSession;
  onRetry: (messageId: string) => void;
}

export default function ChatArea({ session, onRetry }: ChatAreaProps) {
  const { containerRef, handleScroll } = useAutoScroll(session.messages);

  return (
    <div
      className={styles.chatArea}
      ref={containerRef}
      onScroll={handleScroll}
    >
      <div className={styles.messages}>
        {session.messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            onRetry={onRetry}
          />
        ))}
      </div>
    </div>
  );
}
