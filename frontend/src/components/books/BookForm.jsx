import { useState } from "react";
import "./BookForm.scss";

const MEDIA_TYPES = [
  { value: "paperback", label: "Мягкая обложка" },
  { value: "hardcover", label: "Твёрдая обложка" },
  { value: "ebook", label: "Электронная" },
  { value: "audio", label: "Аудиокнига" },
];

const empty = {
  title: "",
  year: new Date().getFullYear(),
  pages: "",
  media_type: "paperback",
  wholesale_price: "",
  retail_price: "",
  stock: 0,
  author_id: "",
  genre_id: "",
};

const API_URL =
  import.meta.env.VITE_API_URL?.replace("/api/v1", "") ||
  "http://localhost:8000";

export default function BookForm({
  initial,
  authors,
  genres,
  onSubmit,
  onCancel,
  saving,
}) {
  const [form, setForm] = useState(() =>
    initial
      ? {
          title: initial.title,
          year: initial.year,
          pages: initial.pages || "",
          media_type: initial.media_type,
          wholesale_price: initial.wholesale_price,
          retail_price: initial.retail_price,
          stock: initial.stock,
          author_id: initial.author?.id || "",
          genre_id: initial.genre?.id || "",
        }
      : empty,
  );

  // Состояние обложки
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(
    initial?.cover_image ? `${API_URL}/${initial.cover_image}` : null,
  );

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    // Локальный предпросмотр
    const reader = new FileReader();
    reader.onload = (ev) => setCoverPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(
      {
        ...form,
        year: Number(form.year),
        pages: Number(form.pages),
        wholesale_price: String(form.wholesale_price),
        retail_price: String(form.retail_price),
        stock: Number(form.stock),
        author_id: Number(form.author_id),
        genre_id: Number(form.genre_id),
      },
      coverFile, // передаём файл отдельно
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Обложка */}
      <div className="form-group">
        <label>Обложка книги</label>
        <div className="cover-upload">
          {coverPreview ? (
            <div className="cover-upload__preview">
              <img src={coverPreview} alt="Обложка" />
              <button
                type="button"
                className="cover-upload__remove"
                onClick={removeCover}
                title="Удалить"
              >
                ✕
              </button>
            </div>
          ) : (
            <label className="cover-upload__drop">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCoverChange}
                style={{ display: "none" }}
              />
              <span className="cover-upload__icon"></span>
              <span className="cover-upload__hint">Нажмите для выбора</span>
              <span className="cover-upload__formats">JPG, PNG, WEBP</span>
            </label>
          )}
        </div>
      </div>

      <div className="form-group">
        <label>Название *</label>
        <input
          className="input"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          required
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="form-group">
          <label>Автор *</label>
          <select
            className="select"
            value={form.author_id}
            onChange={(e) => set("author_id", e.target.value)}
            required
          >
            <option value="">Выберите...</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.full_name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Жанр *</label>
          <select
            className="select"
            value={form.genre_id}
            onChange={(e) => set("genre_id", e.target.value)}
            required
          >
            <option value="">Выберите...</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}
      >
        <div className="form-group">
          <label>Год *</label>
          <input
            className="input"
            type="number"
            min="1000"
            max="2100"
            value={form.year}
            onChange={(e) => set("year", e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Страниц *</label>
          <input
            className="input"
            type="number"
            min="1"
            value={form.pages}
            onChange={(e) => set("pages", e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Остаток</label>
          <input
            className="input"
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => set("stock", e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Тип носителя *</label>
        <select
          className="select"
          value={form.media_type}
          onChange={(e) => set("media_type", e.target.value)}
          required
        >
          {MEDIA_TYPES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="form-group">
          <label>Оптовая цена (₽) *</label>
          <input
            className="input"
            type="number"
            step="0.01"
            min="0.01"
            value={form.wholesale_price}
            onChange={(e) => set("wholesale_price", e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Розничная цена (₽) *</label>
          <input
            className="input"
            type="number"
            step="0.01"
            min="0.01"
            value={form.retail_price}
            onChange={(e) => set("retail_price", e.target.value)}
            required
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
          marginTop: 8,
        }}
      >
        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          Отмена
        </button>
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? "Сохраняем..." : "Сохранить"}
        </button>
      </div>
    </form>
  );
}
