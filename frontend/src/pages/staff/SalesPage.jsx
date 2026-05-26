import { useState, useEffect } from 'react';
import { getSales, getBooks, createSale } from '../../api/services';
import { Loading, EmptyState } from '../../components/ui/States';
import { StockBadge } from '../../components/ui/Badges';
import Modal from '../../components/ui/Modal';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ book_id: '', quantity: 1 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = () =>
    Promise.all([getSales(), getBooks()]).then(([s, b]) => {
      setSales(s.data.slice().reverse());
      setBooks(b.data);
    });

  useEffect(() => { load().finally(() => setLoading(false)); }, []);

  const selectedBook = books.find((b) => b.id === Number(form.book_id));

  const handleSale = async () => {
    setSaving(true); setError('');
    try {
      await createSale({ book_id: Number(form.book_id), quantity: Number(form.quantity) });
      await load();
      setShowAdd(false);
      setForm({ book_id: '', quantity: 1 });
      setSuccess('Продажа оформлена!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка оформления продажи');
    } finally { setSaving(false); }
  };

  const fmt = (v) => Number(v).toFixed(2);
  const fmtDate = (s) => new Date(s).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Продажи</h1>
          <div className="page-header__subtitle">{sales.length} записей</div>
        </div>
        <div className="page-header__actions">
          <button className="btn btn--primary" onClick={() => { setShowAdd(true); setError(''); }}>
            🛒 Оформить продажу
          </button>
        </div>
      </div>

      {success && <div className="alert alert--success">{success}</div>}

      {loading ? <Loading /> : sales.length === 0 ? (
        <EmptyState icon="🛒" title="Продаж ещё нет" text="Оформите первую продажу" />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>№</th><th>Книга</th><th>Автор</th><th>Кол-во</th><th>Сумма</th><th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id}>
                  <td style={{ color: '#9A8878', fontSize: '.8rem' }}>#{s.id}</td>
                  <td><strong>{s.book.title}</strong></td>
                  <td>{s.book.author.full_name}</td>
                  <td style={{ textAlign: 'center' }}>{s.quantity} шт.</td>
                  <td style={{ fontWeight: 600, color: '#4A7C59' }}>{fmt(s.total_price)} ₽</td>
                  <td style={{ color: '#9A8878', fontSize: '.85rem' }}>{fmtDate(s.sold_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Оформить продажу">
        {error && <div className="alert alert--error">{error}</div>}

        <div className="form-group">
          <label>Книга *</label>
          <select className="select" value={form.book_id} onChange={(e) => setForm({ ...form, book_id: e.target.value })} required>
            <option value="">Выберите книгу...</option>
            {books.map((b) => (
              <option key={b.id} value={b.id} disabled={b.stock === 0}>
                {b.title} — {b.author.full_name} (на складе: {b.stock})
              </option>
            ))}
          </select>
        </div>

        {selectedBook && (
          <div style={{ padding: '12px 16px', background: '#FAF8F4', borderRadius: 10, marginBottom: 16, border: '1px solid #E8E0D3' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '.95rem' }}>{selectedBook.title}</div>
                <div style={{ fontSize: '.85rem', color: '#9A8878' }}>{selectedBook.author.full_name}</div>
              </div>
              <StockBadge stock={selectedBook.stock} />
            </div>
            <div style={{ marginTop: 8, fontSize: '.9rem' }}>
              Цена: <strong>{fmt(selectedBook.retail_price)} ₽</strong>
              {form.quantity > 1 && (
                <span style={{ marginLeft: 12, color: '#4A7C59', fontWeight: 600 }}>
                  Итого: {(selectedBook.retail_price * form.quantity).toFixed(2)} ₽
                </span>
              )}
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Количество *</label>
          <input className="input" type="number" min="1"
            max={selectedBook?.stock || 999}
            value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <button className="btn btn--secondary" onClick={() => setShowAdd(false)}>Отмена</button>
          <button className="btn btn--primary" onClick={handleSale}
            disabled={saving || !form.book_id || !form.quantity || selectedBook?.stock === 0}>
            {saving ? 'Оформляем...' : 'Оформить продажу'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
