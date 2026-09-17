import { useCallback, useMemo, useRef, useState } from 'react';
import type { ChatMessage, ChatSession } from '../types';
import { createId, initialSessions, sleep, streamReply } from '../data/mock';

/**
 * 会话状态管理：
 * - 维护会话列表与当前激活会话
 * - 新建 / 切换 / 删除会话
 * - 发送消息 + 流式输出（打字机效果）、停止生成、失败重试
 */
export function useChat() {
  const [sessions, setSessions] = useState<ChatSession[]>(initialSessions);
  const [activeId, setActiveId] = useState<string>(initialSessions[0].id);

  // 流式生成令牌：每次生成递增，用于让旧生成任务失效（停止/打断）
  const generationRef = useRef(0);

  const activeSession =
    sessions.find((s) => s.id === activeId) ?? sessions[0];

  const isStreaming = useMemo(
    () =>
      activeSession.messages.some(
        (m) => m.status === 'pending' || m.status === 'streaming',
      ),
    [activeSession.messages],
  );

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

  const removeMessage = useCallback(
    (sessionId: string, messageId: string) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                messages: s.messages.filter((m) => m.id !== messageId),
                updatedAt: Date.now(),
              }
            : s,
        ),
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

  /** 执行一次流式回复（思考延迟 → 打字机输出 / 失败） */
  const runStream = useCallback(
    async (sessionId: string, messageId: string, userContent: string) => {
      const gen = ++generationRef.current;

      // 预留约 300ms 的「思考中」延迟
      await sleep(300);

      // 思考阶段被停止 / 打断：移除占位消息
      if (generationRef.current !== gen) {
        removeMessage(sessionId, messageId);
        return;
      }

      // 模拟发送失败：包含 error 关键词时进入错误状态
      if (userContent.toLowerCase().includes('error')) {
        updateMessage(sessionId, messageId, (m) => ({
          ...m,
          content: '抱歉，服务暂时不可用，请稍后重试。',
          status: 'error',
        }));
        return;
      }

      updateMessage(sessionId, messageId, (m) => ({
        ...m,
        status: 'streaming',
      }));

      let acc = '';
      for await (const chunk of streamReply(userContent)) {
        if (generationRef.current !== gen) {
          // 被停止：保留已输出内容
          updateMessage(sessionId, messageId, (m) => ({
            ...m,
            status: 'done',
          }));
          return;
        }
        acc += chunk;
        updateMessage(sessionId, messageId, (m) => ({ ...m, content: acc }));
      }

      if (generationRef.current === gen) {
        updateMessage(sessionId, messageId, (m) => ({
          ...m,
          status: 'done',
        }));
      }
    },
    [updateMessage, removeMessage],
  );

  const sendMessage = useCallback(
    (text: string) => {
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

      void runStream(sessionId, assistantMessage.id, content);
    },
    [activeSession.id, runStream],
  );

  const stopGenerating = useCallback(() => {
    generationRef.current += 1;
  }, []);

  const retry = useCallback(
    (messageId: string) => {
      const session = sessions.find((s) => s.id === activeId);
      if (!session) return;
      const idx = session.messages.findIndex((m) => m.id === messageId);
      if (idx === -1) return;

      const userMessage = session.messages
        .slice(0, idx)
        .reverse()
        .find((m) => m.role === 'user');
      if (!userMessage) return;

      updateMessage(activeId, messageId, (m) => ({
        ...m,
        status: 'pending',
        content: '',
      }));
      void runStream(activeId, messageId, userMessage.content);
    },
    [sessions, activeId, updateMessage, runStream],
  );

  return {
    sessions,
    activeSession,
    activeId,
    isStreaming,
    createSession,
    switchSession,
    deleteSession,
    sendMessage,
    stopGenerating,
    retry,
  };
}
