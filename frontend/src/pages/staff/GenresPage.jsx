import { useState, useEffect } from 'react';
import { getGenres, createGenre, updateGenre, deleteGenre } from '../../api/services';
import { Loading, EmptyState } from '../../components/ui/States';
import Modal from '../../components/ui/Modal';

export default function GenresPage() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => getGenres().then((r) => setGenres(r.data));
  useEffect(() => { load().finally(() => setLoading(false)); }, []);

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      if (modal.mode === 'add') await createGenre({ name });
      else await updateGenre(modal.genre.id, { name });
      await load(); setModal(null);
    } catch (err) { setError(err.response?.data?.detail || 'Ошибка'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try { await deleteGenre(modal.genre.id); await load(); setModal(null); }
    catch (err) { setError(err.response?.data?.detail || 'Ошибка'); }
    finally { setSaving(false); }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Жанры</h1>
          <div className="page-header__subtitle">{genres.length} жанров</div>
        </div>
        <div className="page-header__actions">
          <button className="btn btn--primary" onClick={() => { setName(''); setModal({ mode: 'add' }); setError(''); }}>
            + Добавить жанр
          </button>
        </div>
      </div>

      {loading ? <Loading /> : genres.length === 0 ? (
        <EmptyState icon="🏷️" title="Жанры не добавлены" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {genres.map((g) => (
            <div key={g.id} className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '.75rem', color: '#9A8878', marginBottom: 2 }}>#{g.id}</div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>{g.name}</div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="btn btn--icon" onClick={() => { setName(g.name); setModal({ mode: 'edit', genre: g }); setError(''); }}>✏️</button>
                <button className="btn btn--icon" onClick={() => { setModal({ mode: 'delete', genre: g }); setError(''); }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modal?.mode === 'add' || modal?.mode === 'edit'}
        onClose={() => setModal(null)} title={modal?.mode === 'add' ? 'Добавить жанр' : 'Редактировать жанр'}>
        {error && <div className="alert alert--error">{error}</div>}
        <div className="form-group">
          <label>Название жанра *</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <button className="btn btn--secondary" onClick={() => setModal(null)}>Отмена</button>
          <button className="btn btn--primary" onClick={handleSave} disabled={saving || !name.trim()}>
            {saving ? '...' : 'Сохранить'}
          </button>
        </div>
      </Modal>

      <Modal isOpen={modal?.mode === 'delete'} onClose={() => setModal(null)} title="Удалить жанр"
        footer={<>
          <button className="btn btn--secondary" onClick={() => setModal(null)}>Отмена</button>
          <button className="btn btn--danger" onClick={handleDelete} disabled={saving}>{saving ? '...' : 'Удалить'}</button>
        </>}>
        <p>Удалить жанр <strong>«{modal?.genre?.name}»</strong>?</p>
        {error && <div className="alert alert--error" style={{ marginTop: 12 }}>{error}</div>}
      </Modal>
    </div>
  );
}
