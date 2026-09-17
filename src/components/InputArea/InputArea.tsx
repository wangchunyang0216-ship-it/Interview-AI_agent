import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { ArrowUp, Square } from 'lucide-react';
import styles from './InputArea.module.css';

interface InputAreaProps {
  onSend: (text: string) => void;
  streaming: boolean;
  onStop: () => void;
}

export default function InputArea({
  onSend,
  streaming,
  onStop,
}: InputAreaProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 随内容自动增高（Shift + Enter 换行时展开）
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  const handleSend = () => {
    if (streaming) return;
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.inputArea}>
      <div className={styles.inputBox}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          placeholder="输入消息，Enter 发送，Shift + Enter 换行"
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {streaming ? (
          <button
            className={styles.stopBtn}
            onClick={onStop}
            aria-label="停止生成"
          >
            <Square size={14} />
            停止
          </button>
        ) : (
          <button
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={!value.trim()}
            aria-label="发送"
          >
            <ArrowUp size={18} />
          </button>
        )}
      </div>
      <p className={styles.hint}>AI 生成内容仅供参考</p>
    </div>
  );
}
