import React, { useState } from 'react'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Bookings from './Pages/Bookings'
import BookingForm from './Pages/BookingForm'
import AdminPanel from './Pages/AdminPanel'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('login')

  const handleLogin = (userData) => {
    setUser(userData)
    setCurrentPage('home')
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentPage('login')
  }

  const renderContent = () => {
    if (!user) {
      if (currentPage === 'register') {
        return <Register switchToLogin={() => setCurrentPage('login')} />
      }
      return <Login onLogin={handleLogin} switchToRegister={() => setCurrentPage('register')} />
    }

    return (
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>Записываемся на ноготочки</h1>
          </div>
          <div className="nav-menu">
            <button
              className={currentPage === 'home' ? 'active' : ''}
              onClick={() => setCurrentPage('home')}
            >
              Новая запись
            </button>
            <button
              className={currentPage === 'my-apps' ? 'active' : ''}
              onClick={() => setCurrentPage('my-apps')}
            >
              Мои записи
            </button>
            {user.role === 'admin' && (
              <button
                className={currentPage === 'admin' ? 'active' : ''}
                onClick={() => setCurrentPage('admin')}
              >
              Админ панель
              </button>
            )}
            <div className="user-info">
              <span>{user.full_name}</span>
              <button onClick={handleLogout} className="logout-btn">
                Выйти
              </button>
            </div>
          </div>
        </nav>
        <div className="page-content">
          {currentPage === 'home' && <BookingForm user={user} />}
          {currentPage === 'my-apps' && <Bookings user={user} />}
          {currentPage === 'admin' && user.role === 'admin' && <AdminPanel />}
        </div>
      </div>
    )
  }

  return <div className="App">{renderContent()}</div>
}

export default App