const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())

// ✅ MONGODB CONNECT
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err))

// ✅ ORDER SCHEMA
const OrderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  items: Array,
  total: Number,
  status: {
    type: String,
    default: "Pending"
  }
})

const Order = mongoose.model("Order", OrderSchema)


// ==========================
// ✅ CREATE ORDER
// ==========================
app.post("/api/orders/create", async (req, res) => {
  try {
    const order = new Order(req.body)
    await order.save()
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" })
  }
})


// ==========================
// ✅ GET ALL ORDERS
// ==========================
app.get("/api/orders", async (req, res) => {
  const orders = await Order.find().sort({ _id: -1 })
  res.json(orders)
})


// ==========================
// ✅ UPDATE ORDER STATUS (FIXED)
// ==========================
app.put("/api/orders/:id", async (req, res) => {
  try {
    const { status } = req.body

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    )

    res.json(updatedOrder)
  } catch (err) {
    res.status(500).json({ error: "Failed to update order" })
  }
})


// ==========================
// ✅ DELETE ORDER
// ==========================
app.delete("/api/orders/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: "Delete failed" })
  }
})


// ==========================
// ✅ DASHBOARD API
// ==========================
app.get("/api/dashboard", async (req, res) => {
  try {
    const orders = await Order.find()

    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
    const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0

    res.json({
      totalOrders,
      totalRevenue,
      avgOrderValue
    })
  } catch (err) {
    res.status(500).json({ error: "Dashboard error" })
  }
})


// ==========================
// ✅ START SERVER
// ==========================
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on ${PORT} 🚀`)
})