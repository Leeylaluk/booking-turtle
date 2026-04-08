import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function Login({ onLogin }) {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      })

      const data = await response.json()

      if (response.ok) {
        onLogin(data.user)
        navigate("/")
      } else {
        setError(data.error || "Неверный логин или пароль")
      }
    } catch (err) {
      setError("Ошибка соединения с сервером")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Вход в систему</h2>
        
        {error && <div className="error" style={{ textAlign: 'center', marginBottom: '15px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Логин</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Введите логин"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
        
        <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: '#999' }}>
          Админ: beauty / pass
        </p>
      </div>
    </div>
  )
}