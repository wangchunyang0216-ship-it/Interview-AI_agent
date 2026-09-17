import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import styles from './CodeBlock.module.css';
interface CodeBlockProps { language?: string; code: string; }
export default function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return <div className={styles.codeBlock}><div className={styles.header}><span className={styles.lang}>{language ?? 'code'}</span><button className={styles.copyBtn} onClick={handleCopy} type="button">{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? '已复制' : '复制'}</button></div><pre className={styles.pre}><code>{code}</code></pre></div>;
}
