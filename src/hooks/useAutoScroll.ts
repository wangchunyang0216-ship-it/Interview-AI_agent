import { useEffect, useRef } from 'react';

/**
 * 自动滚动：
 * - 内容增长时，若用户仍停留在底部附近，则自动滚动到底部
 * - 用户上滚后暂停自动滚动，回到底部附近后恢复
 */
export function useAutoScroll(dep: unknown) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);

  useEffect(() => {
    const el = containerRef.current;
    if (el && stickToBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [dep]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickToBottomRef.current = distance < 80;
  };

  return { containerRef, handleScroll };
}
