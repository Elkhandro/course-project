import { useState, useEffect } from "react";
import {
  getBooks,
  getAuthors,
  getGenres,
  createBook,
  updateBook,
  deleteBook,
  uploadCover,
} from "../../api/services";
import { Loading, EmptyState } from "../../components/ui/States";
import { MediaBadge, StockBadge } from "../../components/ui/Badges";
import Modal from "../../components/ui/Modal";
import BookForm from "../../components/books/BookForm";

const API_URL =
  import.meta.env.VITE_API_URL?.replace("/api/v1", "") ||
  "http://localhost:8000";

export default function StaffBooksPage() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [outOfStock, setOutOfStock] = useState(false);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    const params = {};
    if (filterGenre) params.genre_id = filterGenre;
    if (filterAuthor) params.author_id = filterAuthor;
    if (outOfStock) params.out_of_stock = true;
    return getBooks(params).then((r) => setBooks(r.data));
  };

  useEffect(() => {
    Promise.all([load(), getAuthors(), getGenres()])
      .then(([, a, g]) => {
        setAuthors(a.data);
        setGenres(g.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) load();
  }, [filterGenre, filterAuthor, outOfStock]);

  // bookData — поля книги, coverFile — File объект или null
  const handleSave = async (bookData, coverFile) => {
    setSaving(true);
    setError("");
    try {
      let savedBook;
      if (modal.mode === "add") {
        const res = await createBook(bookData);
        savedBook = res.data;
      } else {
        const res = await updateBook(modal.book.id, bookData);
        savedBook = res.data;
      }

      // Если выбрана новая обложка — загружаем её
      if (coverFile) {
        const fd = new FormData();
        fd.append("file", coverFile);
        await uploadCover(savedBook.id, fd);
      }

      await load();
      setModal(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteBook(modal.book.id);
      await load();
      setModal(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Ошибка удаления");
    } finally {
      setSaving(false);
    }
  };

  const filtered = books.filter(
    (b) =>
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.full_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Книги</h1>
          <div className="page-header__subtitle">{filtered.length} записей</div>
        </div>
        <div className="page-header__actions">
          <button
            className="btn btn--primary"
            onClick={() => {
              setModal({ mode: "add" });
              setError("");
            }}
          >
            + Добавить книгу
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <span className="filter-bar__label">Фильтры</span>
        <input
          type="search"
          placeholder="Название / автор..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: 220 }}
        />
        <select
          value={filterGenre}
          onChange={(e) => setFilterGenre(e.target.value)}
        >
          <option value="">Все жанры</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <select
          value={filterAuthor}
          onChange={(e) => setFilterAuthor(e.target.value)}
        >
          <option value="">Все авторы</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.full_name}
            </option>
          ))}
        </select>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: ".875rem",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          <input
            type="checkbox"
            checked={outOfStock}
            onChange={(e) => setOutOfStock(e.target.checked)}
            style={{ accentColor: "#8B6F47" }}
          />
          Нет в наличии
        </label>
        {(filterGenre || filterAuthor || outOfStock || search) && (
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => {
              setFilterGenre("");
              setFilterAuthor("");
              setOutOfStock(false);
              setSearch("");
            }}
          >
            Сбросить
          </button>
        )}
      </div>

      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon=""
          title="Книги не найдены"
          text="Добавьте первую книгу или измените фильтры"
        />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Обложка</th>
                <th>Название</th>
                <th>Автор</th>
                <th>Жанр</th>
                <th>Год</th>
                <th>Тип</th>
                <th>Цена (розн.)</th>
                <th>Наличие</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td>
                    {b.cover_image ? (
                      <img
                        src={`${API_URL}/${b.cover_image}`}
                        alt=""
                        style={{
                          width: 36,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 4,
                          display: "block",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 36,
                          height: 50,
                          background: "#F2EDE4",
                          borderRadius: 4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.1rem",
                        }}
                      >
                        📖
                      </div>
                    )}
                  </td>
                  <td>
                    <strong>{b.title}</strong>
                  </td>
                  <td>{b.author.full_name}</td>
                  <td>
                    <span className="tag">{b.genre.name}</span>
                  </td>
                  <td>{b.year}</td>
                  <td>
                    <MediaBadge type={b.media_type} />
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {Number(b.retail_price).toFixed(2)} ₽
                  </td>
                  <td>
                    <StockBadge stock={b.stock} />
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        className="btn btn--icon"
                        title="Редактировать"
                        onClick={() => {
                          setModal({ mode: "edit", book: b });
                          setError("");
                        }}
                      >
                        Редактировать
                      </button>
                      <button
                        className="btn btn--icon"
                        title="Удалить"
                        onClick={() => {
                          setModal({ mode: "delete", book: b });
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

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modal?.mode === "add" || modal?.mode === "edit"}
        onClose={() => {
          setModal(null);
          setError("");
        }}
        title={modal?.mode === "add" ? "Добавить книгу" : "Редактировать книгу"}
      >
        {error && (
          <div className="alert alert--error" style={{ marginBottom: 16 }}>
            {error}
          </div>
        )}
        <BookForm
          initial={modal?.book}
          authors={authors}
          genres={genres}
          onSubmit={handleSave}
          onCancel={() => {
            setModal(null);
            setError("");
          }}
          saving={saving}
        />
      </Modal>

      {/* Delete Confirm */}
      <Modal
        isOpen={modal?.mode === "delete"}
        onClose={() => setModal(null)}
        title="Удалить книгу"
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
              {saving ? "Удаляем..." : "Удалить"}
            </button>
          </>
        }
      >
        <p>
          Вы уверены, что хотите удалить книгу{" "}
          <strong>«{modal?.book?.title}»</strong>?
        </p>
        <p style={{ marginTop: 8, fontSize: ".875rem", color: "#9A8878" }}>
          Это действие нельзя отменить.
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
