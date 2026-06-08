export function Loading({ text = "Загрузка..." }) {
  return (
    <div className="loading">
      <div className="loading__dot" />
      <div className="loading__dot" />
      <div className="loading__dot" />
      <span>{text}</span>
    </div>
  );
}

export function EmptyState({ icon = "", title, text }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      {title && <div className="empty-state__title">{title}</div>}
      {text && <div className="empty-state__text">{text}</div>}
    </div>
  );
}
