import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.scss';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="home-hero__icon">📚</div>
        <h1 className="home-hero__title">Книжный магазин</h1>
        <p className="home-hero__sub">
          Информационная система управления книжным магазином
        </p>
        <div className="home-hero__actions">
          <button className="btn btn--primary" onClick={() => navigate('/catalog')}>
            📖 Перейти в каталог
          </button>
          {!isAuthenticated ? (
            <button className="btn btn--secondary" onClick={() => navigate('/login')}>
              🔑 Войти как сотрудник
            </button>
          ) : (
            <button className="btn btn--secondary" onClick={() => navigate('/staff/books')}>
              ⚙️ Панель сотрудника
            </button>
          )}
        </div>
      </div>

      <div className="home-features">
        {FEATURES.map((f) => (
          <div key={f.title} className="home-feature card">
            <div className="home-feature__icon">{f.icon}</div>
            <div className="home-feature__title">{f.title}</div>
            <div className="home-feature__text">{f.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const FEATURES = [
  { icon: '📖', title: 'Каталог книг',    text: 'Удобный поиск и фильтрация по жанрам и авторам' },
  { icon: '🛒', title: 'Учёт продаж',     text: 'Оформление продаж с автоматическим обновлением склада' },
  { icon: '📦', title: 'Заказы',          text: 'Ведение заказов на отсутствующие книги' },
  { icon: '📊', title: 'Аналитика',       text: 'Статистика выручки, топ авторы и анализ цен' },
];
