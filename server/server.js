require('dotenv').config()
const cors = require('cors')
const express = require('express')
const connectDB = require('./config/db')
const userRoutes = require('./auth/userRoutes')


const app = express()
const PORT = process.env.PORT || 8000

connectDB()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/auth', userRoutes)

// App listen
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))