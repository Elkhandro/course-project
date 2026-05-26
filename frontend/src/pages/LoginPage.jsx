import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/services';
import { useAuth } from '../context/AuthContext';
import './LoginPage.scss';

export default function LoginPage() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form.username, form.password);
      setToken(res.data.access_token);
      navigate('/staff/books');
    } catch (err) {
      setError(err.response?.data?.detail || 'Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <div className="login-card__icon">📚</div>
          <h1 className="login-card__title">Вход в систему</h1>
          <p className="login-card__sub">Панель сотрудника книжного магазина</p>
        </div>

        {error && <div className="alert alert--error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Имя пользователя</label>
            <input
              className="input"
              type="text"
              placeholder="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Пароль</label>
            <input
              className="input"
              type="password"
              placeholder="••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button className="btn btn--primary login-card__submit" type="submit" disabled={loading}>
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>

        <div className="login-card__footer">
          <span>Нет аккаунта?</span>
          <a href="/register">Зарегистрироваться</a>
        </div>
      </div>
    </div>
  );
}
