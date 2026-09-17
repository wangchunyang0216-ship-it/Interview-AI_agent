import type { ChatSession } from '../../types';
import MessageItem from '../Message/MessageItem';
import styles from './ChatArea.module.css';

interface ChatAreaProps {
  session: ChatSession;
}

export default function ChatArea({ session }: ChatAreaProps) {
  return (
    <div className={styles.chatArea}>
      <div className={styles.messages}>
        {session.messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
