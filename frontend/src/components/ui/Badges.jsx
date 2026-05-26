const MAP = {
  paperback: { label: 'Мягкая', icon: '📕' },
  hardcover: { label: 'Твёрдая', icon: '📗' },
  ebook:     { label: 'Эл. книга', icon: '💻' },
  audio:     { label: 'Аудио', icon: '🎧' },
};

export function MediaBadge({ type }) {
  const m = MAP[type] || { label: type, icon: '📄' };
  return (
    <span className="badge badge--brown" style={{ gap: 4 }}>
      {m.icon} {m.label}
    </span>
  );
}

export function StockBadge({ stock }) {
  if (stock > 10) return <span className="badge badge--green">В наличии ({stock})</span>;
  if (stock > 0)  return <span className="badge badge--amber">Мало ({stock})</span>;
  return <span className="badge badge--red">Нет в наличии</span>;
}

export function OrderStatusBadge({ status }) {
  const map = {
    pending:   { cls: 'badge--amber', label: 'Ожидает' },
    confirmed: { cls: 'badge--blue',  label: 'Подтверждён' },
    completed: { cls: 'badge--green', label: 'Выполнен' },
    cancelled: { cls: 'badge--gray',  label: 'Отменён' },
  };
  const s = map[status] || { cls: 'badge--gray', label: status };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}
