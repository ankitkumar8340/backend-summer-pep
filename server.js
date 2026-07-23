require("dotenv").config();
const express = require('express');

const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const app = express();
connectDB();

app.use(cors({origin:process.env.CLIENT_URI || "http://localhost:5173"}));
app.use(express.json());
app.use("/api/auth",authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`GeoExplorer API is running on ${PORT}`));










