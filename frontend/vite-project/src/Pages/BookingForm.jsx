import React, { useState, useEffect } from 'react'
import './BookingForm.css'

function BookingForm({ user, onSuccess }) {
  const [masters, setMasters] = useState([])
  const [formData, setFormData] = useState({
    id_master: '',
    booking_date: '',
    booking_time: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const timeSlots = []
  for (let hour = 8; hour <= 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`)
  }

  useEffect(() => {
    fetchMasters()
  }, [])

  const fetchMasters = async () => {
    try {
      const response = await fetch('/api/masters')
      const data = await response.json()
      setMasters(data)
    } catch (err) {
      setError('Ошибка загрузки мастеров')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.id_master || !formData.booking_date || !formData.booking_time) {
      setError('Пожалуйста, заполните все поля')
      return
    }
    
    const booking_datetime = `${formData.booking_date} ${formData.booking_time}:00`
    setLoading(true)

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user: user.id,
          id_master: parseInt(formData.id_master),
          booking_datetime: booking_datetime
        })
      })
      const data = await response.json()
      
      if (response.ok) {
        setSuccess('Заявка успешно создана!')
        setFormData({ id_master: '', booking_date: '', booking_time: '' })
        if (onSuccess) onSuccess()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Ошибка создания заявки')
      }
    } catch (err) {
      setError('Ошибка соединения с сервером')
    } finally {
      setLoading(false)
    }
  }

  const minDate = new Date().toISOString().split('T')[0]

  return (
    <div className="application-container">
      <div className="application-card">
        <h2>Новая запись</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Выберите мастера</label>
            <select name="id_master" value={formData.id_master} onChange={handleChange} required>
              <option value="">Выберите мастера</option>
              {masters.map(master => (
                <option key={master.id} value={master.id}>{master.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Дата</label>
            <input 
              type="date" 
              name="booking_date" 
              value={formData.booking_date} 
              onChange={handleChange} 
              min={minDate}
              required 
            />
          </div>
          <div className="form-group">
            <label>Время (8:00 - 18:00)</label>
            <select name="booking_time" value={formData.booking_time} onChange={handleChange} required>
              <option value="">Выберите время</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Отправка...' : 'Записаться'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default BookingForm