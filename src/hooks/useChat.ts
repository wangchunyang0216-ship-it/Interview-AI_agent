import { useCallback, useState } from 'react';
import type { ChatSession } from '../types';
import { createId, initialSessions } from '../data/mock';

/**
 * 会话状态管理：
 * - 维护会话列表与当前激活会话
 * - 提供新建 / 切换 / 删除会话能力
 * - 发送与流式输出在后续阶段接入
 */
export function useChat() {
  const [sessions, setSessions] = useState<ChatSession[]>(initialSessions);
  const [activeId, setActiveId] = useState<string>(initialSessions[0].id);

  const activeSession =
    sessions.find((s) => s.id === activeId) ?? sessions[0];

  const createSession = useCallback(() => {
    const session: ChatSession = {
      id: createId('session'),
      title: '新对话',
      messages: [],
      updatedAt: Date.now(),
    };
    setSessions((prev) => [session, ...prev]);
    setActiveId(session.id);
  }, []);

  const switchSession = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const deleteSession = useCallback(
    (id: string) => {
      const next = sessions.filter((s) => s.id !== id);
      if (next.length === 0) {
        // 始终保留一个空会话，避免列表为空
        const fresh: ChatSession = {
          id: createId('session'),
          title: '新对话',
          messages: [],
          updatedAt: Date.now(),
        };
        setSessions([fresh]);
        setActiveId(fresh.id);
        return;
      }
      setSessions(next);
      if (activeId === id) {
        setActiveId(next[0].id);
      }
    },
    [sessions, activeId],
  );

  return {
    sessions,
    activeSession,
    activeId,
    createSession,
    switchSession,
    deleteSession,
  };
}
