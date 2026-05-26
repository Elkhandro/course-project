import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.scss';

const staffNav = [
  { to: '/staff/books',     label: 'Книги',     icon: '📚' },
  { to: '/staff/authors',   label: 'Авторы',    icon: '✍️'  },
  { to: '/staff/genres',    label: 'Жанры',     icon: '🏷️'  },
  { to: '/staff/sales',     label: 'Продажи',   icon: '🛒'  },
  { to: '/staff/orders',    label: 'Заказы',    icon: '📦'  },
  { to: '/staff/analytics', label: 'Аналитика', icon: '📊'  },
];

const buyerNav = [
  { to: '/catalog', label: 'Каталог', icon: '📖' },
];

export default function Sidebar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const nav = isAuthenticated ? staffNav : buyerNav;

  return (
    <aside className="sidebar">
      <div className="sidebar__brand" onClick={() => navigate('/')}>
        <span className="sidebar__brand-icon">📚</span>
        <div>
          <div className="sidebar__brand-name">Книжный</div>
          <div className="sidebar__brand-sub">магазин</div>
        </div>
      </div>

      <nav className="sidebar__nav">
        <div className="sidebar__section-label">
          {isAuthenticated ? 'Сотрудник' : 'Покупатель'}
        </div>
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              'sidebar__link' + (isActive ? ' sidebar__link--active' : '')
            }
          >
            <span className="sidebar__link-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        {!isAuthenticated && (
          <>
            <div className="sidebar__divider" />
            <NavLink to="/catalog?out_of_stock=true" className="sidebar__link">
              <span className="sidebar__link-icon">🔍</span>
              <span>Нет в наличии</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar__footer">
        {isAuthenticated ? (
          <button className="sidebar__logout" onClick={() => { logout(); navigate('/'); }}>
            <span>🚪</span> Выйти
          </button>
        ) : (
          <NavLink to="/login" className="sidebar__login-btn">
            <span>🔑</span> Войти как сотрудник
          </NavLink>
        )}
      </div>
    </aside>
  );
}
