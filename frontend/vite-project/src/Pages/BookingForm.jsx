import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function BookingForm({ user }) {
  const [masters, setMasters] = useState([])
  const [formData, setFormData] = useState({
    id_master: "",
    booking_date: "",
    booking_time: "10:00"
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchMasters()
  }, [])

  const fetchMasters = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/masters')
      const data = await response.json()
      setMasters(data)
    } catch (err) {
      console.error("Ошибка загрузки мастеров:", err)
    }
  }

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
    setLoading(true)

    const bookingDateTime = `${formData.booking_date} ${formData.booking_time}:00`

    try {
      const response = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user: user.id,
          id_master: formData.id_master,
          booking_datetime: bookingDateTime
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Заявка успешно создана!")
        setTimeout(() => {
          navigate("/")
        }, 2000)
      } else {
        setError(data.error || "Ошибка при создании заявки")
      }
    } catch (err) {
      setError("Ошибка соединения с сервером")
    } finally {
      setLoading(false)
    }
  }

  // Генерация часов от 8 до 20
  const timeOptions = []
  for (let i = 8; i <= 20; i++) {
    const hour = i.toString().padStart(2, '0')
    timeOptions.push(`${hour}:00`)
    timeOptions.push(`${hour}:30`)
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Новая запись</h2>
        
        {error && <div className="error" style={{ textAlign: 'center', marginBottom: '15px' }}>{error}</div>}
        {success && <div className="success" style={{ textAlign: 'center', marginBottom: '15px' }}>{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Выберите мастера *</label>
            <select
              name="id_master"
              value={formData.id_master}
              onChange={handleChange}
              required
            >
              <option value="">Выберите мастера</option>
              {masters.map((master) => (
                <option key={master.id} value={master.id}>
                  {master.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Дата *</label>
            <input
              type="date"
              name="booking_date"
              value={formData.booking_date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Время *</label>
            <select
              name="booking_time"
              value={formData.booking_time}
              onChange={handleChange}
              required
            >
              {timeOptions.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? "Создание..." : "Записаться"}
          </button>
        </form>
      </div>
    </div>
  )
}