import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function Register() {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    login: "",
    password: "",
    confirmPassword: ""
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают")
      return
    }

    if (formData.password.length < 4) {
      setError("Пароль должен быть минимум 4 символа")
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          phone: formData.phone,
          login: formData.login,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Регистрация успешна! Теперь можете войти.")
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        setError(data.error || "Ошибка при регистрации")
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
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Регистрация</h2>
        
        {error && <div className="error" style={{ textAlign: 'center', marginBottom: '15px' }}>{error}</div>}
        {success && <div className="success" style={{ textAlign: 'center', marginBottom: '15px' }}>{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ФИО *</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Иванов Иван Иванович"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Телефон *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+7 (999) 123-45-67"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Логин *</label>
            <input
              type="text"
              name="login"
              value={formData.login}
              onChange={handleChange}
              placeholder="Введите логин"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Пароль *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Минимум 4 символа"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Подтвердите пароль *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Повторите пароль"
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  )
}