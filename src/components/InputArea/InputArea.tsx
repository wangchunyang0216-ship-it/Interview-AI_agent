import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { ArrowUp } from 'lucide-react';
import styles from './InputArea.module.css';

interface InputAreaProps {
  onSend: (text: string) => void;
}

export default function InputArea({ onSend }: InputAreaProps) {
  const [value, setValue] = useState('');

  const handleSend = () => {
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
          className={styles.textarea}
          placeholder="输入消息，Enter 发送，Shift + Enter 换行"
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className={styles.sendBtn}
          onClick={handleSend}
          disabled={!value.trim()}
          aria-label="发送"
        >
          <ArrowUp size={18} />
        </button>
      </div>
      <p className={styles.hint}>AI 生成内容仅供参考</p>
    </div>
  );
}
