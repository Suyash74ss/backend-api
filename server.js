"use client"

import { useEffect, useState } from "react"
import axios from "axios"

export default function AdminPage() {

  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0
  })
  const [open, setOpen] = useState(true)

  // FETCH
  const fetchOrders = async () => {
    const res = await axios.get("https://backend-api-i2oh.onrender.com/api/orders")
    setOrders(res.data)
  }

  const fetchDashboard = async () => {
    const res = await axios.get("https://backend-api-i2oh.onrender.com/api/dashboard")
    setStats(res.data)
  }

  useEffect(() => {
    fetchOrders()
    fetchDashboard()
  }, [])

  const deleteOrder = async (id: string) => {
    await axios.delete(`https://backend-api-i2oh.onrender.com/api/orders/${id}`)
    fetchOrders()
    fetchDashboard()
  }

  const updateStatus = async (id: string) => {
    await axios.put(`https://backend-api-i2oh.onrender.com/api/orders/${id}`, { status: "Delivered" })
    fetchOrders()
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0d0d0d", color: "#fff" }}>

      {/* SIDEBAR */}
      <div style={{
        width: open ? "240px" : "70px",
        background: "#111",
        padding: "20px",
        transition: "0.3s"
      }}>
        <h2>⚡</h2>

        <div style={{ marginTop: "30px" }}>
          <p>📊 Dashboard</p>
          <p>📦 Orders</p>
          <p>🛒 Products</p>
          <p>👤 Users</p>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "20px" }}>

        {/* TOP BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>

          <button onClick={() => setOpen(!open)} style={{
            fontSize: "22px",
            background: "transparent",
            color: "#fff",
            border: "none"
          }}>
            ☰
          </button>

          <button style={{
            background: "linear-gradient(45deg,#00c853,#64dd17)",
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            color: "#fff"
          }}>
            + Add Product
          </button>
        </div>

        {/* CARDS */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>

          <div style={cardStyle}>
            <h3>Orders</h3>
            <h1>{stats.totalOrders}</h1>
          </div>

          <div style={cardStyle}>
            <h3>Revenue</h3>
            <h1>₹{stats.totalRevenue}</h1>
          </div>

          <div style={cardStyle}>
            <h3>Avg</h3>
            <h1>₹{Math.round(stats.avgOrderValue)}</h1>
          </div>

        </div>

        {/* ORDERS */}
        {orders.map((order) => (
          <div key={order._id} style={orderStyle}>
            <p>{order.name} - ₹{order.total}</p>

            <div>
              <button onClick={() => updateStatus(order._id)} style={greenBtn}>
                Delivered
              </button>

              <button onClick={() => deleteOrder(order._id)} style={redBtn}>
                Delete
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}


// 🔥 STYLES
const cardStyle = {
  flex: 1,
  padding: "20px",
  borderRadius: "15px",
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(10px)"
}

const orderStyle = {
  background: "#1a1a1a",
  padding: "15px",
  marginBottom: "10px",
  borderRadius: "10px",
  display: "flex",
  justifyContent: "space-between"
}

const greenBtn = {
  background: "#00c853",
  border: "none",
  padding: "8px",
  color: "#fff",
  marginRight: "10px"
}

const redBtn = {
  background: "#d50000",
  border: "none",
  padding: "8px",
  color: "#fff"
}