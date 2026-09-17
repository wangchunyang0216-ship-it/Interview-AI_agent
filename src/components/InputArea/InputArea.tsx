import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { ArrowUp, CircleStop, Image, Mic, MoreHorizontal, Plus, Presentation, ScrollText } from 'lucide-react';
import styles from './InputArea.module.css';
interface InputAreaProps { onSend: (text: string) => void; streaming: boolean; onStop: () => void; }
const tools = [{ icon: Presentation, label: 'PPT 生成' }, { icon: ScrollText, label: '帮我写作' }, { icon: Image, label: '图像生成' }, { icon: Mic, label: '录音转写' }, { icon: MoreHorizontal, label: '更多' }];
export default function InputArea({ onSend, streaming, onStop }: InputAreaProps) {
  const [value, setValue] = useState(''); const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { const el = textareaRef.current; if (el) { el.style.height = 'auto'; el.style.height = `${Math.min(el.scrollHeight, 140)}px`; } }, [value]);
  const handleSend = () => { const text = value.trim(); if (!streaming && text) { onSend(text); setValue(''); } };
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); handleSend(); } };
  return <div className={styles.wrap}><div className={styles.inputBox}>
    <textarea ref={textareaRef} placeholder="发消息或按住空格说话..." rows={1} value={value} onChange={event => setValue(event.target.value)} onKeyDown={handleKeyDown} />
    <div className={styles.toolbar}><button className={styles.add} type="button" aria-label="添加附件"><Plus size={22} /></button><span className={styles.divider} />
      <div className={styles.tools}>{tools.map(({ icon: Icon, label }) => <button key={label} type="button"><Icon size={16} /><span>{label}</span></button>)}</div>
      <span className={styles.mode}>快速</span>
      {streaming ? <button className={styles.send} onClick={onStop} aria-label="停止生成"><CircleStop size={20} /></button> : <button className={styles.send} onClick={handleSend} disabled={!value.trim()} aria-label="发送"><ArrowUp size={20} /></button>}
    </div>
  </div></div>;
}
