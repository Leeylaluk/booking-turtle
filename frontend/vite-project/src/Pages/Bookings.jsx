import React, { useState, useEffect } from 'react'
import './Bookings.css'

function Bookings({ user }) {
  const [requests, setRequests] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch(`/api/requests/user/${user.id}`)
      const data = await response.json()
      setRequests(data)
    } catch (err) {
      setError('Ошибка загрузки записей')
    } finally {
      setLoading(false)
    }
  }

  const getStatusClass = (statusCode) => {
    switch(statusCode) {
      case 'new': return 'status-new'
      case 'confirmed': return 'status-confirmed'
      case 'canceled': return 'status-canceled'
      default: return ''
    }
  }

  const getStatusText = (statusName) => {
    return statusName
  }

  const formatDateTime = (datetime) => {
    if (!datetime) return '—'
    const date = new Date(datetime)
    return `${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
  }


  return (
    <div className="applications-container">
      <div className="applications-header">
        <h2>Мои записи</h2>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {requests.length === 0 ? (
        <div className="no-applications">
          <p>У вас пока нет записей</p>
          <p>Нажмите "Создать заявку" чтобы записаться</p>
        </div>
      ) : (
        <div className="applications-list">
          {requests.map(req => (
            <div key={req.id} className="application-card-item">
              <div className="application-header">
                <h3>{req.master_name}</h3>
                <span className={`status-badge ${getStatusClass(req.status_code)}`}>
                  {getStatusText(req.status_name)}
                </span>
              </div>
              <div className="application-details">
                <p><strong>Дата и время:</strong> {formatDateTime(req.booking_datetime)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Bookings