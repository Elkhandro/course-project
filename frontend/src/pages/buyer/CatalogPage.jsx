import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getBooks, getAuthors, getGenres } from "../../api/services";
import { Loading, EmptyState } from "../../components/ui/States";
import { StockBadge } from "../../components/ui/Badges";
import BookDetailModal from "../../components/books/BookDetailModal";
import "./CatalogPage.scss";

const API_URL =
  import.meta.env.VITE_API_URL?.replace("/api/v1", "") ||
  "http://localhost:8000";

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [search, setSearch] = useState("");

  const genreId = searchParams.get("genre_id") || "";
  const authorId = searchParams.get("author_id") || "";
  const outOfStock = searchParams.get("out_of_stock") === "true";

  useEffect(() => {
    Promise.all([getAuthors(), getGenres()]).then(([a, g]) => {
      setAuthors(a.data);
      setGenres(g.data);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (genreId) params.genre_id = genreId;
    if (authorId) params.author_id = authorId;
    if (outOfStock) params.out_of_stock = true;
    getBooks(params)
      .then((res) => setBooks(res.data))
      .finally(() => setLoading(false));
  }, [genreId, authorId, outOfStock]);

  const setFilter = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val);
    else p.delete(key);
    setSearchParams(p);
  };

  const filtered = books.filter(
    (b) =>
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.full_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="catalog-page">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Каталог книг</h1>
          <div className="page-header__subtitle">
            {filtered.length} {pluralBooks(filtered.length)}
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <span className="filter-bar__label">Фильтры</span>
        <input
          type="search"
          placeholder="🔍 Поиск по названию или автору..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: 240 }}
        />
        <select
          value={genreId}
          onChange={(e) => setFilter("genre_id", e.target.value)}
        >
          <option value="">Все жанры</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <select
          value={authorId}
          onChange={(e) => setFilter("author_id", e.target.value)}
        >
          <option value="">Все авторы</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.full_name}
            </option>
          ))}
        </select>
        <label className="catalog-page__toggle">
          <input
            type="checkbox"
            checked={outOfStock}
            onChange={(e) =>
              setFilter("out_of_stock", e.target.checked ? "true" : "")
            }
          />
          Нет в наличии
        </label>
        {(genreId || authorId || outOfStock || search) && (
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => {
              setSearchParams({});
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
          icon="📭"
          title="Ничего не найдено"
          text="Попробуйте изменить фильтры"
        />
      ) : (
        <div className="book-grid">
          {filtered.map((book) => (
            <div
              key={book.id}
              className="book-card card card--hover"
              onClick={() => setSelectedBook(book)}
            >
              <div className="book-card__cover">
                {book.cover_image ? (
                  <img
                    src={`${API_URL}/${book.cover_image}`}
                    alt={book.title}
                    className="book-card__cover-img"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                {/* Заглушка — показывается если нет обложки или ошибка загрузки */}
                <div
                  className="book-card__cover-fallback"
                  style={{ display: book.cover_image ? "none" : "flex" }}
                >
                  <span className="book-card__cover-icon">
                    {book.media_type === "audio"
                      ? "🎧"
                      : book.media_type === "ebook"
                        ? "💻"
                        : "📖"}
                  </span>
                </div>
              </div>
              <div className="book-card__body">
                <div className="book-card__genre">{book.genre.name}</div>
                <h3 className="book-card__title">{book.title}</h3>
                <div className="book-card__author">{book.author.full_name}</div>
                <div className="book-card__footer">
                  <div className="book-card__price">
                    {Number(book.retail_price).toFixed(2)} ₽
                  </div>
                  <StockBadge stock={book.stock} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}

function pluralBooks(n) {
  if (n % 10 === 1 && n % 100 !== 11) return "книга";
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100))
    return "книги";
  return "книг";
}
