import React, { useState } from 'react'
import './Register.css'

function Register({ switchToLogin }) {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    full_name: '',
    phone: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const validateForm = () => {
    const loginRegex = /^[a-zA-Z0-9]{4,}$/
    if (!loginRegex.test(formData.login)) {
      setError('Логин должен содержать минимум 4 символов (латиница и цифры)')
      return false
    }
    if (formData.password.length < 4) {
      setError('Пароль должен содержать минимум 4 символов')
      return false
    }
    const nameRegex = /^[а-яА-ЯёЁ\s]+$/
    if (!nameRegex.test(formData.full_name)) {
      setError('ФИО должно содержать только русские буквы и пробелы')
      return false
    }
    const phoneRegex = /^\d{11}$/
    if (!phoneRegex.test(formData.phone)) {
      setError('Телефон должен содержать 11 цифр (например: 79111234567)')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      
      if (response.ok) {
        setSuccess('Регистрация успешна! Перенаправление на вход...')
        setTimeout(() => switchToLogin(), 2000)
      } else {
        setError(data.error || 'Ошибка регистрации')
      }
    } catch (err) {
      setError('Ошибка соединения с сервером')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Логин (мин. 4 символа, латиница + цифры)</label>
            <input type="text" name="login" value={formData.login} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Пароль (мин. 4 символа)</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>ФИО (русские буквы)</label>
            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Телефон (11 цифр, например: 79111234567)</label>
            <input type="tel" name="phone" placeholder="79111234567" value={formData.phone} onChange={handleChange} required />
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        <p className="switch-link">
          Уже есть аккаунт? <button onClick={switchToLogin}>Войти</button>
        </p>
      </div>
    </div>
  )
}

export default Register