import { useState, useEffect } from "react"

export default function AdminPanel() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/requests')
      if (!response.ok) throw new Error("Ошибка загрузки")
      const data = await response.json()
      setRequests(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (requestId, statusCode) => {
    setUpdating(requestId)
    try {
      const response = await fetch(`http://localhost:5000/api/requests/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_code: statusCode })
      })

      if (response.ok) {
        fetchRequests() // Обновляем список
      }
    } catch (err) {
      console.error("Ошибка обновления:", err)
    } finally {
      setUpdating(null)
    }
  }

  const getStatusClass = (statusCode) => {
    switch(statusCode) {
      case 'new': return 'status-new'
      case 'confirmed': return 'status-confirmed'
      case 'canceled': return 'status-rejected'
      default: return ''
    }
  }

  const getStatusText = (statusName, statusCode) => {
    if (statusName) return statusName
    switch(statusCode) {
      case 'new': return 'Новое'
      case 'confirmed': return 'Подтверждено'
      case 'canceled': return 'Отменено'
      default: return statusCode
    }
  }

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>
  }

  return (
    <div className="container">
      <div className="admin-panel">
        <h2 style={{ marginBottom: '20px' }}>Панель администратора</h2>
        <h3 style={{ marginBottom: '20px' }}>Все заявки</h3>
        
        {error && <div className="error">{error}</div>}
        
        {requests.length === 0 ? (
          <p>Нет заявок</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Телефон</th>
                <th>Дата и время</th>
                <th>Мастер</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.user_name}</td>
                  <td>{request.user_phone}</td>
                  <td>{new Date(request.booking_datetime).toLocaleString()}</td>
                  <td>{request.master_name}</td>
                  <td className={getStatusClass(request.status_code)}>
                    {getStatusText(request.status_name, request.status_code)}
                  </td>
                  <td>
                    {request.status_code === 'new' && (
                      <>
                        <button
                          onClick={() => updateStatus(request.id, 'confirmed')}
                          className="btn btn-success"
                          style={{ marginRight: '5px' }}
                          disabled={updating === request.id}
                        >
                          Подтвердить
                        </button>
                        <button
                          onClick={() => updateStatus(request.id, 'canceled')}
                          className="btn btn-danger"
                          disabled={updating === request.id}
                        >
                          Отменить
                        </button>
                      </>
                    )}
                    {request.status_code !== 'new' && (
                      <span>
                        {request.status_code === 'confirmed' ? '✓ Подтверждено' : 
                         request.status_code === 'canceled' ? '✗ Отменено' : ''}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}