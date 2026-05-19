import React, { useState, useEffect } from 'react'
import './AdminPanel.css'

function AdminPanel() {
  const [requests, setRequests] = useState([])
  const [statuses, setStatuses] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
    fetchStatuses()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/admin/requests')
      const data = await response.json()
      setRequests(data)
    } catch (err) {
      setError('Ошибка загрузки записей')
    } finally {
      setLoading(false)
    }
  }

  const fetchStatuses = async () => {
    try {
      const response = await fetch('/api/statuses')
      const data = await response.json()
      setStatuses(data)
    } catch (err) {
      setError('Ошибка загрузки статусов')
    }
  }

  const updateStatus = async (requestId, newStatusId) => {
    try {
      const response = await fetch(`/api/admin/requests/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_id: parseInt(newStatusId) })
      })
      const data = await response.json()
      if (response.ok) {
        setSuccess('Статус обновлен')
        fetchRequests()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Ошибка обновления статуса')
      }
    } catch (err) {
      setError('Ошибка соединения с сервером')
    }
  }

  const getFilteredRequests = () => {
    if (filter === 'all') return requests
    return requests.filter(req => req.status_code === filter)
  }

  const getStatusClass = (statusCode) => {
    switch(statusCode) {
      case 'new': return 'status-new'
      case 'confirmed': return 'status-confirmed'
      case 'canceled': return 'status-canceled'
      default: return ''
    }
  }

  const formatDateTime = (datetime) => {
    if (!datetime) return '—'
    const date = new Date(datetime)
    return `${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
  }

  if (loading) return <div className="loading">Загрузка...</div>

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Панель администратора</h2>
        <div className="filter-section">
          <label>Фильтр по статусу:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Все записи</option>
            <option value="new">Новые</option>
            <option value="confirmed">Подтверждено</option>
            <option value="canceled">Отменено</option>
          </select>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-number">{requests.length}</span>
          <span className="stat-label">Всего записей</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{requests.filter(r => r.status_code === 'new').length}</span>
          <span className="stat-label">Новых</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{requests.filter(r => r.status_code === 'confirmed').length}</span>
          <span className="stat-label">Подтверждено</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{requests.filter(r => r.status_code === 'canceled').length}</span>
          <span className="stat-label">Отменено</span>
        </div>
      </div>
      
      <div className="requests-table-container">
        <table className="requests-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Клиент</th>
              <th>Телефон</th>
              <th>Мастер</th>
              <th>Дата и время</th>
              <th>Статус</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredRequests().map(req => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>
                  <div className="user-info">
                    <strong>{req.full_name}</strong>
                    <small>{req.login}</small>
                  </div>
                </td>
                <td>{req.phone}</td>
                <td>{req.master_name}</td>
                <td>{formatDateTime(req.booking_datetime)}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(req.status_code)}`}>
                    {req.status_name}
                  </span>
                </td>
                <td>
                  <select
                    value={req.id_status}
                    onChange={(e) => updateStatus(req.id, e.target.value)}
                    className="status-select"
                  >
                    {statuses.map(status => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminPanel