import { useCallback, useState } from 'react';
import type { ChatMessage, ChatSession } from '../types';
import { createId, initialSessions, matchReply, sleep } from '../data/mock';

/**
 * 会话状态管理：
 * - 维护会话列表与当前激活会话
 * - 提供新建 / 切换 / 删除会话能力
 * - 发送消息：追加用户消息 + AI 回复（S4 升级为流式输出）
 */
export function useChat() {
  const [sessions, setSessions] = useState<ChatSession[]>(initialSessions);
  const [activeId, setActiveId] = useState<string>(initialSessions[0].id);

  const activeSession =
    sessions.find((s) => s.id === activeId) ?? sessions[0];

  const updateMessage = useCallback(
    (
      sessionId: string,
      messageId: string,
      updater: (message: ChatMessage) => ChatMessage,
    ) => {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s;
          return {
            ...s,
            messages: s.messages.map((m) =>
              m.id === messageId ? updater(m) : m,
            ),
            updatedAt: Date.now(),
          };
        }),
      );
    },
    [],
  );

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

  const sendMessage = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content) return;

      const sessionId = activeSession.id;

      const userMessage: ChatMessage = {
        id: createId('msg'),
        role: 'user',
        content,
        status: 'done',
        createdAt: Date.now(),
      };
      const assistantMessage: ChatMessage = {
        id: createId('msg'),
        role: 'assistant',
        content: '',
        status: 'pending',
        createdAt: Date.now(),
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s;
          const isFirstMessage = s.messages.length === 0;
          return {
            ...s,
            title: isFirstMessage ? content.slice(0, 20) : s.title,
            messages: [...s.messages, userMessage, assistantMessage],
            updatedAt: Date.now(),
          };
        }),
      );

      // 模拟「思考中」延迟后一次性返回
      await sleep(500);
      const reply = matchReply(content);
      updateMessage(sessionId, assistantMessage.id, (m) => ({
        ...m,
        content: reply,
        status: 'done',
      }));
    },
    [activeSession.id, updateMessage],
  );

  return {
    sessions,
    activeSession,
    activeId,
    createSession,
    switchSession,
    deleteSession,
    sendMessage,
  };
}
