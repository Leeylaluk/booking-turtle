import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import Header from "./Components/Header"
import Footer from "./Components/Footer"
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import Bookings from "./Pages/Bookings"
import BookingForm from "./Pages/BookingForm"
import AdminPanel from "./Pages/AdminPanel"
import PrivateRoute from "./Components/PrivateRoute"
import AdminRoute from "./Components/AdminRoute"

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <BrowserRouter>
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <PrivateRoute user={user}>
            <Bookings user={user} />
          </PrivateRoute>
        } />
        <Route path="/booking/new" element={
          <PrivateRoute user={user}>
            <BookingForm user={user} />
          </PrivateRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute user={user}>
            <AdminPanel />
          </AdminRoute>
        } />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App