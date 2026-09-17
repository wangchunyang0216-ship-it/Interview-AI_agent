import { Plus, MessageSquare, Trash2, Sparkles } from 'lucide-react';
import type { ChatSession } from '../../types';
import styles from './Sidebar.module.css';

interface SidebarProps {
  sessions: ChatSession[];
  activeId: string;
  onCreate: () => void;
  onSwitch: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function Sidebar({
  sessions,
  activeId,
  onCreate,
  onSwitch,
  onDelete,
}: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.brand}>
          <Sparkles size={20} className={styles.brandIcon} />
          <span>AI Agent</span>
        </div>
        <button className={styles.newBtn} onClick={onCreate}>
          <Plus size={16} />
          新建对话
        </button>
      </div>

      <nav className={styles.list}>
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`${styles.item} ${
              session.id === activeId ? styles.active : ''
            }`}
            onClick={() => onSwitch(session.id)}
            role="button"
            tabIndex={0}
          >
            <MessageSquare size={16} className={styles.itemIcon} />
            <span className={styles.itemTitle}>{session.title}</span>
            <button
              className={styles.deleteBtn}
              aria-label="删除会话"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(session.id);
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </nav>
    </aside>
  );
}
