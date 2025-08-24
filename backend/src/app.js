import express from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser';
import dotenv from "dotenv"
dotenv.config({
  path: './.env'
})
const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,  
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"})) 
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js';
import plantRouter from './routes/plant.routes.js';
import cartRouter from './routes/cart.routes.js';

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/plants", plantRouter);
app.use("/api/v1/cart", cartRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || err.code || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

export default app;