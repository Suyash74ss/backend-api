require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔥 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("Mongo Error ❌:", err));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// ✅ Order Schema
const OrderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  items: Array,
  total: Number
});

const Order = mongoose.model("Order", OrderSchema);

// ✅ Create Order API
app.post("/api/orders/create", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    res.json({ success: true, message: "Order saved" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Order failed" });
  }
});

// ✅ Get All Orders API
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ _id: -1 });
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// 🚀 Start server
app.listen(5000, () => {
  console.log("Server running on 5000 🚀");
});

// ❌ Delete Order
app.delete("/api/orders/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});