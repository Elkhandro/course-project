import { useState, useEffect } from "react";
import {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../../api/services";
import { Loading, EmptyState } from "../../components/ui/States";
import Modal from "../../components/ui/Modal";

export default function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ first_name: "", last_name: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => getAuthors().then((r) => setAuthors(r.data));

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setForm({ first_name: "", last_name: "" });
    setModal({ mode: "add" });
    setError("");
  };
  const openEdit = (a) => {
    setForm({ first_name: a.first_name, last_name: a.last_name });
    setModal({ mode: "edit", author: a });
    setError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      if (modal.mode === "add") await createAuthor(form);
      else await updateAuthor(modal.author.id, form);
      await load();
      setModal(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Ошибка");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteAuthor(modal.author.id);
      await load();
      setModal(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Ошибка удаления");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Авторы</h1>
          <div className="page-header__subtitle">{authors.length} авторов</div>
        </div>
        <div className="page-header__actions">
          <button className="btn btn--primary" onClick={openAdd}>
            + Добавить автора
          </button>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : authors.length === 0 ? (
        <EmptyState
          icon="✍️"
          title="Авторов нет"
          text="Добавьте первого автора"
        />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Полное имя</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((a) => (
                <tr key={a.id}>
                  <td style={{ color: "#9A8878", fontSize: ".8rem" }}>
                    #{a.id}
                  </td>
                  <td>{a.first_name}</td>
                  <td>{a.last_name}</td>
                  <td>
                    <strong>{a.full_name}</strong>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        className="btn btn--icon"
                        onClick={() => openEdit(a)}
                      >
                        Редактировать
                      </button>
                      <button
                        className="btn btn--icon"
                        onClick={() => {
                          setModal({ mode: "delete", author: a });
                          setError("");
                        }}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={modal?.mode === "add" || modal?.mode === "edit"}
        onClose={() => setModal(null)}
        title={
          modal?.mode === "add" ? "Добавить автора" : "Редактировать автора"
        }
      >
        {error && <div className="alert alert--error">{error}</div>}
        <div className="form-group">
          <label>Имя *</label>
          <input
            className="input"
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Фамилия *</label>
          <input
            className="input"
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            required
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 8,
          }}
        >
          <button className="btn btn--secondary" onClick={() => setModal(null)}>
            Отмена
          </button>
          <button
            className="btn btn--primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Сохраняем..." : "Сохранить"}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={modal?.mode === "delete"}
        onClose={() => setModal(null)}
        title="Удалить автора"
        footer={
          <>
            <button
              className="btn btn--secondary"
              onClick={() => setModal(null)}
            >
              Отмена
            </button>
            <button
              className="btn btn--danger"
              onClick={handleDelete}
              disabled={saving}
            >
              {saving ? "..." : "Удалить"}
            </button>
          </>
        }
      >
        <p>
          Удалить автора <strong>{modal?.author?.full_name}</strong>?
        </p>
        {error && (
          <div className="alert alert--error" style={{ marginTop: 12 }}>
            {error}
          </div>
        )}
      </Modal>
    </div>
  );
}
