import { Link } from "react-router-dom"

export default function Header({ user, onLogout }) {
  return (
    <div className="container">
      <header className="header">
        <Link to="/" className="logo">
          💅 Записываемся на ноготочки
        </Link>
        <nav className="nav">
          {user ? (
            <>
              <span className="user-name">Привет, {user.name}</span>
              <Link to="/" className="nav-link">Мои записи</Link>
              <Link to="/booking/new" className="nav-link">Новая запись</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link">Админ панель</Link>
              )}
              <button onClick={onLogout} className="btn btn-secondary">Выйти</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Войти</Link>
              <Link to="/register" className="nav-link">Регистрация</Link>
            </>
          )}
        </nav>
      </header>
    </div>
  )
}