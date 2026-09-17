import { MoreHorizontal, PanelLeft, VolumeX } from 'lucide-react';
import Sidebar from './components/Sidebar/Sidebar';
import ChatArea from './components/ChatArea/ChatArea';
import EmptyState from './components/EmptyState/EmptyState';
import InputArea from './components/InputArea/InputArea';
import { useChat } from './hooks/useChat';
import styles from './App.module.css';

function App() {
  const { sessions, activeSession, activeId, isStreaming, createSession, switchSession, deleteSession, sendMessage, stopGenerating, retry } = useChat();
  const hasMessages = activeSession.messages.length > 0;
  return <div className={styles.app}>
    <Sidebar sessions={sessions} activeId={activeId} onCreate={createSession} onSwitch={switchSession} onDelete={deleteSession} />
    <main className={styles.main}>
      <header className={styles.topbar}>
        <button aria-label="切换侧栏"><PanelLeft size={20} /></button>
        {hasMessages && <div className={styles.title}><strong>{activeSession.title}</strong><span>AI 生成内容仅供参考</span></div>}
        <div className={styles.actions}><button aria-label="静音"><VolumeX size={19} /></button><button aria-label="更多"><MoreHorizontal size={20} /></button></div>
      </header>
      <section className={styles.stage}>{hasMessages ? <ChatArea session={activeSession} onRetry={retry} /> : <EmptyState onQuickAsk={sendMessage} />}</section>
      <InputArea onSend={sendMessage} streaming={isStreaming} onStop={stopGenerating} />
    </main>
  </div>;
}
export default App;
