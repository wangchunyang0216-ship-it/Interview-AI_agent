import Sidebar from './components/Sidebar/Sidebar';
import ChatArea from './components/ChatArea/ChatArea';
import InputArea from './components/InputArea/InputArea';
import { useChat } from './hooks/useChat';
import styles from './App.module.css';

function App() {
  const {
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
  } = useChat();

  return (
    <div className={styles.app}>
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        onCreate={createSession}
        onSwitch={switchSession}
        onDelete={deleteSession}
      />
      <main className={styles.main}>
        <ChatArea session={activeSession} onRetry={retry} />
        <InputArea
          onSend={sendMessage}
          streaming={isStreaming}
          onStop={stopGenerating}
        />
      </main>
    </div>
  );
}

export default App;
