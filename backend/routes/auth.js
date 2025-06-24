const express = require("express")
const { signup, login, getProfile } = require("../controllers/authController")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.get("/profile", authMiddleware, getProfile)

module.exports = router
