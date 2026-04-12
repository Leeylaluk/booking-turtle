import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

export default function Bookings({ user }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/requests/user/${user.id}`)
      if (!response.ok) throw new Error("Ошибка загрузки")
      const data = await response.json()
      setRequests(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <h2>Мои записи</h2>
        <Link to="/booking/new" className="btn btn-primary">Новая запись</Link>
      </div>
      
      {error && <div className="error" style={{ marginTop: '20px' }}>{error}</div>}
      
      {requests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>У вас пока нет записей</p>
          <Link to="/booking/new" className="btn btn-primary" style={{ marginTop: '10px' }}>Создать запись</Link>
        </div>
      ) : (
        <div className="card" style={{ marginTop: '20px' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Дата и время</th>
                <th>Мастер</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{new Date(request.booking_datetime).toLocaleString()}</td>
                  <td>{request.master_name}</td>
                  <td className={getStatusClass(request.status_code)}>
                    {getStatusText(request.status_name, request.status_code)}
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}