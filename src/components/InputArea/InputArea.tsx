import { ArrowUp } from 'lucide-react';
import styles from './InputArea.module.css';

export default function InputArea() {
  return (
    <div className={styles.inputArea}>
      <div className={styles.inputBox}>
        <textarea
          className={styles.textarea}
          placeholder="输入消息，Enter 发送，Shift + Enter 换行"
          rows={1}
        />
        <button className={styles.sendBtn} disabled aria-label="发送">
          <ArrowUp size={18} />
        </button>
      </div>
      <p className={styles.hint}>AI 生成内容仅供参考</p>
    </div>
  );
}
