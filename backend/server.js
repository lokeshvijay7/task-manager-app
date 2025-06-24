const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db.js")

dotenv.config()
connectDB()
const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", require("./routes/auth.js"))
// app.use("/api/tasks", require("./routes/tasks.js"))
app.get("/", (req, res) => {
  res.json({ message: "Task Manager API is running!" })
})
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
