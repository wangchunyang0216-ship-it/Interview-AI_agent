import type { ChatSession } from '../../types';
import styles from './ChatArea.module.css';

interface ChatAreaProps {
  session: ChatSession;
}

export default function ChatArea({ session }: ChatAreaProps) {
  return (
    <div className={styles.chatArea}>
      <div className={styles.messages}>
        {session.messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === 'user' ? styles.userMsg : styles.aiMsg
            }
          >
            {message.content}
          </div>
        ))}
      </div>
    </div>
  );
}
