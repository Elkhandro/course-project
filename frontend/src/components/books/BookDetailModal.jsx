import Modal from '../ui/Modal';
import { MediaBadge, StockBadge } from '../ui/Badges';

export default function BookDetailModal({ book, onClose }) {
  if (!book) return null;
  return (
    <Modal isOpen={!!book} onClose={onClose} title={book.title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <MediaBadge type={book.media_type} />
          <StockBadge stock={book.stock} />
        </div>

        <table style={{ width: '100%', fontSize: '.9rem' }}>
          <tbody>
            <Row label="Автор" value={book.author?.full_name} />
            <Row label="Жанр" value={book.genre?.name} />
            <Row label="Год издания" value={book.year} />
            {book.pages && <Row label="Страниц" value={book.pages} />}
            <Row label="Цена" value={`${Number(book.retail_price).toFixed(2)} ₽`} />
            <Row label="Остаток" value={`${book.stock} шт.`} />
          </tbody>
        </table>
      </div>
    </Modal>
  );
}

function Row({ label, value }) {
  return (
    <tr>
      <td style={{ padding: '7px 0', color: 'var(--ink-muted, #9A8878)', width: '40%', fontSize: '.8rem', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600 }}>{label}</td>
      <td style={{ padding: '7px 0', fontWeight: 500 }}>{value}</td>
    </tr>
  );
}
