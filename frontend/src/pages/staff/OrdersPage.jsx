import { useState, useEffect } from 'react';
import { getOrders, getBooks, createOrder, updateOrderStatus } from '../../api/services';
import { Loading, EmptyState } from '../../components/ui/States';
import { OrderStatusBadge } from '../../components/ui/Badges';
import Modal from '../../components/ui/Modal';

const STATUSES = [
  { value: 'pending',   label: 'Ожидает' },
  { value: 'confirmed', label: 'Подтверждён' },
  { value: 'completed', label: 'Выполнен' },
  { value: 'cancelled', label: 'Отменён' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ book_id: '', quantity: 1 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () =>
    Promise.all([getOrders(), getBooks()]).then(([o, b]) => {
      setOrders(o.data.slice().reverse());
      setBooks(b.data);
    });

  useEffect(() => { load().finally(() => setLoading(false)); }, []);

  const handleCreate = async () => {
    setSaving(true); setError('');
    try {
      await createOrder({ book_id: Number(form.book_id), quantity: Number(form.quantity) });
      await load(); setModal(null); setForm({ book_id: '', quantity: 1 });
    } catch (err) { setError(err.response?.data?.detail || 'Ошибка'); }
    finally { setSaving(false); }
  };

  const handleStatus = async (orderId, status) => {
    try { await updateOrderStatus(orderId, status); await load(); }
    catch (err) { alert(err.response?.data?.detail || 'Ошибка'); }
  };

  const fmtDate = (s) => new Date(s).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Заказы</h1>
          <div className="page-header__subtitle">Заказы на отсутствующие книги · {orders.length} записей</div>
        </div>
        <div className="page-header__actions">
          <button className="btn btn--primary" onClick={() => { setModal({ mode: 'add' }); setError(''); }}>
            + Создать заказ
          </button>
        </div>
      </div>

      {loading ? <Loading /> : orders.length === 0 ? (
        <EmptyState icon="📦" title="Заказов нет" text="Создайте заказ на отсутствующую книгу" />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>№</th><th>Книга</th><th>Автор</th><th>Кол-во</th><th>Статус</th><th>Создан</th><th>Изменить статус</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td style={{ color: '#9A8878', fontSize: '.8rem' }}>#{o.id}</td>
                  <td><strong>{o.book.title}</strong></td>
                  <td>{o.book.author.full_name}</td>
                  <td style={{ textAlign: 'center' }}>{o.quantity} шт.</td>
                  <td><OrderStatusBadge status={o.status} /></td>
                  <td style={{ color: '#9A8878', fontSize: '.85rem' }}>{fmtDate(o.created_at)}</td>
                  <td>
                    <select
                      className="select"
                      value={o.status}
                      onChange={(e) => handleStatus(o.id, e.target.value)}
                      style={{ padding: '5px 28px 5px 10px', fontSize: '.8rem', minWidth: 140 }}
                    >
                      {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modal?.mode === 'add'} onClose={() => setModal(null)} title="Создать заказ">
        {error && <div className="alert alert--error">{error}</div>}
        <div className="alert alert--info" style={{ marginBottom: 16 }}>
          Заказ оформляется на книгу, которой нет в наличии или которую нужно дозаказать у поставщика.
        </div>

        <div className="form-group">
          <label>Книга *</label>
          <select className="select" value={form.book_id} onChange={(e) => setForm({ ...form, book_id: e.target.value })} required>
            <option value="">Выберите книгу...</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} — {b.author.full_name} (склад: {b.stock})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Количество *</label>
          <input className="input" type="number" min="1" value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <button className="btn btn--secondary" onClick={() => setModal(null)}>Отмена</button>
          <button className="btn btn--primary" onClick={handleCreate}
            disabled={saving || !form.book_id || !form.quantity}>
            {saving ? 'Создаём...' : 'Создать заказ'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
