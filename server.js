const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())

// ================= CONNECT DB =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err))

// ================= ORDER MODEL =================
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


// ================= PRODUCT MODEL =================
const ProductSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String,
  description: String
})

const Product = mongoose.model("Product", ProductSchema)


// ================= CREATE ORDER =================
app.post("/api/orders/create", async (req, res) => {
  try {
    const order = new Order(req.body)
    await order.save()
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: "Create failed" })
  }
})


// ================= GET ORDERS =================
app.get("/api/orders", async (req, res) => {
  const orders = await Order.find().sort({ _id: -1 })
  res.json(orders)
})


// ================= UPDATE ORDER =================
app.put("/api/orders/:id", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
    res.json(updated)
  } catch {
    res.status(500).json({ error: "Update failed" })
  }
})


// ================= DELETE ORDER =================
app.delete("/api/orders/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: "Delete failed" })
  }
})


// ================= DASHBOARD =================
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
  } catch {
    res.status(500).json({ error: "Dashboard error" })
  }
})


// ================= ADD PRODUCT =================
app.post("/api/products", async (req, res) => {
  try {
    const product = new Product(req.body)
    await product.save()
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: "Product add failed" })
  }
})


// ================= GET PRODUCTS =================
app.get("/api/products", async (req, res) => {
  const products = await Product.find().sort({ _id: -1 })
  res.json(products)
})


// ================= START SERVER =================
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on ${PORT} 🚀`)
})