import { BellRing, ChevronRight, Clock3, Cloud, LayoutGrid, MessageCircle, MoreHorizontal, PenLine, Plus, Search, Sparkles, Trash2 } from 'lucide-react';
import type { ChatSession } from '../../types';
import styles from './Sidebar.module.css';

interface SidebarProps { sessions: ChatSession[]; activeId: string; onCreate: () => void; onSwitch: (id: string) => void; onDelete: (id: string) => void; }
const navigation = [
  { icon: PenLine, label: '新工作任务' }, { icon: MessageCircle, label: '新对话' },
  { icon: Clock3, label: '定时任务' }, { icon: Sparkles, label: '插件 · 技能 · 伙伴' },
  { icon: Cloud, label: '云盘' }, { icon: LayoutGrid, label: '更多', trailing: true },
];

export default function Sidebar({ sessions, activeId, onCreate, onSwitch, onDelete }: SidebarProps) {
  return <aside className={styles.sidebar}>
    <div className={styles.brandRow}><span className={styles.brand}>面试助手</span><button className={styles.iconBtn} aria-label="搜索"><Search size={20} /></button></div>
    <nav className={styles.primaryNav}>{navigation.map(({ icon: Icon, label, trailing }, index) =>
      <button key={label} className={styles.navItem} onClick={index < 2 ? onCreate : undefined} type="button"><Icon size={19} strokeWidth={1.8} /><span>{label}</span>{trailing && <ChevronRight className={styles.trailing} size={17} />}</button>)}</nav>
    <div className={styles.sectionLabel}>置顶</div>
    <button className={styles.pinned} type="button"><BellRing size={15} /><span>AI 面试高频题精讲</span></button>
    <div className={styles.projectRow}><span>项目</span><button type="button"><Plus size={17} /> 创建新项目</button></div>
    <div className={styles.sectionLabel}>最近</div>
    <nav className={styles.list}>{sessions.map((session, index) =>
      <div key={session.id} className={`${styles.item} ${session.id === activeId ? styles.active : ''}`} onClick={() => onSwitch(session.id)} role="button" tabIndex={0}>
        <span className={`${styles.sessionIcon} ${styles[`tone${index % 4}`]}`}><MessageCircle size={13} /></span><span className={styles.itemTitle}>{session.title}</span>
        <button className={styles.deleteBtn} aria-label="删除会话" onClick={(event) => { event.stopPropagation(); onDelete(session.id); }} type="button"><Trash2 size={14} /></button>
      </div>)}</nav>
    <div className={styles.profile}><span className={styles.profileAvatar}>AI</span><div><strong>面试冲刺计划</strong><small>准备下一场面试</small></div><MoreHorizontal size={18} /></div>
  </aside>;
}
